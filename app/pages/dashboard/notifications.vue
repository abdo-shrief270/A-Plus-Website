<template>
  <div class="max-w-3xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          الإشعارات
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          {{ unreadCount > 0 ? `${unreadCount} إشعار غير مقروء` : 'كل إشعاراتك في مكان واحد' }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center bg-gray-100 rounded-xl p-1">
          <button
            v-for="f in filters"
            :key="f.value"
            type="button"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
              filter === f.value ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            ]"
            @click="setFilter(f.value)"
          >
            {{ f.label }}
          </button>
        </div>
        <UButton
          v-if="unreadCount > 0"
          color="primary"
          variant="soft"
          size="sm"
          icon="i-heroicons-check"
          :loading="markingAll"
          @click="markAllRead"
        >
          تعليم الكل كمقروء
        </UButton>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="loading && !items.length"
      class="flex items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <!-- Empty -->
    <div
      v-else-if="!items.length"
      class="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm"
    >
      <UIcon
        name="i-heroicons-bell-slash"
        class="w-12 h-12 text-gray-300 mx-auto mb-3"
      />
      <p class="text-sm text-gray-500">
        {{ filter === 'unread' ? 'لا توجد إشعارات غير مقروءة' : 'لا توجد إشعارات بعد' }}
      </p>
    </div>

    <!-- List -->
    <div
      v-else
      class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50"
    >
      <button
        v-for="n in items"
        :key="n.id"
        type="button"
        :class="[
          'w-full flex items-start gap-3 px-5 py-4 text-right transition-colors',
          !n.read_at ? 'bg-primary-50/40 hover:bg-primary-50/70' : 'hover:bg-gray-50',
          n.link ? 'cursor-pointer' : 'cursor-default'
        ]"
        @click="onItemClick(n)"
      >
        <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0', notifBg(n.color)]">
          <UIcon
            :name="n.icon || 'i-heroicons-bell'"
            :class="['w-5 h-5', notifColor(n.color)]"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p
            class="text-sm text-gray-900"
            :class="!n.read_at ? 'font-bold' : 'font-medium'"
          >
            {{ n.title }}
          </p>
          <p
            v-if="n.description"
            class="text-xs text-gray-600 mt-0.5 whitespace-pre-line"
          >
            {{ n.description }}
          </p>
          <p class="text-[11px] text-gray-400 mt-1">
            {{ relativeTime(n.created_at) }}
          </p>
        </div>
        <div
          v-if="!n.read_at"
          class="w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-2"
        />
      </button>
    </div>

    <!-- Load more -->
    <div
      v-if="hasMore"
      class="flex justify-center mt-5"
    >
      <UButton
        color="neutral"
        variant="soft"
        :loading="loading"
        @click="loadMore"
      >
        عرض المزيد
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { notificationsService, type Notification } from '@/services/api/notifications.service'

definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'الإشعارات' })
useSeoMeta({ title: 'الإشعارات | A Plus' })

const filters = [
  { value: 'all' as const, label: 'الكل' },
  { value: 'unread' as const, label: 'غير المقروءة' }
]

const loading = ref(true)
const markingAll = ref(false)
const items = ref<Notification[]>([])
const unreadCount = ref(0)
const filter = ref<'all' | 'unread'>('all')
const page = ref(1)
const lastPage = ref(1)

const hasMore = computed(() => page.value < lastPage.value)

async function load(reset = true) {
  loading.value = true
  try {
    const next = reset ? 1 : page.value + 1
    const res = await notificationsService.list({
      page: next,
      per_page: 20,
      unread_only: filter.value === 'unread' ? 1 : undefined
    })
    const data = res.data?.data ?? {}
    const list: Notification[] = data.notifications ?? []
    items.value = reset ? list : [...items.value, ...list]
    unreadCount.value = data.unread_count ?? unreadCount.value
    page.value = data.pagination?.current_page ?? next
    lastPage.value = data.pagination?.last_page ?? next
  } catch (err) {
    console.error('Failed to load notifications', err)
    if (reset) items.value = []
  } finally {
    loading.value = false
  }
}

function setFilter(f: 'all' | 'unread') {
  if (filter.value === f) return
  filter.value = f
  load(true)
}

function loadMore() {
  if (!loading.value && hasMore.value) load(false)
}

async function onItemClick(n: Notification) {
  if (!n.read_at) {
    n.read_at = new Date().toISOString()
    unreadCount.value = Math.max(0, unreadCount.value - 1)
    notificationsService.markRead(n.id).catch(() => {})
    // In the unread filter, drop the now-read item.
    if (filter.value === 'unread') {
      items.value = items.value.filter(x => x.id !== n.id)
    }
  }
  if (n.link) navigateTo(n.link)
}

async function markAllRead() {
  if (markingAll.value || unreadCount.value === 0) return
  markingAll.value = true
  try {
    await notificationsService.markAllRead()
    items.value = filter.value === 'unread'
      ? []
      : items.value.map(n => ({ ...n, read_at: n.read_at ?? new Date().toISOString() }))
    unreadCount.value = 0
  } catch (err) {
    console.error('Failed to mark all read', err)
  } finally {
    markingAll.value = false
  }
}

function notifBg(color: string) {
  return ({
    success: 'bg-success-50', error: 'bg-error-50', warning: 'bg-warning-50',
    info: 'bg-info-50', primary: 'bg-primary-50', secondary: 'bg-secondary-50'
  } as Record<string, string>)[color] || 'bg-gray-100'
}
function notifColor(color: string) {
  return ({
    success: 'text-success-600', error: 'text-error-600', warning: 'text-warning-600',
    info: 'text-info-600', primary: 'text-primary-600', secondary: 'text-secondary-600'
  } as Record<string, string>)[color] || 'text-gray-500'
}

function relativeTime(iso?: string) {
  if (!iso) return ''
  const diff = Math.max(0, Date.now() - new Date(iso).getTime())
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'الآن'
  if (min < 60) return `منذ ${min} د`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `منذ ${hr} س`
  const days = Math.floor(hr / 24)
  if (days < 30) return `منذ ${days} ي`
  return new Date(iso).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })
}

onMounted(() => load(true))
</script>
