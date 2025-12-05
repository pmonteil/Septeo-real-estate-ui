<template>
  <label class="ui-radio" :class="rootClasses">
    <!-- Hidden native radio -->
    <input
      ref="inputRef"
      type="radio"
      class="ui-radio__native"
      :name="props.name"
      :value="props.value"
      :checked="isChecked"
      :disabled="props.disabled"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
    />

    <!-- Custom radio circle -->
    <span class="ui-radio__circle" :class="circleClasses">
      <!-- Check icon -->
      <svg
        v-if="isChecked"
        class="ui-radio__icon"
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
    <span v-if="props.label" class="ui-radio__label">
      {{ props.label }}
    </span>
  </label>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | boolean;
    value?: string | number | boolean;
    name?: string;
    label?: string;
    disabled?: boolean;
    error?: boolean;
  }>(),
  {
    disabled: false,
    error: false,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | boolean): void;
  (e: "change", value: string | number | boolean): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const isFocused = ref(false);

// Check if this radio is selected
const isChecked = computed(() => props.modelValue === props.value);

// Root classes
const rootClasses = computed(() => ({
  "ui-radio--disabled": props.disabled,
  "ui-radio--error": props.error,
  "ui-radio--focused": isFocused.value,
  "ui-radio--checked": isChecked.value,
}));

// Circle classes
const circleClasses = computed(() => ({
  "ui-radio__circle--checked": isChecked.value,
  "ui-radio__circle--disabled": props.disabled,
  "ui-radio__circle--error": props.error,
  "ui-radio__circle--focused": isFocused.value,
}));

// Event handlers
function onChange() {
  if (props.value !== undefined) {
    emit("update:modelValue", props.value);
    emit("change", props.value);
  }
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
});
</script>

<style scoped>
.ui-radio {
  display: inline-flex;
  align-items: center;
  gap: var(--gap-field-label);
  cursor: pointer;
  user-select: none;
}

.ui-radio--disabled {
  cursor: not-allowed;
}

/* Hide native radio */
.ui-radio__native {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
}

/* ==========================================
 * RADIO CIRCLE
 * ========================================== */

.ui-radio__circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  background-color: var(--surface-field);
  border: var(--alias-border-width-sm) solid var(--border-default);
  border-radius: 50%;
  transition: all 0.2s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Animation au changement d'état */
.ui-radio__native:active + .ui-radio__circle {
  transform: scale(0.85);
}

.ui-radio--checked .ui-radio__circle {
  animation: radio-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes radio-pop {
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
.ui-radio:hover:not(.ui-radio--disabled):not(.ui-radio--error) .ui-radio__circle:not(.ui-radio__circle--checked) {
  background-color: var(--surface-default);
  border-color: var(--border-action);
}

/* Hover state - checked */
.ui-radio:hover:not(.ui-radio--disabled):not(.ui-radio--error) .ui-radio__circle--checked {
  background-color: var(--surface-action-hover);
}

/* Focus state */
.ui-radio__circle--focused {
  border-color: var(--border-action);
  box-shadow: 0 0 0 2px var(--alias-primary-100);
}

/* Checked state */
.ui-radio__circle--checked {
  background-color: var(--surface-action);
  border-color: var(--surface-action);
}

/* Error state - unchecked */
.ui-radio__circle--error:not(.ui-radio__circle--checked) {
  border-color: var(--border-error);
}

/* Error state - checked */
.ui-radio__circle--error.ui-radio__circle--checked {
  background-color: var(--alias-error-default);
  border-color: var(--alias-error-default);
}

/* Error hover state - unchecked */
.ui-radio--error:hover:not(.ui-radio--disabled) .ui-radio__circle--error:not(.ui-radio__circle--checked) {
  background-color: var(--surface-error);
  border-color: var(--alias-error-600);
}

/* Error hover state - checked */
.ui-radio--error:hover:not(.ui-radio--disabled) .ui-radio__circle--error.ui-radio__circle--checked {
  background-color: var(--alias-error-600);
  border-color: var(--alias-error-600);
}

/* Disabled state - unchecked */
.ui-radio__circle--disabled:not(.ui-radio__circle--checked) {
  background-color: var(--surface-disable);
  border-color: var(--border-disabled);
}

/* Disabled state - checked */
.ui-radio__circle--disabled.ui-radio__circle--checked {
  background-color: var(--alias-neutral-300);
  border-color: var(--alias-neutral-300);
}

/* ==========================================
 * CHECK ICON
 * ========================================== */

.ui-radio__icon {
  width: 10px;
  height: 10px;
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

.ui-radio__label {
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-line-height);
  color: var(--text-body);
}

/* Error label */
.ui-radio--error .ui-radio__label {
  color: var(--text-error);
}

/* Disabled label */
.ui-radio--disabled .ui-radio__label {
  color: var(--text-disable);
}

/* Hover animation for label */
.ui-radio:hover:not(.ui-radio--disabled) .ui-radio__label {
  color: var(--text-action-hover);
}

/* Keep error color on hover for error state */
.ui-radio--error:hover:not(.ui-radio--disabled) .ui-radio__label {
  color: var(--text-error);
}
</style>

