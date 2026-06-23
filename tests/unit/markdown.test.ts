import { describe, it, expect } from 'vitest'
import { renderMarkdown } from '@/utils/markdown'

describe('renderMarkdown', () => {
  it('returns empty string for empty/null input', () => {
    expect(renderMarkdown('')).toBe('')
    expect(renderMarkdown(null)).toBe('')
    expect(renderMarkdown(undefined)).toBe('')
  })

  it('renders basic markdown to HTML', () => {
    const html = renderMarkdown('**قوي**')
    expect(html).toContain('<strong>')
    expect(html).toContain('قوي')
  })

  it('promotes image-looking bare links to inline <img> (math equations)', () => {
    const html = renderMarkdown('[eq](https://latex.codecogs.com/svg.image?x^2)')
    expect(html).toContain('<img')
    expect(html).toContain('latex.codecogs.com')
  })

  it('keeps a normal link as an anchor, not an image', () => {
    const html = renderMarkdown('[site](https://example.com/page)')
    expect(html).toContain('<a')
    expect(html).not.toContain('<img')
  })
})
