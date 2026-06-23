<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          اختباراتي الذاتية
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          أنشئ اختبارك بنفسك: اختر النطاق والقواعد وابدأ التدريب
        </p>
      </div>
    </div>

    <!-- Daily challenge card -->
    <div
      v-if="daily"
      class="relative overflow-hidden rounded-2xl border border-secondary-200 bg-gradient-to-l from-secondary-50 via-white to-primary-50/40 p-5 mb-6 shadow-sm"
    >
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <!-- Streak flame -->
        <div class="flex items-center gap-3">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-secondary-500 flex flex-col items-center justify-center text-white shadow-lg shrink-0">
            <span class="text-lg leading-none">🔥</span>
            <span class="text-sm font-black leading-tight">{{ daily.streak }}</span>
          </div>
          <div>
            <h3 class="font-black text-gray-900">
              التحدي اليومي
            </h3>
            <p class="text-xs text-gray-500 mt-0.5">
              {{ daily.config.question_count }} أسئلة في {{ daily.config.time_limit_minutes }} دقائق •
              +{{ daily.bonus.base }} نقطة عند الإكمال
              <span class="text-secondary-600 font-bold">(+{{ daily.bonus.excellent }} إضافية فوق {{ daily.bonus.excellent_threshold }}%)</span>
            </p>
          </div>
        </div>

        <div class="flex-1" />

        <!-- State-aware CTA -->
        <template v-if="!daily.today">
          <UButton
            color="primary"
            size="lg"
            icon="i-heroicons-fire"
            :loading="startingDaily"
            @click="startDaily"
          >
            ابدأ تحدي اليوم
          </UButton>
        </template>
        <template v-else-if="daily.today.status === 'in_progress'">
          <UButton
            color="warning"
            size="lg"
            icon="i-heroicons-play"
            :to="`/dashboard/quizzes/${daily.today.id}`"
          >
            متابعة التحدي
          </UButton>
        </template>
        <template v-else>
          <div class="flex items-center gap-3">
            <div class="text-left">
              <p
                v-if="daily.today.score_percent !== null"
                :class="[
                  'text-xl font-black',
                  daily.today.score_percent >= 50 ? 'text-success-600' : 'text-error-500'
                ]"
              >
                {{ daily.today.score_percent }}%
              </p>
              <p class="text-[11px] text-gray-500">
                تم إنجاز تحدي اليوم ✅
              </p>
            </div>
            <UButton
              color="neutral"
              variant="soft"
              size="sm"
              :to="`/dashboard/quizzes/${daily.today.id}`"
            >
              النتيجة
            </UButton>
          </div>
        </template>
      </div>
    </div>

    <!-- Exam simulation card -->
    <div
      v-if="simulationInfo"
      class="relative overflow-hidden rounded-2xl border border-info-200 bg-gradient-to-l from-info-50 via-white to-primary-50/40 p-5 mb-6 shadow-sm"
    >
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <div class="flex items-center gap-3">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-info-500 to-primary-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <UIcon
              name="i-heroicons-academic-cap"
              class="w-7 h-7"
            />
          </div>
          <div>
            <h3 class="font-black text-gray-900">
              محاكاة الاختبار
            </h3>
            <p class="text-xs text-gray-500 mt-0.5">
              اختبار تجريبي شامل يغطي جميع أقسام اختبارك •
              {{ simulationInfo.question_count }} سؤال في {{ Math.round(simulationInfo.question_count * simulationInfo.seconds_per_question / 60) }} دقيقة
            </p>
          </div>
        </div>

        <div class="flex-1" />

        <UButton
          color="info"
          size="lg"
          icon="i-heroicons-clipboard-document-check"
          :loading="startingSimulation"
          @click="startSimulation"
        >
          ابدأ المحاكاة
        </UButton>
      </div>
    </div>

    <!-- Challenge a friend card -->
    <div class="relative overflow-hidden rounded-2xl border border-secondary-200 bg-gradient-to-l from-secondary-50 via-white to-primary-50/40 p-5 mb-6 shadow-sm">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <div class="flex items-center gap-3">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-500 to-primary-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <UIcon
              name="i-heroicons-user-group"
              class="w-7 h-7"
            />
          </div>
          <div>
            <h3 class="font-black text-gray-900">
              تحدَّ صديقك
            </h3>
            <p class="text-xs text-gray-500 mt-0.5">
              أنشئ تحدياً من إعداداتك بالأعلى وشارك الرمز، أو انضمّ بتحدٍّ موجود
            </p>
          </div>
        </div>
        <div class="flex-1" />
        <div class="flex items-center gap-2">
          <UInput
            v-model="joinCode"
            placeholder="رمز التحدّي"
            size="md"
            class="w-32"
            :ui="{ base: 'uppercase font-mono' }"
          />
          <UButton
            color="neutral"
            variant="soft"
            :loading="joiningChallenge"
            :disabled="!joinCode.trim()"
            @click="joinChallenge"
          >
            انضمّ
          </UButton>
          <UButton
            color="secondary"
            icon="i-heroicons-plus"
            :loading="creatingChallenge"
            @click="createChallenge"
          >
            أنشئ تحدياً
          </UButton>
        </div>
      </div>
    </div>

    <!-- Active session banner -->
    <div
      v-if="activeSession && !isActiveDaily && !isActiveSimulation"
      class="bg-gradient-to-l from-warning-50 to-white rounded-2xl border border-warning-200 p-5 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4"
    >
      <div class="w-12 h-12 rounded-xl bg-warning-100 flex items-center justify-center shrink-0">
        <UIcon
          name="i-heroicons-play-circle"
          class="w-6 h-6 text-warning-600"
        />
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-bold text-gray-900">
          لديك اختبار قيد التنفيذ
        </h3>
        <p class="text-xs text-gray-500 mt-0.5">
          {{ activeSession.answered_count }} / {{ activeSession.question_count }} سؤال
          <span v-if="activeSession.remaining_seconds !== null">
            • متبقي {{ Math.ceil(activeSession.remaining_seconds / 60) }} دقيقة
          </span>
        </p>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          color="warning"
          icon="i-heroicons-arrow-left"
          :to="`/dashboard/quizzes/${activeSession.id}`"
        >
          متابعة
        </UButton>
        <UButton
          color="neutral"
          variant="soft"
          :loading="abandoning"
          @click="abandonActive"
        >
          إلغاء
        </UButton>
      </div>
    </div>

    <!-- Builder -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-l from-primary-50/40 to-white flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
          <UIcon
            name="i-heroicons-adjustments-horizontal"
            class="w-5 h-5 text-primary-600"
          />
        </div>
        <div>
          <h2 class="text-base font-bold text-gray-900">
            اختبار جديد
          </h2>
          <p class="text-xs text-gray-500 mt-0.5">
            حدد النطاق والمصدر والقواعد ثم ابدأ
          </p>
        </div>
      </div>

      <div class="p-6 space-y-8">
        <!-- 1. Scope -->
        <section>
          <h3 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span class="w-6 h-6 rounded-lg bg-primary-100 text-primary-700 text-xs font-black flex items-center justify-center">1</span>
            النطاق (الأقسام والتصنيفات)
            <span
              v-if="config.source === 'bookmarked'"
              class="text-[11px] font-normal text-gray-400"
            >اختياري مع المحفوظات</span>
          </h3>

          <div
            v-if="loadingSections"
            class="py-8 text-center"
          >
            <UIcon
              name="i-heroicons-arrow-path"
              class="w-6 h-6 text-primary-500 animate-spin"
            />
          </div>

          <div
            v-else-if="!sections.length"
            class="py-8 text-center text-sm text-gray-500 bg-gray-50 rounded-xl"
          >
            لا توجد أقسام متاحة. تأكد من تحديد الاختبار في ملفك الشخصي.
          </div>

          <div
            v-else
            class="space-y-3"
          >
            <div
              v-for="section in sections"
              :key="section.id"
              class="border border-gray-100 rounded-xl overflow-hidden"
            >
              <button
                type="button"
                class="w-full flex items-center gap-3 px-4 py-3 bg-gray-50/60 hover:bg-gray-50 transition-colors text-right"
                @click="toggleSectionExpand(section.id)"
              >
                <UCheckbox
                  :model-value="isSectionFullySelected(section)"
                  :indeterminate="isSectionPartiallySelected(section)"
                  @click.stop
                  @update:model-value="toggleSection(section)"
                />
                <span class="font-bold text-sm text-gray-900 flex-1">{{ section.name }}</span>
                <span class="text-[11px] text-gray-400">{{ (section.categories || []).length }} تصنيف</span>
                <UIcon
                  :name="expandedSections.has(section.id) ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                  class="w-4 h-4 text-gray-400"
                />
              </button>
              <div
                v-if="expandedSections.has(section.id)"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-3 border-t border-gray-100"
              >
                <label
                  v-for="cat in section.categories || []"
                  :key="cat.id"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-50/40 cursor-pointer transition-colors"
                >
                  <UCheckbox
                    :model-value="selectedCategoryIds.has(cat.id)"
                    @update:model-value="toggleCategory(cat.id)"
                  />
                  <span class="text-sm text-gray-700">{{ cat.name }}</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. Source -->
        <section>
          <h3 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span class="w-6 h-6 rounded-lg bg-primary-100 text-primary-700 text-xs font-black flex items-center justify-center">2</span>
            مصدر الأسئلة
          </h3>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              v-for="opt in sourceOptions"
              :key="opt.value"
              type="button"
              :class="[
                'rounded-xl border p-4 text-right transition-all',
                config.source === opt.value
                  ? 'border-primary-400 bg-primary-50/60 shadow-sm'
                  : 'border-gray-100 hover:border-primary-200'
              ]"
              @click="config.source = opt.value"
            >
              <UIcon
                :name="opt.icon"
                :class="['w-5 h-5 mb-2', config.source === opt.value ? 'text-primary-600' : 'text-gray-400']"
              />
              <p class="text-sm font-bold text-gray-900">
                {{ opt.label }}
              </p>
              <p class="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                {{ opt.hint }}
              </p>
            </button>
          </div>
        </section>

        <!-- 3. Rules -->
        <section>
          <h3 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span class="w-6 h-6 rounded-lg bg-primary-100 text-primary-700 text-xs font-black flex items-center justify-center">3</span>
            القواعد
          </h3>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Mode -->
            <div>
              <p class="text-xs font-bold text-gray-600 mb-2">
                وضع الاختبار
              </p>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  :class="[
                    'rounded-xl border p-4 text-right transition-all',
                    config.mode === 'tutor'
                      ? 'border-info-400 bg-info-50/60 shadow-sm'
                      : 'border-gray-100 hover:border-info-200'
                  ]"
                  @click="config.mode = 'tutor'"
                >
                  <UIcon
                    name="i-heroicons-light-bulb"
                    :class="['w-5 h-5 mb-2', config.mode === 'tutor' ? 'text-info-600' : 'text-gray-400']"
                  />
                  <p class="text-sm font-bold text-gray-900">
                    وضع التوجيه
                  </p>
                  <p class="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    تظهر الإجابة الصحيحة والشرح بعد كل سؤال
                  </p>
                </button>
                <button
                  type="button"
                  :class="[
                    'rounded-xl border p-4 text-right transition-all',
                    config.mode === 'exam'
                      ? 'border-primary-400 bg-primary-50/60 shadow-sm'
                      : 'border-gray-100 hover:border-primary-200'
                  ]"
                  @click="config.mode = 'exam'"
                >
                  <UIcon
                    name="i-heroicons-clipboard-document-check"
                    :class="['w-5 h-5 mb-2', config.mode === 'exam' ? 'text-primary-600' : 'text-gray-400']"
                  />
                  <p class="text-sm font-bold text-gray-900">
                    وضع الاختبار
                  </p>
                  <p class="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    النتائج والإجابات تظهر بعد الإنهاء فقط
                  </p>
                </button>
              </div>
            </div>

            <!-- Count -->
            <div>
              <p class="text-xs font-bold text-gray-600 mb-2">
                عدد الأسئلة
              </p>
              <div class="flex items-center gap-2 flex-wrap">
                <button
                  v-for="n in countPresets"
                  :key="n"
                  type="button"
                  :disabled="poolCount !== null && n > poolCount"
                  :class="[
                    'px-4 py-2 rounded-xl border text-sm font-bold transition-all',
                    config.question_count === n
                      ? 'border-primary-400 bg-primary-50 text-primary-700'
                      : 'border-gray-100 text-gray-600 hover:border-primary-200',
                    poolCount !== null && n > poolCount ? 'opacity-40 cursor-not-allowed' : ''
                  ]"
                  @click="config.question_count = n"
                >
                  {{ n }}
                </button>
                <UInput
                  v-model.number="config.question_count"
                  type="number"
                  :min="1"
                  :max="Math.min(100, poolCount ?? 100)"
                  size="sm"
                  class="w-24"
                />
              </div>
            </div>

            <!-- Time -->
            <div>
              <p class="text-xs font-bold text-gray-600 mb-2">
                المدة الزمنية
              </p>
              <div class="flex items-center gap-2 flex-wrap">
                <button
                  v-for="t in timeOptions"
                  :key="t.value ?? 0"
                  type="button"
                  :class="[
                    'px-4 py-2 rounded-xl border text-sm font-bold transition-all',
                    config.time_limit_minutes === t.value
                      ? 'border-primary-400 bg-primary-50 text-primary-700'
                      : 'border-gray-100 text-gray-600 hover:border-primary-200'
                  ]"
                  @click="config.time_limit_minutes = t.value"
                >
                  {{ t.label }}
                </button>
              </div>
            </div>

            <!-- Difficulty -->
            <div>
              <p class="text-xs font-bold text-gray-600 mb-2">
                مستوى الصعوبة
              </p>
              <div class="flex items-center gap-2 flex-wrap">
                <button
                  v-for="d in difficultyOptions"
                  :key="d.value ?? 'all'"
                  type="button"
                  :class="[
                    'px-4 py-2 rounded-xl border text-sm font-bold transition-all',
                    config.difficulty === d.value
                      ? 'border-primary-400 bg-primary-50 text-primary-700'
                      : 'border-gray-100 text-gray-600 hover:border-primary-200'
                  ]"
                  @click="config.difficulty = d.value"
                >
                  {{ d.label }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Pool + start -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-gray-100">
          <div class="flex-1 flex items-center gap-2 text-sm">
            <UIcon
              v-if="loadingPool"
              name="i-heroicons-arrow-path"
              class="w-4 h-4 text-primary-500 animate-spin"
            />
            <template v-else-if="poolCount !== null">
              <UIcon
                :name="poolCount > 0 ? 'i-heroicons-check-circle' : 'i-heroicons-exclamation-triangle'"
                :class="['w-4 h-4', poolCount > 0 ? 'text-success-500' : 'text-warning-500']"
              />
              <span :class="poolCount > 0 ? 'text-gray-600' : 'text-warning-600 font-bold'">
                {{ poolCount > 0 ? `متاح ${formatNumber(poolCount)} سؤال` : 'لا توجد أسئلة مطابقة لهذه الاختيارات' }}
              </span>
            </template>
            <span
              v-else
              class="text-gray-400"
            >اختر النطاق لعرض عدد الأسئلة المتاحة</span>
          </div>
          <UButton
            color="primary"
            size="lg"
            icon="i-heroicons-play"
            :loading="starting"
            :disabled="!canStart"
            @click="startQuiz"
          >
            ابدأ الاختبار
          </UButton>
        </div>
      </div>
    </div>

    <!-- History -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-l from-info-50/40 to-white flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-info-50 border border-info-100 flex items-center justify-center shrink-0">
          <UIcon
            name="i-heroicons-clock"
            class="w-5 h-5 text-info-600"
          />
        </div>
        <div>
          <h2 class="text-base font-bold text-gray-900">
            سجل الاختبارات
          </h2>
          <p class="text-xs text-gray-500 mt-0.5">
            {{ historyTotal !== null ? `${formatNumber(historyTotal)} اختبار` : 'اختباراتك السابقة' }}
          </p>
        </div>
      </div>

      <div
        v-if="loadingHistory && !history.length"
        class="py-10 text-center"
      >
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-6 h-6 text-info-500 animate-spin"
        />
      </div>

      <div
        v-else-if="!history.length"
        class="py-10 text-center px-6"
      >
        <UIcon
          name="i-heroicons-puzzle-piece"
          class="w-10 h-10 text-gray-300 mx-auto mb-2"
        />
        <p class="text-sm text-gray-500">
          لم تنشئ أي اختبار بعد. ابدأ أول اختبار لك من الأعلى.
        </p>
      </div>

      <div
        v-else
        class="divide-y divide-gray-100"
      >
        <NuxtLink
          v-for="s in history"
          :key="s.id"
          :to="`/dashboard/quizzes/${s.id}`"
          class="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
        >
          <div
            :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
              statusStyles[s.status]?.bg || 'bg-gray-50'
            ]"
          >
            <UIcon
              :name="statusStyles[s.status]?.icon || 'i-heroicons-question-mark-circle'"
              :class="['w-5 h-5', statusStyles[s.status]?.text || 'text-gray-400']"
            />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-sm font-bold text-gray-900">
                <template v-if="s.practice_exam">{{ s.practice_exam.title }}</template>
                <template v-else-if="s.is_simulation">محاكاة الاختبار</template>
                <template v-else-if="s.is_daily_challenge">التحدي اليومي</template>
                <template v-else>{{ s.mode === 'tutor' ? 'وضع التوجيه' : 'وضع الاختبار' }}</template>
              </span>
              <span
                v-if="s.practice_exam"
                class="text-[11px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 font-bold"
              >
                <UIcon
                  name="i-heroicons-document-text"
                  class="w-3 h-3 inline align-middle"
                /> نموذج
              </span>
              <span
                v-else-if="s.is_simulation"
                class="text-[11px] px-2 py-0.5 rounded-full bg-info-50 text-info-700 font-bold"
              >
                <UIcon
                  name="i-heroicons-academic-cap"
                  class="w-3 h-3 inline align-middle"
                /> شامل
              </span>
              <span
                v-else-if="s.is_daily_challenge"
                class="text-[11px] px-2 py-0.5 rounded-full bg-secondary-50 text-secondary-700 font-bold"
              >
                🔥 يومي
              </span>
              <span
                v-else
                class="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
              >
                {{ sourceLabel(s.source) }}
              </span>
              <span class="text-[11px] text-gray-400">
                {{ s.question_count }} سؤال
              </span>
            </div>
            <p class="text-[11px] text-gray-500 mt-1">
              {{ formatDate(s.started_at) }}
            </p>
          </div>
          <div class="text-left shrink-0">
            <p
              v-if="s.score_percent !== null"
              :class="[
                'text-lg font-black',
                s.score_percent >= 50 ? 'text-success-600' : 'text-error-500'
              ]"
            >
              {{ s.score_percent }}%
            </p>
            <span
              v-else
              :class="[
                'text-[11px] px-2 py-1 rounded-full font-bold',
                statusStyles[s.status]?.badge || 'bg-gray-100 text-gray-600'
              ]"
            >
              {{ statusLabel(s.status) }}
            </span>
          </div>
          <UIcon
            name="i-heroicons-arrow-left"
            class="w-4 h-4 text-gray-300 group-hover:text-primary-600 transition-colors"
          />
        </NuxtLink>
      </div>

      <div
        v-if="historyHasMore"
        class="px-4 py-3 border-t border-gray-100 flex justify-center"
      >
        <UButton
          color="info"
          variant="soft"
          size="sm"
          icon="i-heroicons-plus"
          :loading="loadingHistory"
          @click="loadHistory(false)"
        >
          عرض المزيد
        </UButton>
      </div>
    </div>

    <!-- Share challenge code -->
    <UModal
      v-model:open="shareOpen"
      :ui="{ content: 'sm:max-w-md' }"
    >
      <template #content>
        <div
          dir="rtl"
          class="p-6 text-center"
        >
          <div class="w-14 h-14 mx-auto rounded-2xl bg-secondary-50 flex items-center justify-center mb-4">
            <UIcon
              name="i-heroicons-user-plus"
              class="w-7 h-7 text-secondary-600"
            />
          </div>
          <h3 class="text-lg font-black text-gray-900 mb-1">
            تم إنشاء التحدّي
          </h3>
          <p class="text-sm text-gray-500 mb-5">
            شارك هذا الرمز مع صديقك لينضمّ إلى نفس التحدّي
          </p>

          <div class="flex items-center justify-center gap-2 mb-2">
            <code class="font-mono font-black text-2xl tracking-[0.3em] text-secondary-700 bg-secondary-50 rounded-xl px-5 py-3 select-all">{{ createdCode }}</code>
            <UButton
              :icon="codeCopied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
              :color="codeCopied ? 'success' : 'neutral'"
              variant="soft"
              size="lg"
              square
              @click="copyCreatedCode"
            />
          </div>
          <p class="h-5 text-xs text-success-600 mb-4">
            {{ codeCopied ? 'تم نسخ الرمز ✓' : '' }}
          </p>

          <div class="flex flex-col sm:flex-row gap-2">
            <UButton
              block
              color="neutral"
              variant="ghost"
              @click="shareOpen = false"
            >
              لاحقاً
            </UButton>
            <UButton
              block
              color="secondary"
              icon="i-heroicons-play"
              @click="startCreatedChallenge"
            >
              ابدأ التحدّي الآن
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { examsService } from '@/services/api/exams.service'
import { quizzesService } from '@/services/api/quizzes.service'
import { formatNumber } from '@/utils/number'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/utils/helpers/toast.helper'
import type { QuizSession, QuizSource, QuizDifficulty, QuizMode, DailyChallengeStatus } from '@/types/quiz'

