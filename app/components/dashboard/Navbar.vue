<template>
  <header class="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
    <div class="flex items-center h-16 px-4 sm:px-6 gap-3">
      <!-- Mobile sidebar toggle -->
      <button
        type="button"
        class="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        :aria-label="'فتح القائمة'"
        @click="mobileOpen = true"
      >
        <UIcon
          name="i-heroicons-bars-3"
          class="w-6 h-6"
        />
      </button>

      <!-- Page title + greeting -->
      <div class="flex-1 min-w-0">
        <p class="text-[11px] text-gray-400 hidden sm:block">
          {{ greeting }}، {{ user?.name }}
        </p>
        <h1 class="text-base sm:text-lg font-bold text-gray-900 truncate">
          {{ pageTitle }}
        </h1>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1 sm:gap-2">
        <!-- Points pill (student only) -->
        <NuxtLink
          v-if="authStore.isStudent"
          to="/dashboard/subscriptions"
          class="hidden sm:flex items-center gap-2 h-10 px-3 rounded-xl border bg-gradient-to-l from-secondary-50 to-primary-50 border-primary-100 hover:border-primary-300 hover:shadow-sm transition-all group"
          title="نقاطك"
        >
          <div class="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
            <UIcon
              :name="walletState.hasUnlimited ? 'i-heroicons-sparkles' : 'i-heroicons-star'"
              :class="['w-4 h-4', walletState.hasUnlimited ? 'text-secondary-600' : 'text-primary-600']"
            />
          </div>
          <div class="flex flex-col leading-tight">
            <span class="text-[10px] text-gray-500 font-medium">
              رصيدك
            </span>
            <span class="flex items-center gap-1 text-sm font-bold text-gray-900">
              <UIcon
                v-if="walletState.hasUnlimited"
                name="i-mdi-infinity"
                class="w-4 h-4 text-secondary-600"
              />
              <span v-else>
                {{ formatPoints(walletState.points) }}
              </span>
            </span>
          </div>
        </NuxtLink>

        <!-- League score (earned points) — live, links to leaderboard -->
        <NuxtLink
          v-if="authStore.isStudent"
          to="/dashboard/leaderboard"
          class="hidden sm:flex items-center gap-2 h-10 px-3 rounded-xl border bg-gradient-to-l from-warning-50 to-white border-warning-100 hover:border-warning-300 hover:shadow-sm transition-all"
          title="نقاطي في الدوري"
        >
          <div class="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
            <UIcon
              name="i-heroicons-trophy"
              class="w-4 h-4 text-warning-600"
            />
          </div>
          <div class="flex flex-col leading-tight">
            <span class="text-[10px] text-gray-500 font-medium">
              نقاطي
            </span>
            <span class="text-sm font-bold text-gray-900">
              {{ formatPoints(walletState.score) }}
            </span>
          </div>
        </NuxtLink>

        <!-- Fast actions popover -->
        <UPopover
          v-model:open="fastActionsOpen"
          :content="{ side: 'bottom', align: 'end', sideOffset: 8 }"
          :ui="{ content: 'w-72 rounded-2xl shadow-lg' }"
        >
          <button
            type="button"
            class="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            :aria-label="'إجراءات سريعة'"
            title="إجراءات سريعة"
          >
            <UIcon
              name="i-heroicons-bolt"
              class="w-5 h-5"
            />
          </button>
          <template #content>
            <div class="bg-white rounded-2xl overflow-hidden">
              <div class="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <UIcon
                  name="i-heroicons-bolt"
                  class="w-4 h-4 text-secondary-600"
                />
                <h3 class="text-sm font-bold text-gray-900">
                  إجراءات سريعة
                </h3>
              </div>
              <div class="p-1.5 grid grid-cols-2 gap-1">
                <button
                  v-for="action in fastActions"
                  :key="action.label"
                  type="button"
                  class="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 transition-colors text-center group"
                  @click="action.run"
                >
                  <div :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-colors', action.iconBg]">
                    <UIcon
                      :name="action.icon"
                      :class="['w-5 h-5', action.iconColor]"
                    />
                  </div>
                  <span class="text-xs font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                    {{ action.label }}
                  </span>
                </button>
              </div>
            </div>
          </template>
        </UPopover>

        <!-- Notifications -->
        <UPopover
          v-model:open="notificationsOpen"
          :content="{ side: 'bottom', align: 'end', sideOffset: 8 }"
          :ui="{ content: 'w-80 sm:w-96 rounded-2xl shadow-lg' }"
          @update:open="onNotificationsOpen"
        >
          <button
            type="button"
            class="relative flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            :aria-label="'الإشعارات'"
          >
            <UIcon
              :name="unreadCount > 0 ? 'i-heroicons-bell-alert' : 'i-heroicons-bell'"
              class="w-5 h-5"
              :class="unreadCount > 0 ? 'text-primary-600' : ''"
            />
            <span
              v-if="unreadCount > 0"
              class="absolute -top-0.5 -left-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-error-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white"
            >
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          </button>

          <template #content>
            <div class="bg-white rounded-2xl overflow-hidden">
              <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <UIcon
                    name="i-heroicons-bell"
                    class="w-4 h-4 text-primary-600"
                  />
                  الإشعارات
                  <span
                    v-if="unreadCount > 0"
                    class="text-[11px] bg-error-100 text-error-700 px-2 py-0.5 rounded-full font-bold"
                  >
                    {{ unreadCount }} جديد
                  </span>
                </h3>
                <button
                  v-if="unreadCount > 0"
                  type="button"
                  class="text-[11px] text-primary-600 hover:text-primary-700 font-semibold disabled:text-gray-400"
                  :disabled="markingAll"
                  @click="markAllRead"
                >
                  تعليم الكل كمقروء
                </button>
              </div>

              <div
                v-if="loading"
                class="py-10 text-center"
              >
                <UIcon
                  name="i-heroicons-arrow-path"
                  class="w-5 h-5 text-primary-500 animate-spin"
                />
              </div>

              <div
                v-else-if="!notifications.length"
                class="py-10 text-center text-xs text-gray-500"
              >
                <UIcon
                  name="i-heroicons-bell-slash"
                  class="w-8 h-8 text-gray-300 mx-auto mb-2"
                />
                لا توجد إشعارات حالياً
              </div>

              <ul
                v-else
                class="max-h-96 overflow-y-auto divide-y divide-gray-100"
              >
                <li
                  v-for="n in notifications"
                  :key="n.id"
                  :class="[
                    'transition-colors',
                    !n.read_at ? 'bg-primary-50/40 hover:bg-primary-50/70' : 'hover:bg-gray-50'
                  ]"
                >
                  <button
                    type="button"
                    class="w-full flex items-start gap-3 px-4 py-3 text-right cursor-pointer"
                    :class="n.link ? '' : 'cursor-default'"
                    @click="onItemClick(n)"
                  >
                    <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shrink-0', notifBg(n.color)]">
                      <UIcon
                        :name="n.icon || 'i-heroicons-bell'"
                        :class="['w-4 h-4', notifColor(n.color)]"
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
                        class="text-xs text-gray-600 line-clamp-2 mt-0.5"
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
                </li>
              </ul>

              <!-- View all -->
              <NuxtLink
                to="/dashboard/notifications"
                class="block px-4 py-3 text-center text-xs font-bold text-primary-600 hover:bg-primary-50/60 border-t border-gray-100 transition-colors"
                @click="notificationsOpen = false"
              >
                عرض كل الإشعارات
              </NuxtLink>
            </div>
          </template>
        </UPopover>

        <div class="hidden sm:block w-px h-6 bg-gray-200 mx-1" />

        <!-- User chip -->
        <UPopover
          :content="{ side: 'bottom', align: 'end', sideOffset: 8 }"
          :ui="{ content: 'w-72 rounded-2xl shadow-lg' }"
        >
          <button
            type="button"
            class="flex items-center gap-2 h-10 pr-1.5 pl-3 rounded-full hover:bg-gray-100 transition-colors group"
          >
            <div class="relative shrink-0">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xs ring-2 ring-transparent group-hover:ring-primary-200 transition-shadow">
                {{ userInitial }}
              </div>
              <div class="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 rounded-full bg-success-500 ring-2 ring-white" />
            </div>
            <span class="hidden sm:block text-sm font-semibold text-gray-900 max-w-[120px] truncate">
              {{ user?.name }}
            </span>
            <UIcon
              name="i-heroicons-chevron-down"
              class="w-4 h-4 text-gray-400 hidden sm:block transition-transform"
            />
          </button>

          <template #content>
            <div class="bg-white rounded-2xl overflow-hidden">
              <div class="px-4 py-4 bg-gradient-to-l from-primary-50 to-white flex items-center gap-3 border-b border-gray-100">
                <div class="relative shrink-0">
                  <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold shadow-sm">
                    {{ userInitial }}
                  </div>
                  <div class="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full bg-success-500 ring-2 ring-white" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-gray-900 truncate">
                    {{ user?.name || '—' }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">
                    {{ roleLabel }}
                  </p>
                  <p
                    v-if="user?.email || user?.phone"
                    class="text-[11px] text-gray-400 truncate mt-0.5"
                    dir="ltr"
                  >
                    {{ user?.email || user?.phone }}
                  </p>
                </div>
              </div>

              <nav class="p-1.5">
                <NuxtLink
                  v-for="link in menuLinks"
                  :key="link.to"
                  :to="link.to"
                  class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <UIcon
                    :name="link.icon"
                    class="w-4 h-4 text-gray-500"
                  />
                  <span class="flex-1">{{ link.label }}</span>
                  <UIcon
                    name="i-heroicons-chevron-left"
                    class="w-3.5 h-3.5 text-gray-400"
                  />
                </NuxtLink>
              </nav>

              <div class="px-1.5 pb-1.5 pt-1 border-t border-gray-100">
                <button
                  type="button"
                  class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-error-600 hover:bg-error-50 transition-colors"
                  @click="logoutOpen = true"
                >
                  <UIcon
                    name="i-heroicons-arrow-right-on-rectangle"
                    class="w-4 h-4"
                  />
                  <span class="flex-1 text-right">تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </template>
        </UPopover>
      </div>
    </div>

    <DashboardLogoutConfirmModal v-model:open="logoutOpen" />
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { notificationsService, type Notification } from '@/services/api/notifications.service'

const authStore = useAuthStore()
const { mobileOpen } = useDashboardSidebar()
const { activeItem } = useDashboardActiveItem()
const labels = useEntityLabels()

const wallet = useStudentWallet()
const walletState = wallet.state

function formatPoints(n: number) {
  return new Intl.NumberFormat('ar-EG').format(n)
}

const user = computed(() => authStore.getUser)
const userInitial = computed(() => user.value?.name?.charAt(0)?.toUpperCase() ?? 'A')

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 5) return 'مساء الخير'
  if (hour < 12) return 'صباح الخير'
  if (hour < 18) return 'مساء النور'
  return 'مساء الخير'
})

