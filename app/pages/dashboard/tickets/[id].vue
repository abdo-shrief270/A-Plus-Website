<template>
  <div>
    <!-- Top -->
    <div class="flex items-center gap-3 mb-6">
      <UButton
        to="/dashboard/tickets"
        color="neutral"
        variant="soft"
        icon="i-heroicons-arrow-right"
        class="rtl:[&>span:first-child]:rotate-180"
        square
      />
      <div class="flex-1 min-w-0">
        <p class="text-xs text-gray-500">
          <NuxtLink
            to="/dashboard/tickets"
            class="hover:text-primary-600"
          >
            رسائل التواصل
          </NuxtLink>
          <span class="mx-1">›</span>
          <span>تفاصيل الرسالة</span>
        </p>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5 truncate">
          {{ ticket?.subject || '...' }}
        </h1>
      </div>
      <UButton
        v-if="ticket && ticket.status !== 'closed'"
        color="error"
        variant="soft"
        icon="i-heroicons-x-circle"
        :loading="closing"
        @click="closeTicket"
      >
        إغلاق
      </UButton>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex items-center justify-center py-24"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <!-- Not found -->
    <div
      v-else-if="!ticket"
      class="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm"
    >
      <div class="w-20 h-20 mx-auto rounded-2xl bg-error-50 flex items-center justify-center mb-4">
        <UIcon
          name="i-heroicons-chat-bubble-bottom-center-text"
          class="w-10 h-10 text-error-500"
        />
      </div>
      <h2 class="text-lg font-bold text-gray-900 mb-2">
        لم نعثر على هذه الرسالة
      </h2>
      <UButton
        to="/dashboard/tickets"
        color="primary"
      >
        العودة للقائمة
      </UButton>
    </div>

    <div
      v-else
      class="grid grid-cols-1 lg:grid-cols-3 gap-5"
    >
      <!-- Conversation -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Original message -->
        <article class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <header class="flex items-center justify-between gap-3 px-5 py-3 border-b border-gray-100 bg-primary-50/40">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xs">
                {{ initial(ticket.name) }}
              </div>
              <div>
                <p class="text-sm font-bold text-gray-900">
                  {{ ticket.name }}
                </p>
                <p class="text-[11px] text-gray-500">
                  {{ formatDateTime(ticket.created_at) }}
                </p>
              </div>
            </div>
            <UBadge
              :color="statusColor(ticket.status)"
              variant="soft"
              size="sm"
            >
              {{ statusLabel(ticket.status) }}
            </UBadge>
          </header>
          <div class="px-5 py-4 text-sm text-gray-800 leading-relaxed whitespace-pre-line">
            {{ ticket.description }}
          </div>
          <div
            v-if="ticket.attachments?.length"
            class="px-5 pb-4 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2"
          >
            <a
              v-for="att in ticket.attachments"
              :key="att.id"
              :href="att.url"
              target="_blank"
              rel="noopener"
              class="block aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-primary-300 hover:shadow-sm transition"
            >
              <img
                :src="att.url"
                :alt="att.original_name || 'مرفق'"
                class="w-full h-full object-cover"
                loading="lazy"
              >
            </a>
          </div>
        </article>

        <!-- Replies thread -->
        <article
          v-for="reply in (ticket.replies || [])"
          :key="reply.id"
          :class="['rounded-2xl border shadow-sm overflow-hidden', reply.is_staff
            ? 'bg-secondary-50/40 border-secondary-100'
            : 'bg-white border-gray-100']"
        >
          <header class="flex items-center justify-between gap-3 px-5 py-3 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs', reply.is_staff ? 'bg-secondary-500' : 'bg-primary-500']">
                <UIcon
                  v-if="reply.is_staff"
                  name="i-heroicons-shield-check"
                  class="w-4 h-4"
                />
                <span v-else>{{ initial(reply.author?.name) }}</span>
              </div>
              <div>
                <p class="text-sm font-bold text-gray-900">
                  {{ reply.is_staff ? 'فريق الدعم' : (reply.author?.name || 'أنت') }}
                </p>
                <p class="text-[11px] text-gray-500">
                  {{ formatDateTime(reply.created_at) }}
                </p>
              </div>
            </div>
            <UBadge
              v-if="reply.is_staff"
              color="secondary"
              variant="soft"
              size="sm"
            >
              رسمي
            </UBadge>
          </header>
          <div class="px-5 py-4 text-sm text-gray-800 leading-relaxed whitespace-pre-line">
            {{ reply.body }}
          </div>
          <div
            v-if="reply.attachments?.length"
            class="px-5 pb-4 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2"
          >
            <a
              v-for="att in reply.attachments"
              :key="att.id"
              :href="att.url"
              target="_blank"
              rel="noopener"
              class="block aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-primary-300 hover:shadow-sm transition"
            >
              <img
                :src="att.url"
                :alt="att.original_name || 'مرفق'"
                class="w-full h-full object-cover"
                loading="lazy"
              >
            </a>
          </div>
        </article>

        <!-- Reply composer -->
        <div
          v-if="ticket.status !== 'closed'"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div class="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
            <UIcon
              name="i-heroicons-pencil-square"
              class="w-4 h-4 text-primary-600"
            />
            <h3 class="text-sm font-bold text-gray-900">
              إضافة رد
            </h3>
          </div>
          <div class="p-4">
            <UTextarea
              v-model="replyBody"
              placeholder="اكتب ردك هنا..."
              :rows="4"
              class="w-full"
              :disabled="sending"
              :ui="{ base: 'w-full' }"
            />

            <ul
              v-if="replyFiles.length"
              class="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2"
            >
              <li
                v-for="(f, idx) in replyFiles"
                :key="idx"
                class="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
              >
                <img
                  :src="f.preview"
                  :alt="f.file.name"
                  class="w-full h-full object-cover"
                >
                <button
                  type="button"
                  class="absolute top-1 left-1 w-6 h-6 rounded-full bg-error-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  :disabled="sending"
                  @click="removeReplyFile(idx)"
                >
                  <UIcon
                    name="i-heroicons-x-mark"
                    class="w-3.5 h-3.5"
                  />
                </button>
              </li>
            </ul>

            <div class="flex flex-wrap items-center justify-between gap-3 mt-3">
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-gray-300 hover:border-primary-400 hover:bg-primary-50/40 text-sm text-gray-700 transition-colors disabled:opacity-50"
                  :disabled="sending || replyFiles.length >= 10"
                  @click="replyFileInput?.click()"
                >
                  <UIcon
                    name="i-heroicons-photo"
                    class="w-4 h-4"
                  />
                  إرفاق صور ({{ replyFiles.length }}/10)
                </button>
                <input
                  ref="replyFileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  class="hidden"
                  @change="onReplyFilesPicked"
                >
                <p class="text-[11px] text-gray-500">
                  {{ replyBody.length }} / 5000
                </p>
              </div>
              <UButton
                color="primary"
                icon="i-heroicons-paper-airplane"
                :loading="sending"
                :disabled="!replyBody.trim() || sending"
                @click="sendReply"
              >
                إرسال
              </UButton>
            </div>
          </div>
        </div>

        <!-- Closed banner -->
        <div
          v-else
          class="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center gap-3"
        >
          <UIcon
            name="i-heroicons-archive-box"
            class="w-5 h-5 text-gray-500"
          />
          <p class="text-sm text-gray-600">
            هذه الرسالة مغلقة. إذا كنت ترغب في المتابعة، أرسل رسالة جديدة.
          </p>
        </div>
      </div>

      <!-- Sidebar info -->
      <aside class="space-y-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div class="px-5 py-4 border-b border-gray-100">
            <h3 class="font-bold text-gray-900">
              تفاصيل الرسالة
            </h3>
          </div>
          <dl class="divide-y divide-gray-100">
            <div class="px-5 py-3 flex items-center justify-between gap-3">
              <dt class="text-sm text-gray-500">
                الحالة
              </dt>
              <dd>
                <UBadge
                  :color="statusColor(ticket.status)"
                  variant="soft"
                  size="sm"
                >
                  {{ statusLabel(ticket.status) }}
                </UBadge>
              </dd>
            </div>
            <div class="px-5 py-3 flex items-center justify-between gap-3">
              <dt class="text-sm text-gray-500">
                الفئة
              </dt>
              <dd>
                <UBadge
                  :color="categoryColor(ticket.category)"
                  variant="soft"
                  size="sm"
                >
                  {{ categoryLabel(ticket.category) }}
                </UBadge>
              </dd>
            </div>
            <div class="px-5 py-3 flex items-center justify-between gap-3">
              <dt class="text-sm text-gray-500">
                تاريخ الإرسال
              </dt>
              <dd class="text-sm font-semibold text-gray-900">
                {{ formatDate(ticket.created_at) }}
              </dd>
            </div>
            <div
              v-if="ticket.last_reply_at"
              class="px-5 py-3 flex items-center justify-between gap-3"
            >
              <dt class="text-sm text-gray-500">
                آخر رد
              </dt>
              <dd class="text-sm font-semibold text-gray-900">
                {{ formatDate(ticket.last_reply_at) }}
              </dd>
            </div>
            <div class="px-5 py-3 flex items-center justify-between gap-3">
              <dt class="text-sm text-gray-500">
                عدد الردود
              </dt>
              <dd class="text-sm font-bold text-primary-700">
                {{ ticket.replies?.length ?? 0 }}
              </dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ticketsService } from '@/services/api/tickets.service'