definePageMeta({ layout: 'dashboard', middleware: ['auth'], title: 'اختباراتي الذاتية' })
useSeoMeta({ title: 'اختباراتي الذاتية | A Plus' })

const authStore = useAuthStore()

interface Category { id: number, name: string }
interface Section { id: number, name: string, categories: Category[] }

// ---- Scope tree ----
const sections = ref<Section[]>([])
const loadingSections = ref(false)
const expandedSections = ref(new Set<number>())
const selectedCategoryIds = ref(new Set<number>())

const examId = computed<number | null>(() => {
  const u = authStore.getUser as { student?: { exam_id?: number } } | null
  return u?.student?.exam_id ?? null
})

async function loadSections() {
  if (!examId.value) {
    sections.value = []
    return
  }
  loadingSections.value = true
  try {
    const res = await examsService.getExamSections(examId.value)
    const data = res.data?.data ?? res.data ?? {}
    sections.value = data.sections ?? []
  } catch (err) {
    console.error('Failed to load sections', err)
    sections.value = []
  } finally {
    loadingSections.value = false
  }
}

function toggleSectionExpand(id: number) {
  if (expandedSections.value.has(id)) expandedSections.value.delete(id)
  else expandedSections.value.add(id)
  expandedSections.value = new Set(expandedSections.value)
}

