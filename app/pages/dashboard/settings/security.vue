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
          <span>الأمان والتحقق</span>
        </p>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
          الأمان والتحقق
        </h1>
      </div>
    </div>

    <div
      v-if="loading"
      class="flex items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-primary-500 animate-spin"
      />
    </div>

    <div
      v-else-if="status"
      class="space-y-5"
    >
      <!-- 2FA card -->
      <section class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
              <UIcon
                name="i-heroicons-shield-check"
                class="w-5 h-5 text-success-600"
              />
            </div>
            <div>
              <h2 class="font-bold text-gray-900">
                المصادقة الثنائية (2FA)
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                أضف طبقة حماية إضافية برمز يُرسل إلى بريدك أو هاتفك عند تسجيل الدخول.
              </p>
            </div>
          </div>
          <UBadge
            :color="status.two_factor_enabled ? 'success' : 'neutral'"
            variant="soft"
            size="md"
          >
            {{ status.two_factor_enabled ? 'مفعّلة' : 'غير مفعّلة' }}
          </UBadge>
        </div>
        <div class="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="text-xs text-gray-600 leading-relaxed">
            {{ status.two_factor_enabled
              ? 'سيُطلب منك إدخال رمز التحقق في كل مرة تسجل فيها الدخول من جهاز جديد.'
              : 'لا يُطلب منك حالياً سوى كلمة المرور لتسجيل الدخول.' }}
          </div>

          <UButton
            v-if="!status.two_factor_enabled && hasAnyChannel"
            color="primary"
            icon="i-heroicons-shield-check"
            @click="startFlow('enable_2fa')"
          >
            تفعيل المصادقة الثنائية
          </UButton>
          <UButton
            v-else-if="status.two_factor_enabled"
            color="error"
            variant="soft"
            icon="i-heroicons-shield-exclamation"
            @click="startFlow('disable_2fa')"
          >
            إيقاف المصادقة الثنائية
          </UButton>
          <UButton
            v-else
            to="/dashboard/profile"
            color="neutral"
            variant="soft"
            icon="i-heroicons-plus"
          >
            أضف بياناتك أولاً
          </UButton>
        </div>
        <div
          v-if="!status.two_factor_enabled && !hasAnyChannel"
          class="px-5 pb-4 -mt-2"
        >
          <div class="bg-warning-50 border border-warning-100 rounded-lg px-3 py-2 text-xs text-warning-800 flex items-center gap-2">
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-4 h-4 shrink-0"
            />
            تحتاج إلى بريد إلكتروني أو رقم هاتف لتفعيل المصادقة الثنائية.
          </div>
        </div>
      </section>

      <!-- Email verification card -->
      <section class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
              <UIcon
                name="i-heroicons-envelope"
                class="w-5 h-5 text-primary-600"
              />
            </div>
            <div class="min-w-0">
              <h2 class="font-bold text-gray-900">
                البريد الإلكتروني
              </h2>
              <p
                class="text-xs text-gray-500 mt-0.5 truncate"
                dir="ltr"
              >
                {{ status.email || 'لا يوجد بريد مسجل' }}
              </p>
            </div>
          </div>
          <UBadge
            :color="status.email_verified ? 'success' : 'warning'"
            variant="soft"
            size="md"
          >
            {{ status.email_verified ? 'موَثَّق' : 'بانتظار التحقق' }}
          </UBadge>
        </div>
        <div class="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p class="text-xs text-gray-600 leading-relaxed">
            {{ status.email_verified
              ? 'تم تأكيد ملكيتك لهذا البريد الإلكتروني.'
              : 'يجب التحقق من البريد لاستخدامه لاستلام الإشعارات وإعادة تعيين كلمة المرور.' }}
          </p>
          <UButton
            v-if="!status.email_verified && status.email"
            color="primary"
            variant="soft"
            icon="i-heroicons-paper-airplane"
            @click="startFlow('verify_email')"
          >
            إرسال رمز التحقق
          </UButton>
          <UButton
            v-else-if="!status.email"
            to="/dashboard/profile"
            color="neutral"
            variant="soft"
            icon="i-heroicons-plus"
          >
            أضف بريداً إلكترونياً
          </UButton>
          <UButton
            v-else
            to="/dashboard/profile"
            color="neutral"
            variant="ghost"
            icon="i-heroicons-pencil-square"
          >
            تعديل
          </UButton>
        </div>
      </section>

      <!-- Phone (SMS) verification card -->
      <section class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center shrink-0">
              <UIcon
                name="i-heroicons-device-phone-mobile"
                class="w-5 h-5 text-secondary-600"
              />
            </div>
            <div class="min-w-0">
              <h2 class="font-bold text-gray-900">
                رقم الهاتف (SMS)
              </h2>
              <p
                class="text-xs text-gray-500 mt-0.5 truncate"
                dir="ltr"
              >
                {{ status.phone || 'لا يوجد رقم مسجل' }}
              </p>
            </div>
          </div>
          <UBadge
            :color="status.phone_verified ? 'success' : 'warning'"
            variant="soft"
            size="md"
          >
            {{ status.phone_verified ? 'موَثَّق' : 'بانتظار التحقق' }}
          </UBadge>
        </div>
        <div class="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p class="text-xs text-gray-600 leading-relaxed">
            {{ status.phone_verified
              ? 'تم تأكيد رقم هاتفك عبر رسالة SMS.'
              : 'استلم رمز التحقق عبر رسالة SMS لتأكيد رقمك.' }}
          </p>
          <UButton
            v-if="!status.phone_verified && status.phone"
            color="primary"
            variant="soft"
            icon="i-heroicons-paper-airplane"
            @click="startFlow('verify_phone')"
          >
            إرسال رمز عبر SMS
          </UButton>
          <UButton
            v-else-if="!status.phone"
            to="/dashboard/profile"
            color="neutral"
            variant="soft"
            icon="i-heroicons-plus"
          >
            أضف رقم هاتف
          </UButton>
          <UButton
            v-else
            to="/dashboard/profile"
            color="neutral"
            variant="ghost"
            icon="i-heroicons-pencil-square"
          >
            تعديل
          </UButton>
        </div>
      </section>

      <!-- WhatsApp verification card -->
      <section class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center shrink-0">
              <UIcon
                name="i-heroicons-chat-bubble-bottom-center-text"
                class="w-5 h-5 text-success-600"
              />
            </div>
            <div class="min-w-0">
              <h2 class="font-bold text-gray-900">
                رقم الواتساب
              </h2>
              <p
                class="text-xs text-gray-500 mt-0.5 truncate"
                dir="ltr"
              >
                {{ status.phone || 'لا يوجد رقم مسجل' }}
              </p>
            </div>
          </div>
          <UBadge
            :color="status.whatsapp_verified ? 'success' : 'warning'"
            variant="soft"
            size="md"
          >
            {{ status.whatsapp_verified ? 'موَثَّق' : 'بانتظار التحقق' }}
          </UBadge>
        </div>
        <div class="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p class="text-xs text-gray-600 leading-relaxed">
            {{ status.whatsapp_verified
              ? 'تم تأكيد رقمك عبر واتساب.'
              : 'استلم رمز التحقق عبر واتساب على نفس الرقم.' }}
          </p>
          <UButton
            v-if="!status.whatsapp_verified && status.phone"
            color="success"
            variant="soft"
            icon="i-heroicons-paper-airplane"
            @click="startFlow('verify_whatsapp')"
          >
            إرسال رمز عبر واتساب
          </UButton>
          <UButton
            v-else-if="!status.phone"
            to="/dashboard/profile"
            color="neutral"
            variant="soft"
            icon="i-heroicons-plus"
          >
            أضف رقم هاتف
          </UButton>
          <UButton
            v-else
            to="/dashboard/profile"
            color="neutral"
            variant="ghost"
            icon="i-heroicons-pencil-square"
          >
            تعديل
          </UButton>
        </div>
      </section>

      <!-- Help -->
      <section class="bg-info-50/40 border border-info-100 rounded-2xl p-4 flex items-start gap-3">
        <UIcon
          name="i-heroicons-information-circle"
          class="w-5 h-5 text-info-600 shrink-0 mt-0.5"
        />
        <div class="text-xs text-gray-700 leading-relaxed">
          لتعديل البريد أو رقم الهاتف، اذهب إلى
          <NuxtLink
            to="/dashboard/profile"
            class="font-bold text-primary-700 hover:underline"
          >
            الملف الشخصي
          </NuxtLink>.
          عند تغيير أي منهما، يجب التحقق منه مجدداً.
        </div>
      </section>
    </div>

    <!-- Flow modal -->
    <DashboardSecurityFlowModal
      v-model:open="flowOpen"
      :purpose="flowPurpose"
      :status="status"
      @done="onFlowDone"
    />
  </div>
