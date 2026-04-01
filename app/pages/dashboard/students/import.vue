<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
      <UButton
        icon="i-heroicons-arrow-right"
        color="neutral"
        variant="ghost"
        to="/dashboard/students"
        class="rtl:-scale-x-100"
      />
      <div>
        <h1
          class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3"
        >
          استيراد حسابات الطلاب
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          قم برفع ملف Excel (CSV/XLSX) أو لصق بيانات JSON لإضافة مجموعة دفعة
          واحدة
        </p>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Upload Excel Section -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm"
      >
        <div
          class="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-700 pb-4"
        >
          <h3
            class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"
          >
            <UIcon
              name="i-heroicons-table-cells"
              class="w-6 h-6 text-emerald-500"
            />
            استيراد ملف Excel أو CSV
          </h3>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-arrow-down-tray"
          >
            تحميل نموذج فارغ
          </UButton>
        </div>

        <div
          class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-10 text-center hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer group"
          :class="{
            'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10':
              fileData,
          }"
          @click="triggerFileInput"
        >
          <input
            type="file"
            ref="fileInput"
            class="hidden"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            @change="handleFileUpload"
          />

          <div v-if="!fileData" class="space-y-3">
            <div
              class="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 transition-colors"
            >
              <UIcon
                name="i-heroicons-document-arrow-up"
                class="w-8 h-8 text-gray-400 group-hover:text-emerald-500"
              />
            </div>
            <p class="font-bold text-gray-900 dark:text-white">
              اسحب الملف وأفلته هنا أو اضغط للاستعراض
            </p>
            <p class="text-sm text-gray-500">
              يدعم صيغ .XLSX و .CSV بحجم أقصى 5MB
            </p>
          </div>

          <div v-else class="space-y-4">
            <UIcon
              name="i-heroicons-document-text"
              class="w-16 h-16 text-emerald-500 mx-auto"
            />
            <p class="font-bold text-gray-900 dark:text-white">
              {{ fileData.name }}
            </p>
            <p class="text-sm text-gray-500">
              {{ (fileData.size / 1024).toFixed(2) }} KB
            </p>
            <UButton
              color="neutral"
              variant="soft"
              size="sm"
              @click.stop="fileData = null"
            >
              إلغاء الملف
            </UButton>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <UButton
            color="emerald"
            icon="i-heroicons-check"
            :loading="isUploading"
            :disabled="!fileData"
            @click="uploadExcelFile"
            class="px-8"
          >
            بدء الاستيراد
          </UButton>
        </div>
      </div>

      <!-- JSON Input Section -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm"
      >
        <h3
          class="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4 flex items-center gap-2"
        >
          <UIcon
            name="i-heroicons-code-bracket"
            class="w-6 h-6 text-primary-500"
          />
          إضافة مجمعة بواسطة JSON
        </h3>

        <p class="text-sm text-gray-500 mb-4">
          يمكنك لصق مصفوفة من العناصر (JSON Array) تحوي كائنات ببيانات الطلاب:
          <code>{ name, email, phone, parent_phone }</code>
        </p>

        <UTextarea
          v-model="jsonContent"
          placeholder='[ {"name": "طالب تجريبي", "phone": "0500000000", "parent_phone": "0511111111", "email": "test@domain.com"} ]'
          :rows="8"
          class="font-mono text-left w-full"
          dir="ltr"
        />

        <div class="mt-6 flex justify-between items-center">
          <div class="text-sm">
            <span
              v-if="jsonParseError"
              class="text-red-500 font-bold flex items-center gap-1"
            >
              <UIcon name="i-heroicons-exclamation-triangle" />
              {{ jsonParseError }}
            </span>
            <span
              v-else-if="parsedJsonCount > 0"
              class="text-emerald-500 font-bold flex items-center gap-1"
            >
              <UIcon name="i-heroicons-check-circle" /> تم التعرف على
              {{ parsedJsonCount }} سجل صحيح
            </span>
          </div>

          <UButton
            color="primary"
            icon="i-heroicons-paper-airplane"
            :loading="isJsonSubmitting"
            :disabled="
              !jsonContent || !!jsonParseError || parsedJsonCount === 0
            "
            @click="submitJson"
            class="px-8"
          >
            تنفيذ JSON
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { studentsService } from "@/services/api/students.service";
import { showToast } from "@/utils/helpers/toast.helper";

definePageMeta({ layout: "dashboard", middleware: ["auth"] });
useSeoMeta({ title: "استيراد الطلاب | A Plus" });

// File Upload State
const fileInput = ref<HTMLInputElement | null>(null);
const fileData = ref<File | null>(null);
const isUploading = ref(false);

// JSON Upload State
const jsonContent = ref("");
const isJsonSubmitting = ref(false);

const jsonParseError = computed(() => {
  if (!jsonContent.value) return "";
  try {
    const parsed = JSON.parse(jsonContent.value);
    if (!Array.isArray(parsed))
      return "البيانات المدخلة يجب أن تكون مصفوفة JSON Array []";
    // Deep check
    for (const item of parsed) {
      if (!item.name || !item.parent_phone) {
        return "أحد السجلات ينقصه بيانات أساسية (name أو parent_phone)";
      }
    }
    return "";
  } catch (e) {
    return "صيغة JSON غير صحيحة";
  }
});

const parsedJsonCount = computed(() => {
  if (jsonParseError.value || !jsonContent.value) return 0;
  return JSON.parse(jsonContent.value).length;
});

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    fileData.value = target.files[0];
  }
}

async function uploadExcelFile() {
  if (!fileData.value) return;

  isUploading.value = true;
  try {
    const formData = new FormData();
    formData.append("file", fileData.value);

    // Add endpoint dynamically if we want
    await studentsService.importStudents(formData);

    showToast(
      "نجاح",
      `تم استيراد قائمة الطلاب بنجاح من الملف ${fileData.value.name}`,
      "success",
    );
    fileData.value = null; // reset
  } catch (error: any) {
    showToast(
      "خطأ",
      error.response?.data?.message || "فشل في قراءة ومعالجة الملف",
      "error",
    );
  } finally {
    isUploading.value = false;
  }
}

async function submitJson() {
  if (jsonParseError.value || !jsonContent.value) return;

  isJsonSubmitting.value = true;
  try {
    const parsedData = JSON.parse(jsonContent.value);

    await studentsService.bulkCreateStudents({ students: parsedData });

    showToast(
      "نجاح",
      `تم إضافة ${parsedJsonCount.value} سجلات بنجاح`,
      "success",
    );
    jsonContent.value = ""; // reset
  } catch (error: any) {
    showToast(
      "خطأ",
      error.response?.data?.message || "حدث خطأ أثناء إدراج البيانات",
      "error",
    );
  } finally {
    isJsonSubmitting.value = false;
  }
}
</script>
