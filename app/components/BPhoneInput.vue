<template>
  <div class="w-full relative" dir="ltr">
    <!-- Optional label if not wrapped in UFormField -->
    <div
      v-if="label"
      class="mb-2 font-medium flex items-center gap-2"
      dir="rtl"
    >
      <PhoneIcon class="w-4 h-4 text-gray-500" />
      <p class="capitalize text-gray-900 dark:text-white text-sm">
        {{ $t(label) }}
      </p>
      <span v-if="required" class="text-red-500">*</span>
    </div>

    <div class="relative w-full shadow-sm rounded-lg group">
      <vue-tel-input
        v-model="computedPhone"
        v-bind="telOptions"
        class="vue-tel-input-custom"
        :class="{
          'error-tel': error || (phoneIsValid && !phoneIsValid.valid),
        }"
        @country-changed="onCountryChanged"
        @validate="onValidate"
        @blur="$emit('blur')"
      />
      <!-- Inner subtle border overlay for premium feel -->
      <div
        class="pointer-events-none absolute inset-0 border border-gray-300 dark:border-gray-700/50 rounded-lg group-focus-within:border-primary-500 transition-colors duration-200"
      />
    </div>

    <div
      v-if="error || (phoneIsValid && !phoneIsValid.valid)"
      class="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium"
      dir="rtl"
    >
      <UIcon name="i-heroicons-exclamation-circle-20-solid" class="w-4 h-4" />
      <template v-if="phoneIsValid && !phoneIsValid.valid">
        {{ $t("errors.invalid_phone") }}
      </template>
      <template v-else-if="error">
        {{ $t(errorMessage) }}
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import PhoneIcon from "./icons/PhoneIcon.vue";

const props = defineProps({
  modelValue: {
    type: [String, null],
    required: true,
  },
  error: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: "errors.default",
  },
  required: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "signup.phone_placeholder",
  },
  defaultCountry: {
    type: String,
    default: "EG",
  },
});

const emit = defineEmits(["update:modelValue", "country", "blur"]);

const computedPhone = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value?.trim()),
});

const phoneIsValid = ref(null);

const telOptions = computed(() => ({
  autoFormat: false,
  defaultCountry: props.defaultCountry,
  mode: "auto",
  dropdownOptions: {
    showSearchBox: true,
    showFlags: true,
    showDialCodeInSelection: true,
    autocomplete: "off",
  },
  inputOptions: {
    autocomplete: "off",
    showDialCode: true,
    type: "text",
    maxlength: 15,
    placeholder: props.placeholder ? useI18n().t(props.placeholder) : "",
  },
  validCharactersOnly: true,
}));

const onCountryChanged = (country) => {
  if (country?.dialCode) {
    emit("country", `+${country.dialCode}`);
  }
};

const onValidate = (val) => {
  phoneIsValid.value = {
    ...val,
    valid: val.valid !== undefined ? val.valid : true,
  };
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      phoneIsValid.value = null;
    }
  },
);
</script>

<style lang="scss">
.vue-tel-input-custom {
  --vti-input-bg: transparent;
  --vti-text-color: inherit;
  direction: ltr !important;
  display: flex !important;
  align-items: center;
  width: 100% !important;
  height: 44px !important;
  border-radius: 0.5rem;
  background-color: transparent;
  border: 0 !important;
  box-shadow: none !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &.error-tel {
    background-color: rgb(254, 242, 242) !important; /* bg-red-50 */
    box-shadow: inset 0 0 0 1px rgb(239, 68, 68) !important;
  }
}

.dark .vue-tel-input-custom {
  background-color: transparent;

  &.error-tel {
    background-color: rgba(239, 68, 68, 0.1) !important;
    box-shadow: inset 0 0 0 1px rgb(248, 113, 113) !important;
  }
}

.vti__input {
  background: transparent !important;
  color: rgb(17, 24, 39) !important; /* text-gray-900 */
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  padding: 0 1rem !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  letter-spacing: 1px;
}

.dark .vti__input {
  color: rgb(243, 244, 246) !important; /* text-gray-100 */
}

/* Beautiful dropdown button styling */
.vti__dropdown {
  padding: 0 0.875rem !important;
  border-radius: 0 !important;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  outline: none !important;
  transition: all 0.2s ease;
  background-color: rgba(243, 244, 246, 0.5); /* bg-gray-100 lightly */
  border-right: 1px solid rgb(229, 231, 235); /* divider */
}

.dark .vti__dropdown {
  background-color: rgba(31, 41, 55, 0.4);
  border-right-color: rgba(55, 65, 81, 0.5);
}

.vti__dropdown:hover,
.vti__dropdown.open,
.vti__dropdown:focus {
  background-color: rgba(229, 231, 235, 0.8) !important;
}

.dark .vti__dropdown:hover,
.dark .vti__dropdown.open,
.dark .vti__dropdown:focus {
  background-color: rgba(55, 65, 81, 0.8) !important;
}

/* Fix the dropdown list appearance */
.vti__dropdown-list {
  z-index: 100 !important;
  background-color: #ffffff !important;
  border: 1px solid rgb(229, 231, 235) !important;
  margin-top: 8px;
  width: 320px;
  max-height: 300px;
  border-radius: 0.75rem !important;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1) !important;
  direction: ltr;
  padding: 0.5rem !important;

  /* Nice scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgb(209, 213, 219);
    border-radius: 10px;
  }
}

.dark .vti__dropdown-list {
  background-color: rgb(31, 41, 55) !important;
  border-color: rgb(55, 65, 81) !important;
  color: white;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.5) !important;

  &::-webkit-scrollbar-thumb {
    background: rgb(75, 85, 99);
  }
}

.vti__dropdown-item {
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem !important;
  margin-bottom: 2px;
  transition: all 0.15s;

  strong {
    font-weight: 500;
  }
}

.vti__dropdown-item.highlighted {
  background-color: rgba(var(--color-primary-500), 0.1) !important;
}

.dark .vti__dropdown-item.highlighted {
  background-color: rgba(var(--color-primary-500), 0.2) !important;
}

/* Beautiful Search box */
.vti__search_box_container {
  position: sticky;
  top: 0;
  background-color: #ffffff;
  padding: 0 0 0.5rem 0;
  z-index: 10;
  border-bottom: 1px solid rgb(243, 244, 246);
  margin-bottom: 0.5rem;
}

.dark .vti__search_box_container {
  background-color: rgb(31, 41, 55);
  border-bottom-color: rgb(55, 65, 81);
}

.vti__input.vti__search_box {
  width: 100%;
  border-radius: 0.5rem !important;
  border: 1px solid rgb(229, 231, 235) !important;
  padding: 0.5rem 0.75rem !important;
  font-size: 0.875rem !important;
  transition: border-color 0.2s;

  &:focus {
    border-color: rgb(var(--color-primary-500)) !important;
    box-shadow: 0 0 0 1px rgb(var(--color-primary-500)) !important;
  }
}

.dark .vti__input.vti__search_box {
  border-color: rgb(75, 85, 99) !important;
  background-color: rgb(17, 24, 39) !important;
  color: white !important;
}

.vti__dropdown {
  height: 100% !important;
}
</style>