</template>

<script setup lang="ts">
import { securityService, type SecurityPurpose, type SecurityStatus } from '@/services/api/security.service'
import { showToast } from '@/utils/helpers/toast.helper'

definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'الأمان والتحقق' })
useSeoMeta({ title: 'الأمان والتحقق | A Plus' })

const loading = ref(true)
const status = ref<SecurityStatus | null>(null)
const flowOpen = ref(false)
const flowPurpose = ref<SecurityPurpose>('enable_2fa')

const hasAnyChannel = computed(() => !!(status.value?.email || status.value?.phone))

onMounted(() => fetchStatus())

async function fetchStatus() {
  loading.value = true
  try {
    const res = await securityService.status()
    status.value = res.data?.data ?? null
  } catch (err) {
    console.error('Failed to load security status', err)
    status.value = null
  } finally {
    loading.value = false
  }
}

function startFlow(purpose: SecurityPurpose) {
  flowPurpose.value = purpose
  flowOpen.value = true
}

function onFlowDone(updated: SecurityStatus) {
  status.value = updated
  const msg = ({
    enable_2fa: 'تم تفعيل المصادقة الثنائية',
    disable_2fa: 'تم إيقاف المصادقة الثنائية',
    verify_email: 'تم تأكيد بريدك الإلكتروني',
    verify_phone: 'تم تأكيد رقم هاتفك (SMS)',
    verify_whatsapp: 'تم تأكيد رقم واتساب'
  })[flowPurpose.value]
  showToast('تم بنجاح', msg, 'success')
}
</script>