import { showToast } from '@/utils/helpers/toast.helper'

definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'تفاصيل الرسالة' })

const route = useRoute()
const id = computed(() => route.params.id as string)

const ticket = ref<any | null>(null)
const loading = ref(true)
const sending = ref(false)
const closing = ref(false)
const replyBody = ref('')

interface PickedFile { file: File, preview: string }
const replyFiles = ref<PickedFile[]>([])
const replyFileInput = ref<HTMLInputElement | null>(null)

function onReplyFilesPicked(e: Event) {
  const input = e.target as HTMLInputElement
  for (const f of Array.from(input.files ?? [])) {
    if (replyFiles.value.length >= 10) break
    if (!f.type.startsWith('image/')) continue
    if (f.size > 5 * 1024 * 1024) continue
    replyFiles.value.push({ file: f, preview: URL.createObjectURL(f) })
  }
  input.value = ''
}

function removeReplyFile(idx: number) {
  const removed = replyFiles.value.splice(idx, 1)[0]
  if (removed) URL.revokeObjectURL(removed.preview)
}

useSeoMeta({
  title: () => `${ticket.value?.subject || 'رسالة'} | A Plus`
})

onMounted(() => fetchTicket())
watch(id, () => fetchTicket())

async function fetchTicket() {
  loading.value = true
  try {
    const res = await ticketsService.show(id.value)
    ticket.value = res.data?.data ?? res.data
  } catch (err) {
    console.error('Failed to load ticket', err)
    ticket.value = null
  } finally {
    loading.value = false
  }
}

