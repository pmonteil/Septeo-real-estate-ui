<template>
  <div class="ui-input-suffix" :class="rootClasses">
    <!-- Label -->
    <UiLabel
      v-if="props.label"
      :label="props.label"
      :icon="props.labelIcon"
      :required="props.labelRequired"
      :tooltip="props.labelTooltip"
      class="ui-input-suffix__label"
    />

    <!-- Field -->
    <div class="ui-input-suffix__field" :class="fieldClasses">
      <!-- Content wrapper (icon-left + input) for bounce animation -->
      <div class="ui-input-suffix__content">
        <!-- Icon Left -->
        <component
          v-if="iconLeftComponent"
          :is="iconLeftComponent"
          class="ui-input-suffix__icon ui-input-suffix__icon--left"
          :size="18"
          :stroke="2"
        />

        <!-- Native Input -->
        <input
          ref="inputRef"
          type="number"
          class="ui-input-suffix__native"
          :class="{ 'ui-input-suffix__native--filled': isFilled }"
          :value="modelValue"
          :placeholder="props.placeholder"
          :disabled="props.disabled"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
        />
      </div>

      <!-- Icon Error (before suffix) -->
      <div
        v-if="props.error && iconErrorComponent"
        class="ui-input-suffix__error-icon-wrapper"
      >
        <component
          :is="iconErrorComponent"
          class="ui-input-suffix__icon ui-input-suffix__icon--error"
          :size="18"
          :stroke="2"
        />
        <q-tooltip
          v-if="props.errorMessage"
          class="ui-input-suffix__tooltip"
          anchor="top middle"
          self="bottom middle"
          :offset="[0, 8]"
        >
          {{ props.errorMessage }}
        </q-tooltip>
      </div>

      <!-- Suffix -->
      <div class="ui-input-suffix__suffix" :class="suffixClasses">
        <span class="ui-input-suffix__suffix-text">{{ props.suffix }}</span>
      </div>
    </div>

    <!-- Hint Text -->
    <p v-if="props.hintText" class="ui-input-suffix__hint">
      {{ props.hintText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  defineAsyncComponent,
  type Component,
  type FunctionalComponent,
} from "vue";
import UiLabel from "./UiLabel.vue";

type IconProp = string | Component | FunctionalComponent;

const props = withDefaults(
  defineProps<{
    modelValue?: string | number;
    label?: string;
    labelIcon?: IconProp;
    labelRequired?: boolean;
    labelTooltip?: string;
    placeholder?: string;
    suffix?: string;
    disabled?: boolean;
    error?: boolean;
    errorMessage?: string;
    hintText?: string;
    iconLeft?: IconProp;
  }>(),
  {
    modelValue: "",
    placeholder: "",
    suffix: "m²",
    disabled: false,
    error: false,
    labelRequired: false,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const isFocused = ref(false);

// Check if input has value
const isFilled = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) return false;
  return String(props.modelValue).length > 0;
});

// Root classes
const rootClasses = computed(() => ({
  "ui-input-suffix--disabled": props.disabled,
  "ui-input-suffix--error": props.error,
  "ui-input-suffix--focused": isFocused.value,
  "ui-input-suffix--filled": isFilled.value,
}));

// Field classes
const fieldClasses = computed(() => ({
  "ui-input-suffix__field--disabled": props.disabled,
  "ui-input-suffix__field--error": props.error,
  "ui-input-suffix__field--focused": isFocused.value,
}));

// Suffix classes
const suffixClasses = computed(() => ({
  "ui-input-suffix__suffix--error": props.error,
}));

// Convert icon name to component name
function toIconName(name: string): string {
  return (
    "Icon" +
    name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")
  );
}

// Resolve icon component
function resolveIcon(icon: IconProp | undefined) {
  if (!icon) return null;

  if (typeof icon !== "string") {
    return icon;
  }

  const iconName = toIconName(icon);
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((module) => {
      const icons = module as unknown as Record<string, Component>;
      const iconComp = icons[iconName];
      if (!iconComp) {
        console.warn(
          `[UiInputSuffix] Icon "${iconName}" not found in @tabler/icons-vue`
        );
        return { render: () => null };
      }
      return iconComp;
    })
  );
}

const iconLeftComponent = computed(() => resolveIcon(props.iconLeft));
const iconErrorComponent = computed(() => resolveIcon("exclamation-circle"));

// Event handlers
function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}

function onFocus(event: FocusEvent) {
  isFocused.value = true;
  emit("focus", event);
}

function onBlur(event: FocusEvent) {
  isFocused.value = false;
  emit("blur", event);
}

// Expose focus method
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
});
</script>

<style scoped>
.ui-input-suffix {
  display: flex;
  flex-direction: column;
  gap: var(--brand-scale-2);
  width: 100%;
}

.ui-input-suffix__label {
  margin-bottom: calc(var(--gap-field-label) - var(--brand-scale-2));
}

/* ==========================================
 * FIELD
 * ========================================== */

.ui-input-suffix__field {
  display: flex;
  align-items: center;
  position: relative;
  background-color: var(--surface-field);
  border: var(--alias-border-width-sm) solid var(--border-default);
  border-radius: var(--field-border-radius);
  transition: all 0.2s ease;
  cursor: text;
}

