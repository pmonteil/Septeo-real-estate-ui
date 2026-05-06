<template>
  <label
    class="ui-radio"
    :class="rootClasses"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Native radio (masqué) -->
    <input
      ref="inputRef"
      type="radio"
      class="ui-radio__native"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="disabled"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
    />

    <!-- Cercle radio (18×18px) -->
    <span class="ui-radio__circle" :class="circleClasses">
      <!-- Check icon (selected) -->
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
    <span v-if="label" class="ui-radio__label">{{ label }}</span>

    <!-- Slot pour contenu custom -->
    <slot />
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
  }>(),
  {
    disabled: false,
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
const isHovered = ref(false);

const isChecked = computed(() => props.modelValue === props.value);

const rootClasses = computed(() => ({
  "ui-radio--checked": isChecked.value,
  "ui-radio--hover": isHovered.value && !props.disabled,
  "ui-radio--focused": isFocused.value,
  "ui-radio--disabled": props.disabled,
}));

const circleClasses = computed(() => ({
  "ui-radio__circle--checked": isChecked.value,
}));

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

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
});
</script>

<style scoped>
/* ==========================================
 * BASE
 * ========================================== */

.ui-radio {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-md);
  height: 36px;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease;
  border: 1.5px solid transparent;
}

/* Checked — fond bleu clair */
.ui-radio--checked {
  background-color: var(--surface-light-action);
}

/* Hover unchecked — fond neutre gris */
.ui-radio:hover:not(.ui-radio--disabled):not(.ui-radio--checked) {
  background-color: var(--surface-neutral);
}

/* Hover checked — fond identique (pas de changement card) */
.ui-radio--checked:hover:not(.ui-radio--disabled) {
  background-color: var(--surface-light-action);
}

/* Focus — bordure bleue sur la card */
.ui-radio--focused {
  border-color: var(--border-action);
}

/* Disabled */
.ui-radio--disabled {
  opacity: var(--opacity-disabled);
  pointer-events: none;
  cursor: not-allowed;
}

/* Native input masqué */
.ui-radio__native {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
}

/* ==========================================
 * RADIO CIRCLE (18×18px)
 * ========================================== */

.ui-radio__circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--sizing-icon-xs);    /* 18px */
  height: var(--sizing-icon-xs);   /* 18px */
  flex-shrink: 0;
  background-color: var(--surface-field);
  border: var(--alias-border-width-sm) solid var(--border-action-neutral);
  border-radius: var(--radius-full);
  transition: all 0.15s ease;
}

/* Hover unchecked circle — bordure action */
.ui-radio:hover:not(.ui-radio--disabled) .ui-radio__circle:not(.ui-radio__circle--checked) {
  border-color: var(--border-action);
}

/* Checked circle — fond bleu */
.ui-radio__circle--checked {
  background-color: var(--surface-action);
  border-color: var(--surface-action);
}

/* Hover checked circle */
.ui-radio:hover:not(.ui-radio--disabled) .ui-radio__circle--checked {
  background-color: var(--surface-action-hover);
  border-color: var(--surface-action-hover);
}

/* ==========================================
 * CHECK ICON (14px)
 * ========================================== */

.ui-radio__icon {
  width: var(--sizing-icon-xxs);   /* 14px */
  height: var(--sizing-icon-xxs);  /* 14px */
  color: var(--icon-on-action);
  flex-shrink: 0;
}

/* ==========================================
 * LABEL
 * ========================================== */

.ui-radio__label {
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-semi-bold);
  line-height: var(--body-line-height);
  color: var(--text-body-secondary);
  transition: color 0.15s ease;
  white-space: nowrap;
}

/* Checked — label bleu */
.ui-radio--checked .ui-radio__label {
  color: var(--text-action);
}

/* Hover checked — label bleu hover */
.ui-radio--checked:hover:not(.ui-radio--disabled) .ui-radio__label {
  color: var(--text-action-hover);
}
</style>