const route = useRoute()
const pageTitle = computed(() => {
  const metaTitle = route.meta.title as string | undefined
  if (metaTitle) return metaTitle
  if (activeItem.value) return activeItem.value.label
  return 'لوحة التحكم'
})

const logoutOpen = ref(false)

const roleLabel = computed(() => {
  if (authStore.isSchool) return 'مدرسة'
  if (authStore.isParent) return 'ولي أمر'
  if (authStore.isStudent) return 'طالب'
  return ''
})

const menuLinks = [
  { label: 'الملف الشخصي', icon: 'i-heroicons-user-circle', to: '/dashboard/profile' },
  { label: 'الأمان والتحقق', icon: 'i-heroicons-shield-check', to: '/dashboard/settings/security' },
  { label: 'الأجهزة', icon: 'i-heroicons-device-phone-mobile', to: '/dashboard/devices' },
  { label: 'الإعدادات', icon: 'i-heroicons-cog-6-tooth', to: '/dashboard/settings' }
]

const modals = useCreationModals()
const fastActionsOpen = ref(false)
const notificationsOpen = ref(false)

function openModal(flag: Ref<boolean>) {
  fastActionsOpen.value = false
  // tiny delay so the popover closes cleanly before the modal animates in
  nextTick(() => {
    flag.value = true
  })
}