function isSectionFullySelected(section: Section): boolean {
  const cats = section.categories || []
  return cats.length > 0 && cats.every(c => selectedCategoryIds.value.has(c.id))
}

function isSectionPartiallySelected(section: Section): boolean {
  const cats = section.categories || []
  const selected = cats.filter(c => selectedCategoryIds.value.has(c.id)).length
  return selected > 0 && selected < cats.length
}

function toggleSection(section: Section) {
  const cats = section.categories || []
  const allSelected = isSectionFullySelected(section)
  cats.forEach((c) => {
    if (allSelected) selectedCategoryIds.value.delete(c.id)
    else selectedCategoryIds.value.add(c.id)
  })
  selectedCategoryIds.value = new Set(selectedCategoryIds.value)
}

function toggleCategory(id: number) {
  if (selectedCategoryIds.value.has(id)) selectedCategoryIds.value.delete(id)
  else selectedCategoryIds.value.add(id)
  selectedCategoryIds.value = new Set(selectedCategoryIds.value)
}

// ---- Config ----
const config = reactive({
  mode: 'tutor' as QuizMode,
  source: 'random' as QuizSource,
  question_count: 10,
  time_limit_minutes: null as number | null,
  difficulty: null as QuizDifficulty | null
})

const countPresets = [10, 20, 30]
const timeOptions = [
  { label: 'بدون وقت', value: null },
  { label: '10 د', value: 10 },
  { label: '20 د', value: 20 },
  { label: '30 د', value: 30 },
  { label: '60 د', value: 60 }
]
const difficultyOptions = [
  { label: 'الكل', value: null },
  { label: 'سهل', value: 'easy' as QuizDifficulty },
  { label: 'متوسط', value: 'medium' as QuizDifficulty },
  { label: 'صعب', value: 'hard' as QuizDifficulty }
]
const sourceOptions = [
  { value: 'random' as QuizSource, label: 'عشوائي', hint: 'أسئلة عشوائية من النطاق المحدد', icon: 'i-heroicons-arrows-pointing-out' },
  { value: 'unanswered' as QuizSource, label: 'لم أحلها بعد', hint: 'أسئلة لم تجب عليها من قبل', icon: 'i-heroicons-sparkles' },
  { value: 'wrong' as QuizSource, label: 'أخطأت بها', hint: 'أسئلة أجبت عليها خطأ سابقاً', icon: 'i-heroicons-arrow-path-rounded-square' },
  { value: 'bookmarked' as QuizSource, label: 'المحفوظات', hint: 'الأسئلة التي قمت بحفظها', icon: 'i-heroicons-bookmark' }
]