/* Content wrapper for icon-left + input */
.ui-input-suffix__content {
  display: flex;
  align-items: center;
  gap: var(--gap-field-label);
  flex: 1;
  min-width: 0;
  padding: var(--field-padding-y) var(--field-padding-x);
  padding-right: calc(36px + var(--field-padding-x));
}

/* Adjust padding when error icon is present */
.ui-input-suffix__field--error .ui-input-suffix__content {
  padding-right: calc(36px + 18px + var(--gap-field-label) + var(--field-padding-x));
}

/* Hover state - default */
.ui-input-suffix__field:hover:not(.ui-input-suffix__field--disabled):not(.ui-input-suffix__field--focused):not(.ui-input-suffix__field--error) {
  background-color: var(--surface-default);
}

.ui-input-suffix__field:hover:not(.ui-input-suffix__field--disabled):not(.ui-input-suffix__field--focused):not(.ui-input-suffix__field--error) .ui-input-suffix__icon--left {
  animation: soft-bounce-icon 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ui-input-suffix__field:hover:not(.ui-input-suffix__field--disabled):not(.ui-input-suffix__field--focused):not(.ui-input-suffix__field--error) .ui-input-suffix__native {
  color: var(--text-action-hover);
}

.ui-input-suffix__field:hover:not(.ui-input-suffix__field--disabled):not(.ui-input-suffix__field--focused):not(.ui-input-suffix__field--error) .ui-input-suffix__native::placeholder {
  color: var(--text-action-hover);
}

/* Hover state - error (keep error colors, animate icon only) */
.ui-input-suffix__field--error:hover:not(.ui-input-suffix__field--disabled):not(.ui-input-suffix__field--focused) .ui-input-suffix__icon--left {
  animation: soft-bounce-icon 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes soft-bounce-icon {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(0);
  }
}

/* Focus state */
.ui-input-suffix__field--focused {
  background-color: var(--surface-field);
  border-color: var(--border-action);
}

/* Error state */
.ui-input-suffix__field--error {
  border-color: var(--border-error);
}

/* Disabled state */
.ui-input-suffix__field--disabled {
  background-color: var(--surface-disable);
  border-color: var(--border-disabled);
  cursor: not-allowed;
}

/* ==========================================
 * NATIVE INPUT
 * ========================================== */

.ui-input-suffix__native {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--body-line-height);
  color: var(--text-placeholder);
  /* Hide number input spinners */
  -moz-appearance: textfield;
}

.ui-input-suffix__native::-webkit-outer-spin-button,
.ui-input-suffix__native::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.ui-input-suffix__native::placeholder {
  color: var(--text-placeholder);
}

/* Filled state */
.ui-input-suffix__native--filled {
  font-weight: var(--font-weight-medium);
  color: var(--text-body);
}

/* Error text color */
.ui-input-suffix__field--error .ui-input-suffix__native,
.ui-input-suffix__field--error .ui-input-suffix__native::placeholder {
  color: var(--text-error);
}

/* Disabled state */
.ui-input-suffix__field--disabled .ui-input-suffix__native {
  color: var(--text-disable);
  cursor: not-allowed;
}

.ui-input-suffix__field--disabled .ui-input-suffix__native::placeholder {
  color: var(--text-disable);
}

/* ==========================================
 * ICONS
 * ========================================== */

.ui-input-suffix__icon {
  flex-shrink: 0;
  color: var(--icon-default);
}

.ui-input-suffix__error-icon-wrapper {
  position: absolute;
  right: calc(36px + var(--gap-field-label));
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ui-input-suffix__icon--error {
  color: var(--icon-error);
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ui-input-suffix__error-icon-wrapper:hover .ui-input-suffix__icon--error {
  animation: soft-bounce-error 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes soft-bounce-error {
  0% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-2px) scale(1.05);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}

/* Error state - left icon becomes error color */
.ui-input-suffix__field--error .ui-input-suffix__icon--left {
  color: var(--icon-error);
}

.ui-input-suffix__field--disabled .ui-input-suffix__icon {
  color: var(--icon-disable);
}

/* Tooltip styling */
.ui-input-suffix__tooltip {
  font-family: var(--font-family-body);
  font-size: var(--body-small-font-size);
  background-color: var(--alias-neutral-900);
  color: var(--alias-neutral-white);
  padding: 6px 10px;
  border-radius: var(--alias-border-radius-sm);
}

/* ==========================================
 * SUFFIX
 * ========================================== */

.ui-input-suffix__suffix {
  position: absolute;
  right: 3px;
  top: 3px;
  bottom: 3px;
  width: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-left: var(--alias-border-width-sm) solid var(--border-default);
}

.ui-input-suffix__suffix--error {
  border-left-color: var(--border-error);
}

.ui-input-suffix__suffix-text {
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--body-line-height);
  color: var(--text-body-secondary);
  text-align: center;
}

/* ==========================================
 * HINT TEXT
 * ========================================== */

.ui-input-suffix__hint {
  margin: 0;
  font-family: var(--font-family-body);
  font-size: var(--caption-font-size);
  line-height: var(--body-line-height);
  color: var(--text-body-secondary);
}
</style>