const fastActions = computed(() => {
  const actions: any[] = []
  if (!authStore.isStudent) {
    actions.push({
      label: labels.value.addAction,
      icon: 'i-heroicons-user-plus',
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary-600',
      run: () => openModal(modals.addKid)
    })
  }
  actions.push(
    {
      label: authStore.isStudent ? 'تسجيل في كورس' : 'تسجيل في كورس',
      icon: 'i-heroicons-academic-cap',
      iconBg: 'bg-success-50',
      iconColor: 'text-success-600',
      run: () => openModal(modals.enrollCourse)
    },
    {
      label: 'اشتراك في باقة',
      icon: 'i-heroicons-credit-card',
      iconBg: 'bg-secondary-50',
      iconColor: 'text-secondary-600',
      run: () => openModal(modals.subscribePlan)
    },
    {
      label: 'رسالة دعم',
      icon: 'i-heroicons-chat-bubble-left-right',
      iconBg: 'bg-info-50',
      iconColor: 'text-info-600',
      run: () => openModal(modals.newTicket)
    }
  )
  return actions
})

// Notifications
const notifications = ref<Notification[]>([])
const unreadCount = ref(0)
const loading = ref(false)
const markingAll = ref(false)
let pollHandle: ReturnType<typeof setInterval> | null = null