async function sendReply() {
  if (!replyBody.value.trim() || sending.value) return
  sending.value = true
  try {
    const files = replyFiles.value.map(f => f.file)
    const res = await ticketsService.reply(id.value, replyBody.value.trim(), files)
    const reply = res.data?.data ?? res.data
    if (ticket.value) {
      ticket.value.replies = [...(ticket.value.replies || []), reply]
      ticket.value.last_reply_at = reply.created_at
    }
    replyBody.value = ''
    replyFiles.value.forEach(f => URL.revokeObjectURL(f.preview))
    replyFiles.value = []
    showToast('تم الإرسال', 'تمت إضافة ردك بنجاح', 'success')
  } catch (err: any) {
    const msg = err?.response?.data?.message || 'تعذّر إرسال الرد'
    showToast('خطأ', msg, 'error')
  } finally {
    sending.value = false
  }
}

async function closeTicket() {
  if (!confirm('هل تريد إغلاق هذه الرسالة؟')) return
  closing.value = true
  try {
    const res = await ticketsService.close(id.value)
    const updated = res.data?.data ?? res.data
    if (ticket.value && updated) ticket.value = { ...ticket.value, ...updated }
    showToast('تم الإغلاق', 'تم إغلاق الرسالة', 'success')
  } catch (err: any) {
    const msg = err?.response?.data?.message || 'تعذّر إغلاق الرسالة'
    showToast('خطأ', msg, 'error')
  } finally {
    closing.value = false
  }
}

function statusLabel(s: string) {
  return ({ open: 'مفتوحة', pending: 'قيد المتابعة', resolved: 'تم حلها', closed: 'مغلقة' })[s] || s
}
function statusColor(s: string) {
  if (s === 'open') return 'primary' as const
  if (s === 'pending') return 'warning' as const
  if (s === 'resolved') return 'success' as const
  return 'neutral' as const
}
function categoryLabel(c: string) {
  return ({
    inquiry: 'استفسار',
    complaint: 'شكوى',
    suggestion: 'اقتراح',
    technical: 'مشكلة تقنية',
    billing: 'الدفع والفواتير',
    other: 'أخرى'
  } as Record<string, string>)[c] || c
}
function categoryColor(c: string) {
  if (c === 'complaint') return 'error' as const
  if (c === 'suggestion') return 'success' as const
  if (c === 'technical') return 'warning' as const
  if (c === 'billing') return 'info' as const
  if (c === 'other') return 'neutral' as const
  return 'primary' as const
}
function formatDate(iso?: string) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch { return iso }
}
function formatDateTime(iso?: string) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString('ar-EG', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  } catch { return iso }
}
function initial(name?: string) {
  return (name?.trim()?.charAt(0) ?? 'A').toUpperCase()
}
</script>