// ---- Live pool count ----
const poolCount = ref<number | null>(null)
const loadingPool = ref(false)
let poolTimer: ReturnType<typeof setTimeout> | null = null

watch(
  [() => config.source, () => config.difficulty, selectedCategoryIds],
  () => {
    if (poolTimer) clearTimeout(poolTimer)
    poolTimer = setTimeout(fetchPoolCount, 400)
  },
  { deep: true }
)

async function fetchPoolCount() {
  const catIds = [...selectedCategoryIds.value]
  if (!catIds.length && config.source !== 'bookmarked') {
    poolCount.value = null
    return
  }
  loadingPool.value = true
  try {
    const res = await quizzesService.getPoolCount({
      'source': config.source,
      'difficulty': config.difficulty ?? undefined,
      'category_ids[]': catIds
    })
    poolCount.value = res.data?.data?.available ?? 0
    if (poolCount.value !== null && config.question_count > poolCount.value && poolCount.value > 0) {
      config.question_count = Math.min(config.question_count, poolCount.value)
    }
  } catch (err) {
    console.error('Failed to fetch pool count', err)
    poolCount.value = null
  } finally {
    loadingPool.value = false
  }
}

const canStart = computed(() => {
  if (starting.value) return false
  if (config.source === 'bookmarked') return poolCount.value === null || poolCount.value > 0
  return selectedCategoryIds.value.size > 0 && (poolCount.value ?? 0) > 0
})