// `silent` polls (every 2s) refresh data WITHOUT toggling the spinner, so the
// open dropdown doesn't flash a loading state. Only the first/explicit fetch
// (with no cached list yet) shows the spinner.
async function fetchNotifications(silent = true) {
  if (!silent || !notifications.value.length) {
    loading.value = true
  }
  try {
    const res = await notificationsService.list({ per_page: 15 })
    const data = res.data?.data ?? res.data ?? {}
    notifications.value = data.notifications ?? []
    unreadCount.value = data.unread_count ?? 0
  } catch {
    // silent — no toast spam if a poll fails
  } finally {
    loading.value = false
  }
}

function onNotificationsOpen(open: boolean) {
  if (open) fetchNotifications(false)
}

async function onItemClick(n: Notification) {
  // Close the popover first so it doesn't sit on top of whatever we navigate to.
  notificationsOpen.value = false

  // Optimistically mark as read.
  if (!n.read_at) {
    n.read_at = new Date().toISOString()
    unreadCount.value = Math.max(0, unreadCount.value - 1)
    notificationsService.markRead(n.id).catch(() => {
      // best-effort — server-side stays unread, will retry on next open.
    })
  }

  // Navigate to whatever the notification points at, if anything.
  if (n.link) {
    await navigateTo(n.link)
  }
}

async function markAllRead() {
  if (markingAll.value || unreadCount.value === 0) return
  markingAll.value = true
  try {
    await notificationsService.markAllRead()
    notifications.value = notifications.value.map(n => ({ ...n, read_at: n.read_at ?? new Date().toISOString() }))
    unreadCount.value = 0
  } finally {
    markingAll.value = false
  }
}

function notifBg(color?: string) {
  if (color === 'success') return 'bg-success-50'
  if (color === 'warning') return 'bg-warning-50'
  if (color === 'error') return 'bg-error-50'
  if (color === 'secondary') return 'bg-secondary-50'
  return 'bg-primary-50'
}
function notifColor(color?: string) {
  if (color === 'success') return 'text-success-600'
  if (color === 'warning') return 'text-warning-600'
  if (color === 'error') return 'text-error-600'
  if (color === 'secondary') return 'text-secondary-600'
  return 'text-primary-600'
}
function relativeTime(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso).getTime()
  const diff = Math.max(0, Date.now() - d)
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'الآن'
  if (min < 60) return `منذ ${min} د`
  const hrs = Math.floor(min / 60)
  if (hrs < 24) return `منذ ${hrs} س`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `منذ ${days} ي`
  return new Date(iso).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })
}

const POLL_MS = 2_000

function startPolling() {
  if (pollHandle) return
  pollHandle = setInterval(fetchNotifications, POLL_MS)
}
function stopPolling() {
  if (pollHandle) {
    clearInterval(pollHandle)
    pollHandle = null
  }
}

// Only poll while the tab is visible — a 2s poll from idle background tabs
// would needlessly hammer the server. Resume (and refresh once) on return.
function onVisibilityChange() {
  if (document.hidden) {
    stopPolling()
  } else {
    fetchNotifications()
    startPolling()
  }
}

onMounted(() => {
  fetchNotifications()
  startPolling()
  document.addEventListener('visibilitychange', onVisibilityChange)
  if (authStore.isStudent) wallet.refresh()
})
onBeforeUnmount(() => {
  stopPolling()
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>
