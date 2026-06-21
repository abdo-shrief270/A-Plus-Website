<template>
  <UModal
    :open="open"
    :ui="{ content: 'sm:max-w-2xl' }"
    @update:open="onOpenChange"
  >
    <template #content>
      <div class="bg-white rounded-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center shrink-0">
              <UIcon
                name="i-heroicons-credit-card"
                class="w-5 h-5 text-secondary-600"
              />
            </div>
            <div class="min-w-0">
              <h3 class="text-base font-bold text-gray-900 truncate">
                اشتراك جديد
              </h3>
              <p class="text-xs text-gray-500 truncate">
                {{ effectiveplan?.name || `اختر الباقة و${labels.plural}` }}
              </p>
            </div>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            size="sm"
            :disabled="submitting"
            @click="onOpenChange(false)"
          />
        </div>

        <div class="px-6 py-5 space-y-5">
          <!-- Plan picker -->
          <div v-if="!plan">
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">
              اختر الباقة <span class="text-error-500">*</span>
            </label>
            <USelect
              v-model="pickedPlanId"
              :items="planOptions"
              :loading="plansLoading"
              :disabled="plansLoading || submitting"
              placeholder="اختر الباقة"
              size="lg"
            />
          </div>

          <!-- Plan summary -->
          <div
            v-if="effectiveplan"
            class="bg-gradient-to-l from-secondary-50 to-primary-50 rounded-xl p-4 border border-secondary-100"
          >
            <div class="flex items-start gap-3">
              <div class="w-12 h-12 rounded-lg bg-secondary-500 flex items-center justify-center text-white shrink-0">
                <UIcon
                  :name="effectiveplan.type === 'subscription' ? 'i-heroicons-calendar-days' : 'i-heroicons-gift'"
                  class="w-6 h-6"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-gray-900 truncate">
                  {{ effectiveplan.name }}
                </p>
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-600">
                  <span class="flex items-center gap-1">
                    <UIcon
                      name="i-heroicons-star"
                      class="w-3.5 h-3.5"
                    />
                    {{ formatNumber(effectiveplan.points || 0) }} نقطة
                  </span>
                  <span
                    v-if="effectiveplan.duration_days"
                    class="flex items-center gap-1"
                  >
                    <UIcon
                      name="i-heroicons-clock"
                      class="w-3.5 h-3.5"
                    />
                    {{ effectiveplan.duration_days }} يوم
                  </span>
                  <span class="font-semibold text-primary-700">
                    {{ effectiveplan.price }} ر.س
                  </span>
                </div>
              </div>
              <UBadge
                :color="effectiveplan.type === 'subscription' ? 'primary' : 'secondary'"
                variant="solid"
                size="sm"
              >
                {{ effectiveplan.type === 'subscription' ? 'اشتراك' : 'حزمة نقاط' }}
              </UBadge>
            </div>
          </div>

          <!-- Kids list -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-semibold text-gray-700">
                اختر {{ labels.plural }} <span class="text-error-500">*</span>
              </label>
              <button
                v-if="visibleKids.length"
                type="button"
                class="text-xs text-primary-600 hover:text-primary-700 font-semibold"
                :disabled="submitting"
                @click="toggleAll"
              >
                {{ allSelected ? 'إلغاء التحديد' : 'تحديد الكل' }}
              </button>
            </div>

            <div
              v-if="hiddenCount > 0"
              class="mb-2 px-3 py-2 rounded-lg bg-info-50 border border-info-100 flex items-center gap-2 text-xs text-info-700"
            >
              <UIcon
                name="i-heroicons-information-circle"
                class="w-4 h-4 shrink-0"
              />
              <span>
                تم إخفاء {{ hiddenCount }} {{ hiddenCount === 1 ? labels.singular : `من ${labels.plural}` }} لأن لديهم اشتراكاً نشطاً في باقة شهرية / فصلية / سنوية. باقات النقاط يمكن شراؤها عدة مرات.
              </span>
            </div>

            <div
              v-if="kidsLoading || subsLoading"
              class="py-8 text-center"
            >
              <UIcon
                name="i-heroicons-arrow-path"
                class="w-6 h-6 text-primary-500 animate-spin"
              />
            </div>

            <div
              v-else-if="!kids.length"
              class="py-8 text-center bg-gray-50 rounded-xl border border-gray-100"
            >
              <UIcon
                name="i-heroicons-user-group"
                class="w-8 h-8 text-gray-300 mx-auto mb-2"
              />
              <p class="text-sm text-gray-500 mb-3">
                لا يوجد لديك {{ labels.plural }} مسجلين بعد.
              </p>
              <UButton
                :to="labels.detailRoot"
                color="primary"
                variant="soft"
                size="sm"
              >
                إدارة {{ labels.plural }}
              </UButton>
            </div>

            <div
              v-else-if="effectiveplan && !visibleKids.length"
              class="py-8 text-center bg-success-50/60 rounded-xl border border-success-100"
            >
              <UIcon
                name="i-heroicons-check-badge"
                class="w-8 h-8 text-success-500 mx-auto mb-2"
              />
              <p class="text-sm text-gray-700">
                جميع {{ labels.yourPlural }} مشتركون بالفعل في باقات اشتراك نشطة. لا يمكن للطالب الواحد أن يكون لديه باقتان شهريتان/سنويتان في نفس الوقت.
              </p>
            </div>

            <ul
              v-else
              class="border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-72 overflow-y-auto"
            >
              <li
                v-for="kid in visibleKids"
                :key="kid.id"
                class="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-primary-50/40 transition-colors"
                :class="{ 'bg-primary-50/60': isSelected(kid.id) }"
                @click="toggle(kid.id)"
              >
                <UCheckbox
                  :model-value="isSelected(kid.id)"
                  :disabled="submitting"
                  @update:model-value="toggle(kid.id)"
                  @click.stop
                />
                <div
                  class="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                  :class="kid.gender === 'female'
                    ? 'bg-gradient-to-br from-pink-400 to-pink-600'
                    : 'bg-gradient-to-br from-primary-500 to-primary-700'"
                >
                  {{ initial(kid.name) }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900 truncate">
                    {{ kid.name }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">
                    @{{ kid.user_name }}
                  </p>
                </div>
              </li>
            </ul>
            <p class="mt-2 text-xs text-gray-500">
              {{ selectedIds.length ? `تم اختيار ${selectedIds.length} ${labels.singular}` : 'لم يتم اختيار أحد بعد' }}
            </p>
          </div>

          <!-- Result -->
          <div
            v-if="result"
            class="rounded-xl border p-4 space-y-2"
            :class="result.total_skipped > 0
              ? 'bg-warning-50/60 border-warning-200'
              : 'bg-success-50/60 border-success-200'"
          >
            <p class="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <UIcon
                :name="result.total_skipped > 0 ? 'i-heroicons-exclamation-circle' : 'i-heroicons-check-circle'"
                class="w-5 h-5"
                :class="result.total_skipped > 0 ? 'text-warning-600' : 'text-success-600'"
              />
              {{ result.total_skipped > 0 ? 'تم الاشتراك جزئياً' : 'تم الاشتراك بنجاح' }}
            </p>
            <p class="text-xs text-gray-700">
              تم إنشاء <strong>{{ result.total_created }}</strong> اشتراك،
              <span v-if="result.total_skipped">تم تخطي <strong>{{ result.total_skipped }}</strong>.</span>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :disabled="submitting"
            @click="onOpenChange(false)"
          >
            {{ result ? 'إغلاق' : 'إلغاء' }}
          </UButton>
          <UButton
            v-if="!result"
            color="primary"
            icon="i-heroicons-check"
            :loading="submitting"
            :disabled="!canSubmit"
            @click="submit"
          >
            تأكيد الاشتراك
          </UButton>
        </div>
      </div>
    </template>
  </UModal>

  <DashboardPaymentsCheckoutModal
    v-model:open="checkoutOpen"
    :payment="pendingPayment"
    @paid="onPaid"
    @cancelled="onCancelled"
  />
</template>

<script setup lang="ts">
import { studentsService } from '@/services/api/students.service'
import { plansService, subscriptionsService } from '@/services/api/plans.service'

const labels = useEntityLabels()

const props = defineProps<{
  open: boolean
  plan: any | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'subscribed': [result: { total_created: number, total_skipped: number }]
}>()

const kids = ref<any[]>([])
const kidsLoading = ref(false)

const plans = ref<any[]>([])
const plansLoading = ref(false)
const pickedPlanId = ref<number | null>(null)

const subs = ref<any[]>([])
const subsLoading = ref(false)

const selectedIds = ref<number[]>([])
const submitting = ref(false)
const result = ref<{ total_created: number, total_skipped: number } | null>(null)

const checkoutOpen = ref(false)
const pendingPayment = ref<any | null>(null)

const planOptions = computed(() =>
  plans.value.map(p => ({
    label: `${p.name} — ${p.price} ر.س`,
    value: p.id
  }))
)

const effectiveplan = computed(() => {
  if (props.plan) return props.plan
  return plans.value.find(p => p.id === pickedPlanId.value) ?? null
})

/**
 * Kids that should be hidden because they conflict with the selected plan.
 * - For `subscription` plans: any active subscription-type plan blocks (one at a time).
 * - For `pack` plans: never block — packs stack, and the same student can buy multiple.
 */
const subscribedStudentIds = computed<Set<number>>(() => {
  const plan = effectiveplan.value
  if (!plan) return new Set()
  if (plan.type !== 'subscription') return new Set()

  const ids = subs.value
    .filter(s => s.status === 'active' && s.plan?.type === 'subscription')
    .map(s => s.student_id)
    .filter((id): id is number => typeof id === 'number')
  return new Set(ids)
})

const visibleKids = computed(() =>
  kids.value.filter(k => !subscribedStudentIds.value.has(k.id))
)

const hiddenCount = computed(() => kids.value.length - visibleKids.value.length)

const allSelected = computed(() =>
  visibleKids.value.length > 0 && selectedIds.value.length === visibleKids.value.length
)

const canSubmit = computed(() =>
  !!effectiveplan.value?.id && selectedIds.value.length > 0 && !submitting.value
)

const onOpenChange = (val: boolean) => {
  if (submitting.value) return
  emit('update:open', val)
  if (!val) reset()
}

function reset() {
  selectedIds.value = []
  result.value = null
  if (!props.plan) pickedPlanId.value = null
}

function isSelected(id: number) {
  return selectedIds.value.includes(id)
}

function toggle(id: number) {
  if (submitting.value) return
  const i = selectedIds.value.indexOf(id)
  if (i === -1) selectedIds.value.push(id)
  else selectedIds.value.splice(i, 1)
}

function toggleAll() {
  if (allSelected.value) selectedIds.value = []
  else selectedIds.value = visibleKids.value.map(k => k.id)
}

function initial(name?: string) {
  return (name?.trim()?.charAt(0) ?? 'ط').toUpperCase()
}

function formatNumber(n: number) {
  return new Intl.NumberFormat('ar-EG').format(n)
}

async function loadKids() {
  if (kids.value.length) return
  kidsLoading.value = true
  try {
    const res = await studentsService.getStudents({ per_page: 100 })
    const body = res.data?.data ?? res.data
    kids.value = Array.isArray(body) ? body : (body?.data ?? [])
  } catch (err) {
    console.error('Failed to load kids', err)
  } finally {
    kidsLoading.value = false
  }
}

async function loadPlans() {
  if (plans.value.length) return
  plansLoading.value = true
  try {
    const res = await plansService.list({ per_page: 100 })
    const body = res.data?.data ?? res.data
    plans.value = Array.isArray(body) ? body : (body?.data ?? [])
  } catch (err) {
    console.error('Failed to load plans', err)
  } finally {
    plansLoading.value = false
  }
}

async function loadSubs() {
  subsLoading.value = true
  try {
    const res = await subscriptionsService.list({ per_page: 200 })
    const body = res.data?.data ?? res.data
    subs.value = Array.isArray(body) ? body : (body?.data ?? [])
  } catch (err) {
    console.error('Failed to load subs', err)
    subs.value = []
  } finally {
    subsLoading.value = false
  }
}

async function submit() {
  if (!canSubmit.value || !effectiveplan.value?.id) return
  submitting.value = true
  try {
    const res = await subscriptionsService.create({
      plan_id: effectiveplan.value.id,
      student_ids: selectedIds.value
    })
    const data = res.data?.data ?? res.data
    result.value = {
      total_created: data.total_created ?? 0,
      total_skipped: data.total_skipped ?? 0
    }
    if (data.requires_payment && data.payment) {
      pendingPayment.value = {
        ...data.payment,
        description: 'اشتراك في باقة: ' + (effectiveplan.value.name ?? ''),
        kind: 'subscription'
      }
      checkoutOpen.value = true
    }
    emit('subscribed', result.value)
  } catch (err) {
    console.error('Subscribe failed', err)
  } finally {
    submitting.value = false
  }
}

function onPaid() {
  loadSubs()
}
function onCancelled() {
  loadSubs()
}

watch(() => props.open, (val) => {
  if (val) {
    reset()
    loadKids()
    loadSubs()
    if (!props.plan) loadPlans()
  }
})

watch(subscribedStudentIds, (ids) => {
  selectedIds.value = selectedIds.value.filter(id => !ids.has(id))
})
</script>
