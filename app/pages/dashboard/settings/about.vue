<template>
  <div>
    <!-- Top -->
    <div class="flex items-center gap-3 mb-6">
      <UButton
        to="/dashboard/settings"
        color="neutral"
        variant="soft"
        icon="i-heroicons-arrow-right"
        class="rtl:[&>span:first-child]:rotate-180"
        square
      />
      <div>
        <p class="text-xs text-gray-500">
          <NuxtLink
            to="/dashboard/settings"
            class="hover:text-primary-600"
          >
            الإعدادات
          </NuxtLink>
          <span class="mx-1">›</span>
          <span>حول المنصة</span>
        </p>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
          حول المنصة
        </h1>
      </div>
    </div>

    <div
      v-if="loading"
      class="flex items-center justify-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <div
      v-else
      class="space-y-6"
    >
      <section
        v-if="generalSettings.length"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div class="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <UIcon
            name="i-heroicons-information-circle"
            class="w-5 h-5 text-primary-600"
          />
          <h2 class="font-bold text-gray-900">
            معلومات المنصة
          </h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-100">
          <div
            v-for="setting in generalSettings"
            :key="setting.key"
            class="px-5 py-4 bg-white"
          >
            <p class="text-[11px] font-bold text-primary-600 uppercase tracking-wider mb-1">
              {{ setting.name_ar || prettyKey(setting.key) }}
            </p>
            <p
              class="text-sm text-gray-900 break-words"
              :title="setting.value ?? ''"
            >
              {{ setting.value || 'غير محدد' }}
            </p>
          </div>
        </div>
      </section>

      <section
        v-if="socialSettings.length"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div class="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <UIcon
            name="i-heroicons-globe-alt"
            class="w-5 h-5 text-primary-600"
          />
          <h2 class="font-bold text-gray-900">
            تواصل معنا
          </h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
          <a
            v-for="link in socialSettings"
            :key="link.key"
            :href="resolveLinkHref(link)"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary-300 hover:bg-primary-50/40 transition-colors group"
          >
            <div class="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-primary-100 flex items-center justify-center shrink-0 transition-colors">
              <UIcon
                :name="getSocialIcon(link.key)"
                class="w-5 h-5 text-gray-500 group-hover:text-primary-600 transition-colors"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-900 truncate">
                {{ link.name_ar || prettyKey(link.key) }}
              </p>
              <p
                class="text-xs text-gray-500 truncate mt-0.5"
                dir="ltr"
              >
                {{ link.value || 'غير محدد' }}
              </p>
            </div>
          </a>
        </div>
      </section>

      <section
        v-if="cmsPages.length"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div class="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <UIcon
            name="i-heroicons-document-check"
            class="w-5 h-5 text-primary-600"
          />
          <h2 class="font-bold text-gray-900">
            السياسات والصفحات
          </h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
          <NuxtLink
            v-for="page in cmsPages"
            :key="page.slug"
            :to="`/${page.slug}`"
            class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary-300 hover:bg-primary-50/40 transition-colors group"
          >
            <div class="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-primary-100 flex items-center justify-center shrink-0 transition-colors">
              <UIcon
                :name="normalizeIcon(page.icon) || 'i-heroicons-document-text'"
                class="w-5 h-5 text-gray-500 group-hover:text-primary-600 transition-colors"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-900 truncate">
                {{ page.title }}
              </p>
              <p
                class="text-xs text-gray-500 truncate mt-0.5"
                dir="ltr"
              >
                /{{ page.slug }}
              </p>
            </div>
            <UIcon
              name="i-heroicons-arrow-left"
              class="w-4 h-4 text-gray-300 group-hover:text-primary-600 transition-colors"
            />
          </NuxtLink>
        </div>
      </section>

      <div
        v-if="!generalSettings.length && !socialSettings.length && !cmsPages.length"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center"
      >
        <UIcon
          name="i-heroicons-information-circle"
          class="w-10 h-10 text-gray-300 mx-auto mb-3"
        />
        <p class="text-sm text-gray-500">
          لا توجد بيانات معلوماتية متاحة حالياً.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { settingsService } from '@/services/api/settings.service'
import { pagesService, type CmsPage } from '@/services/api/pages.service'

definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'حول المنصة' })
useSeoMeta({ title: 'حول المنصة | A Plus' })

interface SettingItem {
  key: string
  value?: string | null
  name_ar?: string | null
  group?: string | null
}

const loading = ref(true)
const settings = ref<SettingItem[]>([])
const cmsPages = ref<CmsPage[]>([])

const generalSettings = computed(() =>
  settings.value.filter(s => s.group === 'general' || (!s.group && !isSocial(s.key) && !isLegal(s.key)))
)
const socialSettings = computed(() =>
  settings.value.filter(s => s.group === 'social' || isSocial(s.key))
)

onMounted(async () => {
  loading.value = true
  try {
    const [settingsRes, pagesRes] = await Promise.all([
      settingsService.getSettings(),
      pagesService.list()
    ])
    const settingsData = settingsRes.data?.data || settingsRes.data
    const list: SettingItem[] = Array.isArray(settingsData) ? settingsData : (settingsData?.settings || [])
    settings.value = list.filter((s: SettingItem) => !isLegal(s.key))

    const pagesData = pagesRes.data?.data ?? pagesRes.data ?? []
    cmsPages.value = Array.isArray(pagesData) ? pagesData : (pagesData?.pages || [])
  } catch (err) {
    console.error('Failed to load about page', err)
    settings.value = []
    cmsPages.value = []
  } finally {
    loading.value = false
  }
})

function isSocial(key: string) {
  const soc = ['facebook', 'twitter', 'instagram', 'linkedin', 'whatsapp', 'snapchat', 'youtube', 'phone', 'email', 'mail', 'tiktok']
  return soc.some(s => key.toLowerCase().includes(s))
}

function isLegal(key: string) {
  const leg = ['terms', 'privacy', 'policy', 'about', 'refund']
  return leg.some(l => key.toLowerCase().includes(l))
}

function getSocialIcon(key: string) {
  const k = key.toLowerCase()
  if (k.includes('whatsapp')) return 'i-heroicons-chat-bubble-bottom-center-text'
  if (k.includes('phone')) return 'i-heroicons-device-phone-mobile'
  if (k.includes('mail') || k.includes('email')) return 'i-heroicons-envelope'
  if (k.includes('youtube')) return 'i-heroicons-play-circle'
  if (k.includes('twitter') || k.includes('x_handle')) return 'i-heroicons-link'
  return 'i-heroicons-globe-alt'
}

function resolveLinkHref(link: SettingItem): string {
  const v: string = link.value ?? ''
  if (!v) return '#'
  if (v.startsWith('http')) return v
  const k = link.key.toLowerCase()
  if (k.includes('mail') || k.includes('email')) return `mailto:${v}`
  if (k.includes('whatsapp')) {
    const digits = v.replace(/[^0-9]/g, '')
    return `https://wa.me/${digits}`
  }
  if (k.includes('phone')) return `tel:${v}`
  return v.startsWith('//') ? `https:${v}` : `https://${v}`
}

function prettyKey(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function normalizeIcon(icon: string | null | undefined): string {
  if (!icon) return ''
  // Convert Filament-style "heroicon-o-foo" / "heroicon-s-foo" → Iconify "i-heroicons-foo"
  const m = icon.match(/^heroicon-[osm]-(.+)$/)
  if (m) return `i-heroicons-${m[1]}`
  return icon
}
</script>