// ---- Start ----
const starting = ref(false)

async function startQuiz() {
  starting.value = true
  try {
    const res = await quizzesService.createSession({
      mode: config.mode,
      source: config.source,
      category_ids: [...selectedCategoryIds.value],
      question_count: config.question_count,
      time_limit_minutes: config.time_limit_minutes,
      difficulty: config.difficulty
    })
    const body = res.data
    if (body?.status === 409 || body?.data?.active_session_id) {
      await loadActive()
      showToast('تنبيه', body?.message || 'لديك اختبار قيد التنفيذ', 'warning')
      return
    }
    if (body?.status === 422) {
      const firstError = Object.values(body?.errors ?? {})[0]
      showToast('خطأ', Array.isArray(firstError) ? firstError[0] : (body?.message || 'تعذر إنشاء الاختبار'), 'error')
      return
    }
    const session = body?.data?.session
    if (session?.id) {
      navigateTo(`/dashboard/quizzes/${session.id}`)
    }
  } catch (err) {
    const data = (err as { response?: { data?: { data?: { active_session_id?: number } } } })?.response?.data
    if (data?.data?.active_session_id) {
      await loadActive()
    }
  } finally {
    starting.value = false
  }
}

// ---- Daily challenge ----
const daily = ref<DailyChallengeStatus | null>(null)
const startingDaily = ref(false)

