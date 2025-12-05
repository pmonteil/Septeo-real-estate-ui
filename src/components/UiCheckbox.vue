<template>
  <label class="ui-checkbox" :class="rootClasses">
    <!-- Hidden native checkbox -->
    <input
      ref="inputRef"
      type="checkbox"
      class="ui-checkbox__native"
      :checked="modelValue"
      :disabled="props.disabled"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
    />

    <!-- Custom checkbox box -->
    <span class="ui-checkbox__box" :class="boxClasses">
      <!-- Check icon -->
      <svg
        v-if="modelValue"
        class="ui-checkbox__icon"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>

    <!-- Label -->
    <span v-if="props.label" class="ui-checkbox__label">
      {{ props.label }}
    </span>
  </label>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    label?: string;
    disabled?: boolean;
    error?: boolean;
  }>(),
  {
    modelValue: false,
    disabled: false,
    error: false,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "change", value: boolean): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const isFocused = ref(false);

// Root classes
const rootClasses = computed(() => ({
  "ui-checkbox--disabled": props.disabled,
  "ui-checkbox--error": props.error,
  "ui-checkbox--focused": isFocused.value,
  "ui-checkbox--checked": props.modelValue,
}));

// Box classes
const boxClasses = computed(() => ({
  "ui-checkbox__box--checked": props.modelValue,
  "ui-checkbox__box--disabled": props.disabled,
  "ui-checkbox__box--error": props.error,
  "ui-checkbox__box--focused": isFocused.value,
}));

// Event handlers
function onChange(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.checked);
  emit("change", target.checked);
}

function onFocus(event: FocusEvent) {
  isFocused.value = true;
  emit("focus", event);
}

function onBlur(event: FocusEvent) {
  isFocused.value = false;
  emit("blur", event);
}

// Expose methods
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  toggle: () => {
    if (!props.disabled) {
      emit("update:modelValue", !props.modelValue);
      emit("change", !props.modelValue);
    }
  },
});
</script>

<style scoped>
.ui-checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--gap-field-label);
  cursor: pointer;
  user-select: none;
}

.ui-checkbox--disabled {
  cursor: not-allowed;
}

/* Hide native checkbox */
.ui-checkbox__native {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
}

/* ==========================================
 * CHECKBOX BOX
 * ========================================== */

.ui-checkbox__box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  padding: var(--brand-scale-4);
  background-color: var(--surface-field);
  border: var(--alias-border-width-sm) solid var(--border-default);
  border-radius: var(--alias-border-radius-md);
  transition: all 0.2s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Animation au changement d'état */
.ui-checkbox__native:active + .ui-checkbox__box {
  transform: scale(0.85);
}

.ui-checkbox--checked .ui-checkbox__box {
  animation: checkbox-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes checkbox-pop {
  0% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* Hover state - unchecked */
.ui-checkbox:hover:not(.ui-checkbox--disabled):not(.ui-checkbox--error) .ui-checkbox__box:not(.ui-checkbox__box--checked) {
  background-color: var(--surface-default);
  border-color: var(--border-action);
}

/* Hover state - checked */
.ui-checkbox:hover:not(.ui-checkbox--disabled) .ui-checkbox__box--checked {
  background-color: var(--surface-action-hover);
}

/* Focus state */
.ui-checkbox__box--focused {
  border-color: var(--border-action);
  box-shadow: 0 0 0 2px var(--alias-primary-100);
}

/* Checked state */
.ui-checkbox__box--checked {
  background-color: var(--surface-action);
  border-color: var(--surface-action);
}

/* Error state - unchecked */
.ui-checkbox__box--error:not(.ui-checkbox__box--checked) {
  border-color: var(--border-error);
}

/* Error state - checked */
.ui-checkbox__box--error.ui-checkbox__box--checked {
  background-color: var(--alias-error-default);
  border-color: var(--alias-error-default);
}

/* Error hover state - unchecked */
.ui-checkbox--error:hover:not(.ui-checkbox--disabled) .ui-checkbox__box--error:not(.ui-checkbox__box--checked) {
  background-color: var(--surface-error);
  border-color: var(--alias-error-600);
}

/* Error hover state - checked */
.ui-checkbox--error:hover:not(.ui-checkbox--disabled) .ui-checkbox__box--error.ui-checkbox__box--checked {
  background-color: var(--alias-error-600);
  border-color: var(--alias-error-600);
}

/* Disabled state - unchecked */
.ui-checkbox__box--disabled:not(.ui-checkbox__box--checked) {
  background-color: var(--surface-disable);
  border-color: var(--border-disabled);
}

/* Disabled state - checked */
.ui-checkbox__box--disabled.ui-checkbox__box--checked {
  background-color: var(--alias-neutral-300);
  border-color: var(--alias-neutral-300);
}

/* ==========================================
 * CHECK ICON
 * ========================================== */

.ui-checkbox__icon {
  width: 14px;
  height: 14px;
  color: var(--icon-on-action);
  animation: checkmark-draw 0.25s ease-out;
}

@keyframes checkmark-draw {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-45deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.2) rotate(0deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

/* ==========================================
 * LABEL
 * ========================================== */

.ui-checkbox__label {
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-line-height);
  color: var(--text-body);
}

/* Error label */
.ui-checkbox--error .ui-checkbox__label {
  color: var(--text-error);
}

/* Disabled label */
.ui-checkbox--disabled .ui-checkbox__label {
  color: var(--text-disable);
}

/* Hover animation for label */
.ui-checkbox:hover:not(.ui-checkbox--disabled) .ui-checkbox__label {
  color: var(--text-action-hover);
}

/* Keep error color on hover for error state */
.ui-checkbox--error:hover:not(.ui-checkbox--disabled) .ui-checkbox__label {
  color: var(--text-error);
}
</style>

