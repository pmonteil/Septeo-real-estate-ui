<template>
  <label class="ui-switch" :class="rootClasses">
    <!-- Hidden native checkbox -->
    <input
      ref="inputRef"
      type="checkbox"
      class="ui-switch__native"
      :checked="modelValue"
      :disabled="props.disabled"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
    />

    <!-- Track (the sliding background) -->
    <span class="ui-switch__track" :class="trackClasses">
      <!-- Thumb (the circle that moves) -->
      <span class="ui-switch__thumb"></span>
    </span>

    <!-- Label -->
    <span v-if="props.label" class="ui-switch__label">
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
  "ui-switch--disabled": props.disabled,
  "ui-switch--error": props.error,
  "ui-switch--focused": isFocused.value,
  "ui-switch--checked": props.modelValue,
}));

// Track classes
const trackClasses = computed(() => ({
  "ui-switch__track--checked": props.modelValue,
  "ui-switch__track--disabled": props.disabled,
  "ui-switch__track--error": props.error,
  "ui-switch__track--focused": isFocused.value,
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
.ui-switch {
  display: inline-flex;
  align-items: center;
  gap: var(--gap-field-label);
  cursor: pointer;
  user-select: none;
}

.ui-switch--disabled {
  cursor: not-allowed;
}

/* Hide native checkbox */
.ui-switch__native {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
}

/* ==========================================
 * TRACK (sliding background)
 * ========================================== */

.ui-switch__track {
  position: relative;
  display: flex;
  align-items: center;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
  padding: 4px;
  background-color: var(--alias-neutral-500);
  border: var(--alias-border-width-sm) solid var(--alias-neutral-500);
  border-radius: 100px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Hover state - unchecked */
.ui-switch:hover:not(.ui-switch--disabled):not(.ui-switch--error) .ui-switch__track:not(.ui-switch__track--checked) {
  background-color: var(--alias-neutral-600);
  border-color: var(--alias-neutral-600);
}

/* Hover state - checked */
.ui-switch:hover:not(.ui-switch--disabled):not(.ui-switch--error) .ui-switch__track--checked {
  background-color: var(--surface-action-hover);
  border-color: var(--surface-action-hover);
}

/* Focus state */
.ui-switch__track--focused {
  box-shadow: 0 0 0 2px var(--alias-primary-100);
}

/* Checked state */
.ui-switch__track--checked {
  background-color: var(--surface-action);
  border-color: var(--border-action);
}

/* Error state - unchecked */
.ui-switch__track--error:not(.ui-switch__track--checked) {
  background-color: var(--alias-neutral-500);
  border-color: var(--border-error);
}

/* Error state - checked */
.ui-switch__track--error.ui-switch__track--checked {
  background-color: var(--alias-error-default);
  border-color: var(--alias-error-default);
}

/* Error hover state - unchecked */
.ui-switch--error:hover:not(.ui-switch--disabled) .ui-switch__track--error:not(.ui-switch__track--checked) {
  background-color: var(--alias-neutral-600);
  border-color: var(--alias-error-600);
}

/* Error hover state - checked */
.ui-switch--error:hover:not(.ui-switch--disabled) .ui-switch__track--error.ui-switch__track--checked {
  background-color: var(--alias-error-600);
  border-color: var(--alias-error-600);
}

/* Disabled state - unchecked */
.ui-switch__track--disabled:not(.ui-switch__track--checked) {
  background-color: var(--alias-neutral-300);
  border-color: var(--alias-neutral-300);
}

/* Disabled state - checked */
.ui-switch__track--disabled.ui-switch__track--checked {
  background-color: var(--alias-neutral-300);
  border-color: var(--alias-neutral-300);
}

/* ==========================================
 * THUMB (the circle)
 * ========================================== */

.ui-switch__thumb {
  width: 14px;
  height: 14px;
  background-color: var(--alias-neutral-white);
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: translateX(0);
}

/* Checked state - move thumb to the right */
.ui-switch__track--checked .ui-switch__thumb {
  transform: translateX(18px);
}

/* Animation au clic (effet de pression) */
.ui-switch__native:active + .ui-switch__track {
  transform: scale(0.95);
}

/* Animation pop au changement d'état */
.ui-switch--checked .ui-switch__track {
  animation: switch-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes switch-pop {
  0% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Animation du thumb */
.ui-switch__track--checked .ui-switch__thumb {
  animation: thumb-slide 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes thumb-slide {
  0% {
    transform: translateX(0) scale(0.8);
  }
  50% {
    transform: translateX(18px) scale(1.1);
  }
  100% {
    transform: translateX(18px) scale(1);
  }
}

/* ==========================================
 * LABEL
 * ========================================== */

.ui-switch__label {
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-line-height);
  color: var(--text-body);
}

/* Error label */
.ui-switch--error .ui-switch__label {
  color: var(--text-error);
}

/* Disabled label */
.ui-switch--disabled .ui-switch__label {
  color: var(--text-disable);
}

/* Hover animation for label */
.ui-switch:hover:not(.ui-switch--disabled) .ui-switch__label {
  color: var(--text-action-hover);
}

/* Keep error color on hover for error state */
.ui-switch--error:hover:not(.ui-switch--disabled) .ui-switch__label {
  color: var(--text-error);
}
</style>