// The daily session also shows in the active banner — hide the duplicate.
const isActiveDaily = computed(() =>
  !!activeSession.value?.is_daily_challenge
)
const isActiveSimulation = computed(() =>
  !!activeSession.value?.is_simulation
)

// ---- Challenge a friend ----
const joinCode = ref('')
const creatingChallenge = ref(false)
const joiningChallenge = ref(false)

async function createChallenge() {
  if (config.source !== 'bookmarked' && selectedCategoryIds.value.size === 0) {
    showToast('تنبيه', 'اختر النطاق أولاً من منشئ الاختبار بالأعلى', 'warning')
    return
  }
  creatingChallenge.value = true
  try {
    const { challengesService } = await import('@/services/api/challenges.service')
    const res = await challengesService.create({
      mode: 'exam',
      source: config.source,
      category_ids: [...selectedCategoryIds.value],
      question_count: config.question_count,
      time_limit_minutes: config.time_limit_minutes,
      difficulty: config.difficulty
    })
    const body = res.data
    if (body?.status === 409) {
      showToast('تنبيه', body?.message || 'لديك اختبار قيد التنفيذ — أنهه أولاً', 'warning')
      return
    }
    if (body?.status === 422) {
      const firstError = Object.values(body?.errors ?? {})[0]
      showToast('خطأ', Array.isArray(firstError) ? firstError[0] : (body?.message || 'تعذّر إنشاء التحدّي'), 'error')
      return
    }
    const session = body?.data?.session
    if (session?.id) {
      // Show the code in a copyable dialog (not just a fleeting toast) so it
      // can actually be shared; the quiz starts when the creator confirms.
      createdCode.value = body.data.invite_code
      createdSessionId.value = session.id
      codeCopied.value = false
      shareOpen.value = true
    }
  } catch (err) {
    console.error('Failed to create challenge', err)
  } finally {
    creatingChallenge.value = false
  }
}

