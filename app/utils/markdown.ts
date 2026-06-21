import { marked } from 'marked'

/**
 * Render an admin-supplied markdown string to HTML.
 *
 * Notes:
 * - Content originates from the admin (Filament) — no end-user input — so we
 *   skip a sanitizer to keep the bundle small. If user-generated content ever
 *   reaches this helper, switch to DOMPurify.
 * - `breaks: true` keeps single line breaks intact (important for questions
 *   that lay out comparison values across short lines).
 * - Bare URLs that look like images (e.g. Wiris LaTeX-as-SVG, .png/.jpg/.svg
 *   ...) are promoted from link tokens to image tokens so they render inline
 *   instead of as plain links. This is what surfaces math equations that are
 *   rendered server-side.
 */
marked.setOptions({
  gfm: true,
  breaks: true
})

const IMAGE_EXTENSIONS = /\.(png|jpe?g|gif|svg|webp|bmp|avif)(\?|#|$)/i
const IMAGE_FORMAT_QUERY = /[?&]format=(svg|png|jpe?g|gif|webp|bmp|avif)\b/i
const IMAGE_HOST_HINTS = /(wiris\.net|wiris\.com|latex\.codecogs\.com)/i

function looksLikeImage(href: string | null | undefined): boolean {
  if (!href) return false
  return IMAGE_EXTENSIONS.test(href)
    || IMAGE_FORMAT_QUERY.test(href)
    || IMAGE_HOST_HINTS.test(href)
}

function clearImageMetadata(token: Record<string, unknown>) {
  // Marked's image renderer pulls alt from inline tokens (token.tokens), not
  // from `text`. Wipe both so the image renders without alt/title — keeps the
  // URL or admin-pasted caption from showing under the equation image.
  token.text = ''
  token.title = null
  token.tokens = []
}

marked.use({
  walkTokens(token) {
    if (token.type === 'link') {
      const link = token as { href?: string }
      if (!looksLikeImage(link.href)) return
      const t = token as Record<string, unknown>
      t.type = 'image'
      clearImageMetadata(t)
    } else if (token.type === 'image') {
      clearImageMetadata(token as Record<string, unknown>)
    }
  }
})

// Trix-style attachment blocks ship with a `<figcaption>` that surfaces the
// raw filename + file size — visual noise we don't want next to inline images
// in the question/answer body. Strip them before handing the text to marked.
const TRIX_FIGCAPTION = /<figcaption\b[^>]*>[\s\S]*?<\/figcaption>/gi

function stripAttachmentMetadata(text: string): string {
  return text.replace(TRIX_FIGCAPTION, '')
}

// Anchor tags whose href is an image URL (Wiris LaTeX, .png/.jpg/.svg, ...).
// These come from rich-text editors that auto-link pasted URLs *inside HTML*
// — marked passes that HTML through unchanged, so the walkTokens promotion
// never fires. We do the same swap as a post-process pass.
const ANCHOR_TAG = /<a\b([^>]*)\bhref\s*=\s*(?:"([^"]+)"|'([^']+)')[^>]*>[\s\S]*?<\/a>/gi

function imagifyAnchors(html: string): string {
  return html.replace(ANCHOR_TAG, (full, _attrs: string, hrefDouble: string, hrefSingle: string) => {
    const href = hrefDouble ?? hrefSingle ?? ''
    if (!looksLikeImage(href)) return full
    return `<img src="${href}" alt="">`
  })
}

// Bare URLs that sit inside raw HTML (e.g. `<p>https://wiris.net/…</p>`).
// Marked passes whole HTML blocks through without inspecting their text
// content, so neither the walkTokens nor the anchor pass would catch these.
// We scan the rendered output and swap any image-looking URL for an `<img>`,
// being careful to skip URLs that already live inside an attribute value.
const BARE_URL = /(?<!["'=])(https?:\/\/[^\s<>"'`]+)/gi

function imagifyBareUrls(html: string): string {
  return html.replace(BARE_URL, (url) => {
    if (!looksLikeImage(url)) return url
    return `<img src="${url}" alt="">`
  })
}

export function renderMarkdown(text?: string | null): string {
  if (!text) return ''
  try {
    const html = marked.parse(stripAttachmentMetadata(String(text))) as string
    return imagifyBareUrls(imagifyAnchors(html))
  } catch {
    return String(text)
  }
}
