<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          إدارة الطلاب
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          استعرض قائمة الطلاب المسجلين بالمنصة وأدر حساباتهم
        </p>
      </div>
      <div class="flex items-center gap-3">
        <UButton
          color="neutral"
          variant="soft"
          icon="i-heroicons-arrow-down-tray"
        >
          تصدير / استيراد اكسيل
        </UButton>
        <UButton color="primary" icon="i-heroicons-plus"> إضافة طالب </UButton>
      </div>
    </div>

    <!-- Filters & Actions -->
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between shadow-sm"
    >
      <div class="flex flex-col sm:flex-row gap-4 flex-1">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="ابحث بالاسم، الإيميل، أو رقم الهاتف..."
          class="w-full sm:max-w-md"
        />
        <USelectMenu
          v-model="statusFilter"
          :options="[
            { label: 'نشط', value: 'active' },
            { label: 'معلق', value: 'suspended' },
          ]"
          placeholder="حالة الحساب"
          class="w-full sm:w-48"
        />
      </div>
    </div>

    <!-- Data Table -->
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm"
    >
      <UTable
        :rows="students"
        :columns="columns"
        :loading="loading"
        loading-state="{ icon: 'i-heroicons-arrow-path', label: 'جاري التحميل...' }"
        empty-state="{ icon: 'i-heroicons-users', label: 'لا يوجد طلاب مطابقين للبحث' }"
        :ui="{ divide: 'divide-gray-100 dark:divide-gray-700' }"
      >
        <!-- Custom Name / Avatar Column -->
        <template #name-data="{ row }">
          <NuxtLink
            :to="`/dashboard/students/${row.id}`"
            class="flex items-center gap-3 group"
          >
            <UAvatar
              :src="row.avatar || row.profile_image"
              :alt="row.name_ar || row.name"
              size="sm"
              :ui="{ rounded: 'rounded-lg' }"
              class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-bold"
            >
              {{ (row.name_ar || row.name || "ط").charAt(0).toUpperCase() }}
            </UAvatar>
            <div>
              <p
                class="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors"
              >
                {{ row.name_ar || row.name || row.username }}
              </p>
              <p class="text-xs text-gray-500">{{ row.email || row.phone }}</p>
            </div>
          </NuxtLink>
        </template>

        <!-- Status Column -->
        <template #status-data="{ row }">
          <UBadge
            :color="row.status === 'suspended' ? 'error' : 'success'"
            variant="subtle"
            size="sm"
          >
            {{ row.status === "suspended" ? "معلق" : "نشط" }}
          </UBadge>
        </template>

        <!-- Registraion Date -->
        <template #created_at-data="{ row }">
          <span class="text-gray-500 whitespace-nowrap text-sm">
            {{ row.created_at?.split("T")[0] || "غير متوفر" }}
          </span>
        </template>

        <!-- Actions -->
        <template #actions-data="{ row }">
          <div class="flex justify-end gap-2">
            <UTooltip text="عرض الملف الشخصي">
              <UButton
                size="sm"
                color="neutral"
                variant="ghost"
                icon="i-heroicons-eye"
                :to="`/dashboard/students/${row.id}`"
              />
            </UTooltip>
            <UTooltip text="تعديل">
              <UButton
                size="sm"
                color="neutral"
                variant="ghost"
                icon="i-heroicons-pencil-square"
              />
            </UTooltip>
            <UDropdown :items="getActionItems(row)">
              <UButton
                size="sm"
                color="neutral"
                variant="ghost"
                icon="i-heroicons-ellipsis-vertical"
              />
            </UDropdown>
          </div>
        </template>
      </UTable>

      <!-- Pagination Footer -->
      <div
        v-if="meta?.total > meta?.per_page"
        class="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-center"
      >
        <UPagination
          v-model="page"
          :page-count="meta.per_page"
          :total="meta.total"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { studentsService } from "@/services/api/students.service";

definePageMeta({ layout: "dashboard", middleware: ["auth"] });
useSeoMeta({ title: "الطلاب | A Plus" });

const loading = ref(true);
const students = ref<any[]>([]);
const meta = ref<any>(null);

const searchQuery = ref("");
const statusFilter = ref(null);
const page = ref(1);

const columns = [
  { key: "name", label: "الطالب" },
  { key: "parent_phone", label: "ولي الأمر" },
  { key: "grade", label: "المرحلة" },
  { key: "status", label: "الحالة" },
  { key: "created_at", label: "تاريخ التسجيل" },
  { key: "actions", label: "" },
];

onMounted(async () => {
  await fetchStudents();
});

// Watch inputs and page change with a slight debouncing for search
let searchTimeout: any;
watch([searchQuery, statusFilter, page], () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchStudents();
  }, 300);
});

async function fetchStudents() {
  loading.value = true;
  try {
    const res = await studentsService.getStudents({
      page: page.value,
      search: searchQuery.value || undefined,
      status: statusFilter.value?.value || undefined,
    });

    const payload = res.data?.data || res.data;
    students.value = Array.isArray(payload)
      ? payload
      : payload?.students || payload?.data || [];
    meta.value = res.data?.meta ||
      payload?.meta || { total: students.value.length, per_page: 15 };
  } catch (error) {
    console.error("Failed to load students", error);
  } finally {
    loading.value = false;
  }
}

function getActionItems(row: any) {
  return [
    [
      {
        label: "عرض الدرجات",
        icon: "i-heroicons-chart-bar",
        click: () => navigateTo(`/dashboard/student-stats?student=${row.id}`),
      },
      { label: "مراسلة الطالب", icon: "i-heroicons-chat-bubble-left-ellipsis" },
    ],
    [
      {
        label: "تعليق الحساب",
        icon: "i-heroicons-no-symbol",
        color: "red" as const,
        click: () => console.log("Suspend student"),
      },
      {
        label: "طلب حذف الحساب",
        icon: "i-heroicons-trash",
        color: "red" as const,
        click: () => requestDeletion(row.id),
      },
    ],
  ];
}

async function requestDeletion(id: number) {
  if (
    confirm(
      "هل أنت متأكد من تقديم طلب لحذف حساب هذا الطالب بالكامل؟ لا يمكن التراجع عن هذا الإجراء.",
    )
  ) {
    try {
      await studentsService.requestStudentDeletion(
        id,
        "حذف يدوي من لوحة التحكم",
      );
      // Could show a toast success here
      alert("تم إرسال طلب الحذف بنجاح إلى الإدارة.");
    } catch (e) {
      alert("حدث خطأ أثناء إرسال طلب الحذف.");
    }
  }
}
</script>