const shareOpen = ref(false)
const createdCode = ref('')
const createdSessionId = ref<number | null>(null)
const codeCopied = ref(false)

async function copyCreatedCode() {
  try {
    await navigator.clipboard.writeText(createdCode.value)
    codeCopied.value = true
    setTimeout(() => (codeCopied.value = false), 1500)
  } catch {
    // clipboard unavailable — the code is still shown for manual copy
  }
}

function startCreatedChallenge() {
  shareOpen.value = false
  if (createdSessionId.value) navigateTo(`/dashboard/quizzes/${createdSessionId.value}`)
}

async function joinChallenge() {
  const code = joinCode.value.trim().toUpperCase()
  if (!code) return
  joiningChallenge.value = true
  try {
    const { challengesService } = await import('@/services/api/challenges.service')
    const res = await challengesService.join(code)
    const body = res.data
    if (body?.status === 409) {
      showToast('تنبيه', body?.message || 'لديك اختبار قيد التنفيذ — أنهه أولاً', 'warning')
      return
    }
    if (body?.status === 422) {
      const firstError = Object.values(body?.errors ?? {})[0]
      showToast('خطأ', Array.isArray(firstError) ? firstError[0] : (body?.message || 'رمز غير صحيح'), 'error')
      return
    }
    const session = body?.data?.session
    if (session?.id) {
      navigateTo(`/dashboard/quizzes/${session.id}`)
    }
  } catch (err) {
    console.error('Failed to join challenge', err)
  } finally {
    joiningChallenge.value = false
  }
}

// ---- Exam simulation ----
const simulationInfo = ref<{ question_count: number, seconds_per_question: number } | null>(null)
const startingSimulation = ref(false)

async function loadSimulationInfo() {
  try {
    const res = await quizzesService.getSimulationInfo()
    simulationInfo.value = res.data?.data?.config ?? null
  } catch {
    simulationInfo.value = null
  }
}

async function startSimulation() {
  startingSimulation.value = true
  try {
    const res = await quizzesService.startSimulation()
    const body = res.data
    if (body?.status === 409) {
      showToast('تنبيه', body?.message || 'لديك اختبار قيد التنفيذ — أنهه أولاً', 'warning')
      await loadActive()
      return
    }
    if (body?.status === 422) {
      const firstError = Object.values(body?.errors ?? {})[0]
      showToast('خطأ', Array.isArray(firstError) ? firstError[0] : (body?.message || 'تعذر بدء المحاكاة'), 'error')
      return
    }
    const session = body?.data?.session
    if (session?.id) {
      navigateTo(`/dashboard/quizzes/${session.id}`)
    }
  } catch (err) {
    console.error('Failed to start simulation', err)
  } finally {
    startingSimulation.value = false
  }
}

async function loadDaily() {
  try {
    const res = await quizzesService.getDailyChallenge()
    daily.value = res.data?.data ?? null
  } catch {
    daily.value = null
  }
}

