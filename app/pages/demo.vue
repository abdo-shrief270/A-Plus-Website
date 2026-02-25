<template>
  <div class="p-8 space-y-12 bg-gray-50 dark:bg-black min-h-screen">
    <div class="max-w-4xl mx-auto space-y-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Components Demo
      </h1>

      <!-- BButton Section -->
      <BCard
        title="Buttons (BButton)"
        hover
      >
        <div class="flex flex-wrap gap-4">
          <BButton>Primary Solid</BButton>
          <BButton color="info">
            Info Solid
          </BButton>
          <BButton variant="outline">
            Primary Outline
          </BButton>
          <BButton variant="ghost">
            Primary Ghost
          </BButton>
          <BButton size="sm">
            Small
          </BButton>
          <BButton size="lg">
            Large
          </BButton>
          <BButton loading>
            Loading
          </BButton>
        </div>
      </BCard>

      <!-- BInput Section -->
      <BCard
        title="Inputs (BInput)"
        hover
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BInput
            label="signup.name"
            placeholder="أدخل اسمك"
            help="هذا النص للمساعدة"
          />
          <BInput
            label="signup.email"
            placeholder="example.email.com"
            error="validation.invalid_email"
            required
          >
            <template #leading>
              <UIcon name="i-heroicons-envelope" />
            </template>
          </BInput>
        </div>
      </BCard>

      <!-- BSelect Section -->
      <BCard
        title="Selects (BSelect)"
        hover
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BSelect
            v-model="selectedExam"
            :options="examOptions"
            label="signup.exam"
            placeholder="signup.exam_placeholder"
            searchable
            search-placeholder="جاري البحث..."
          />
        </div>
      </BCard>

      <!-- BPhoneInput Section -->
      <BCard
        title="Phone Input (BPhoneInput)"
        hover
      >
        <BPhoneInput
          v-model="phone"
          label="signup.phone"
          placeholder="signup.phone_placeholder"
          @country="(code) => (countryCode = code)"
        />
        <p class="mt-2 text-sm text-gray-500">
          Value: {{ phone }} | Code: {{ countryCode }}
        </p>
      </BCard>

      <!-- BModal Section -->
      <BCard
        title="Modals (BModal)"
        hover
      >
        <BButton @click="isOpen = true">
          Open Modal
        </BButton>
        <BModal
          v-model="isOpen"
          title="تنبيه"
          @close="isOpen = false"
        >
          <p class="text-gray-600 dark:text-gray-400">
            هذا مثال على الـ Modal الموحد في المشروع.
          </p>
          <template #footer>
            <BButton
              variant="outline"
              @click="isOpen = false"
            >
              إلغاء
            </BButton>
            <BButton @click="isOpen = false">
              تأكيد
            </BButton>
          </template>
        </BModal>
      </BCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedExam = ref(null)
const examOptions = [
  { value: 1, label: 'Exam 1' },
  { value: 2, label: 'Exam 2' },
  { value: 3, label: 'Exam 3' }
]

const phone = ref('')
const countryCode = ref('')
const isOpen = ref(false)
</script>
