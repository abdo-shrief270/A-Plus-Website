<template>
  <div class="w-full">
    <div
      v-if="label"
      class="mb-2 font-medium flex items-center gap-2"
    >
      <PhoneIcon class="w-4 h-4 text-gray-500" />
      <p class="capitalize text-gray-900 dark:text-white text-sm">
        {{ $t(label) }}
      </p>
      <span
        v-if="required"
        class="text-red-500"
      >*</span>
    </div>
    <vue-tel-input
      v-model="computedPhone"
      v-bind="telOptions"
      class="vue-tel-input-custom"
      :class="{
        'error-tel': error || !phoneIsValid?.valid
      }"
      @country-changed="onCountryChanged"
      @validate="onValidate"
      @blur="$emit('blur')"
    />

    <div
      v-if="error || (phoneIsValid && !phoneIsValid.valid)"
      class="mt-2 text-sm text-red-500 flex items-center gap-1"
    >
      <UIcon name="i-heroicons-exclamation-circle-20-solid" />
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
import { ref, computed, watch } from 'vue'
import PhoneIcon from './icons/PhoneIcon.vue'

const props = defineProps({
  modelValue: {
    type: [String, null],
    required: true
  },
  error: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: 'errors.default'
  },
  required: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'signup.phone_placeholder'
  },
  defaultCountry: {
    type: String,
    default: 'EG'
  }
})

const emit = defineEmits(['update:modelValue', 'country', 'blur'])

const computedPhone = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value?.trim())
})

const phoneIsValid = ref(null)

const telOptions = computed(() => ({
  autoFormat: false,
  defaultCountry: props.defaultCountry,
  mode: 'auto',
  dropdownOptions: {
    showSearchBox: true,
    showFlags: true,
    showDialCodeInSelection: true,
    autocomplete: 'off'
  },
  inputOptions: {
    autocomplete: 'off',
    showDialCode: true,
    type: 'text',
    maxlength: 15,
    placeholder: props.placeholder ? useI18n().t(props.placeholder) : ''
  },
  validCharactersOnly: true
}))

const onCountryChanged = (country) => {
  if (country?.dialCode) {
    emit('country', `+${country.dialCode}`)
  }
}

const onValidate = (val) => {
  phoneIsValid.value = {
    ...val,
    valid: val.valid !== undefined ? val.valid : true
  }
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      phoneIsValid.value = null
    }
  }
)
</script>

<style lang="scss">
.vue-tel-input-custom {
  --vti-input-bg: transparent;
  --vti-text-color: inherit;
  display: flex !important;
  align-items: center;
  width: 100% !important;
  height: 44px !important;
  border-radius: 0.5rem;
  border: 1px solid rgb(var(--color-gray-200));
  background-color: white;
  transition: all 0.2s;

  &.error-tel {
    border-color: #ef4444 !important;
  }

  &:focus-within {
    border-color: rgb(var(--color-primary-500));
    box-shadow: 0 0 0 2px rgb(var(--color-primary-500));
  }
}

.dark .vue-tel-input-custom {
  background-color: rgb(var(--color-gray-900));
  border-color: rgb(var(--color-gray-700));
}

.vti__input {
  background: transparent !important;
  color: inherit !important;
  font-size: 0.875rem !important;
  padding-left: 0.75rem !important;
  padding-right: 0.75rem !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.vti__dropdown {
  padding: 0 0.75rem !important;
  border-radius: 0.5rem 0 0 0.5rem;
}

[dir="rtl"] .vti__dropdown {
  border-radius: 0 0.5rem 0.5rem 0;
}

.vti__dropdown:hover {
  background-color: rgba(var(--color-gray-100), 0.5) !important;
}

.dark .vti__dropdown:hover {
  background-color: rgba(var(--color-gray-700), 0.5) !important;
}

.vti__dropdown-list {
  z-index: 50;
  background-color: white !important;
  border: 1px solid rgb(var(--color-gray-200));
  margin-top: 8px;
  width: 300px;
}

.dark .vti__dropdown-list {
  background-color: rgb(var(--color-gray-800)) !important;
  border-color: rgb(var(--color-gray-700));
  color: white;
}

.vti__selection {
  font-size: 0.875rem !important;
}

.vti__search_box_container {
  position: sticky;
  top: 0;
  background-color: #fff;
  padding: 8px;
}

.dark .vti__search_box_container {
  background-color: rgb(var(--color-gray-800));
}

.vti__input.vti__search_box {
  width: 100%;
  border-radius: 8px;
  border: 1px solid rgb(var(--color-gray-200));
}

.dark .vti__input.vti__search_box {
  border-color: rgb(var(--color-gray-700));
  background-color: rgb(var(--color-gray-900)) !important;
}
</style>