async function startDaily() {
  startingDaily.value = true
  try {
    const res = await quizzesService.startDailyChallenge()
    const body = res.data
    if (body?.status === 409) {
      showToast('تنبيه', body?.message || 'لديك اختبار قيد التنفيذ — أنهه أولاً', 'warning')
      await loadActive()
      return
    }
    const session = body?.data?.session
    if (session?.id) {
      navigateTo(`/dashboard/quizzes/${session.id}`)
    }
  } catch (err) {
    console.error('Failed to start daily challenge', err)
  } finally {
    startingDaily.value = false
  }
}

// ---- Active session ----
const activeSession = ref<QuizSession | null>(null)
const abandoning = ref(false)

async function loadActive() {
  try {
    const res = await quizzesService.getActiveSession()
    activeSession.value = res.data?.data?.session ?? null
  } catch {
    activeSession.value = null
  }
}

async function abandonActive() {
  if (!activeSession.value) return
  abandoning.value = true
  try {
    const res = await quizzesService.abandonSession(activeSession.value.id)
    // Backend renders validation failures as HTTP 200 with body.status 422
    // (e.g. daily challenges can't be abandoned) — don't treat those as success.
    if (res.data?.status === 422) {
      const firstError = Object.values(res.data?.errors ?? {})[0]
      showToast('تنبيه', Array.isArray(firstError) ? firstError[0] : 'تعذر إلغاء الاختبار', 'warning')
      return
    }
    activeSession.value = null
    loadHistory(true)
  } catch (err) {
    console.error('Failed to abandon session', err)
  } finally {
    abandoning.value = false
  }
}

// ---- History ----
const history = ref<QuizSession[]>([])
const historyTotal = ref<number | null>(null)
const historyPage = ref(1)
const historyLastPage = ref(1)
const loadingHistory = ref(false)

const historyHasMore = computed(() => historyLastPage.value > historyPage.value)

async function loadHistory(reset: boolean) {
  if (loadingHistory.value) return
  loadingHistory.value = true
  try {
    const nextPage = reset ? 1 : historyPage.value + 1
    const res = await quizzesService.getSessions({ page: nextPage, per_page: 10 })
    const data = res.data?.data ?? {}
    const items: QuizSession[] = data.sessions ?? []
    history.value = reset ? items : [...history.value, ...items]
    historyTotal.value = data.pagination?.total ?? history.value.length
    historyPage.value = data.pagination?.current_page ?? nextPage
    historyLastPage.value = data.pagination?.last_page ?? nextPage
  } catch (err) {
    console.error('Failed to load quiz history', err)
    if (reset) history.value = []
  } finally {
    loadingHistory.value = false
  }
}

// ---- Display helpers ----
const statusStyles: Record<string, { bg: string, text: string, icon: string, badge: string }> = {
  in_progress: { bg: 'bg-warning-50', text: 'text-warning-600', icon: 'i-heroicons-play-circle', badge: 'bg-warning-50 text-warning-700' },
  completed: { bg: 'bg-success-50', text: 'text-success-600', icon: 'i-heroicons-check-circle', badge: 'bg-success-50 text-success-700' },
  expired: { bg: 'bg-error-50', text: 'text-error-600', icon: 'i-heroicons-clock', badge: 'bg-error-50 text-error-700' },
  abandoned: { bg: 'bg-gray-50', text: 'text-gray-400', icon: 'i-heroicons-x-circle', badge: 'bg-gray-100 text-gray-600' }
}

function sourceLabel(source: string) {
  return { random: 'عشوائي', unanswered: 'لم تُحل', wrong: 'أخطاء سابقة', bookmarked: 'المحفوظات' }[source] || source
}

function statusLabel(status: string) {
  return { in_progress: 'قيد التنفيذ', completed: 'مكتمل', expired: 'انتهى الوقت', abandoned: 'ملغي' }[status] || status
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
  if (!examId.value) {
    await authStore.refreshUser()
  }
  await loadSections()
  applyPrefill()
  loadActive()
  loadHistory(true)
  loadDaily()
  loadSimulationInfo()
})

// Deep-link prefill from performance analytics: ?category=ID&source=wrong
function applyPrefill() {
  const route = useRoute()
  const cat = Number(route.query.category)
  if (Number.isFinite(cat) && cat > 0) {
    selectedCategoryIds.value = new Set([cat])
    // expand the section that owns it so the selection is visible
    const section = sections.value.find(s => (s.categories || []).some(c => c.id === cat))
    if (section) expandedSections.value = new Set([...expandedSections.value, section.id])
  }
  const src = String(route.query.source || '')
  if (['random', 'unanswered', 'wrong', 'bookmarked'].includes(src)) {
    config.source = src as QuizSource
  }
}
</script>
