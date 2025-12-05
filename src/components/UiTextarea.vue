<template>
  <div class="ui-textarea" :class="rootClasses">
    <!-- Label -->
    <UiLabel
      v-if="props.label"
      :label="props.label"
      :icon="props.labelIcon"
      :required="props.labelRequired"
      :tooltip="props.labelTooltip"
      class="ui-textarea__label"
    />

    <!-- Field -->
    <div class="ui-textarea__field" :class="fieldClasses">
      <!-- Native Textarea -->
      <textarea
        ref="textareaRef"
        class="ui-textarea__native"
        :class="{ 'ui-textarea__native--filled': isFilled }"
        :value="modelValue"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :rows="props.rows"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />

      <!-- Icon (error or info) - positioned absolute -->
      <div
        v-if="props.error && iconErrorComponent"
        class="ui-textarea__icon-wrapper"
      >
        <component
          :is="iconErrorComponent"
          class="ui-textarea__icon ui-textarea__icon--error"
          :size="18"
          :stroke="2"
        />
        <q-tooltip
          v-if="props.errorMessage"
          anchor="top middle"
          self="bottom middle"
          :offset="[0, 8]"
        >
          {{ props.errorMessage }}
        </q-tooltip>
      </div>
      <div
        v-else-if="iconInfoComponent"
        class="ui-textarea__icon-wrapper"
      >
        <component
          :is="iconInfoComponent"
          class="ui-textarea__icon ui-textarea__icon--info"
          :size="18"
          :stroke="2"
        />
        <q-tooltip
          v-if="props.infoMessage"
          anchor="top middle"
          self="bottom middle"
          :offset="[0, 8]"
        >
          {{ props.infoMessage }}
        </q-tooltip>
      </div>
    </div>

    <!-- Hint Text -->
    <p v-if="props.hintText" class="ui-textarea__hint" :class="{ 'ui-textarea__hint--error': props.error }">
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
    modelValue?: string;
    label?: string;
    labelIcon?: IconProp;
    labelRequired?: boolean;
    labelTooltip?: string;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    errorMessage?: string;
    infoMessage?: string;
    hintText?: string;
    rows?: number;
  }>(),
  {
    modelValue: "",
    placeholder: "",
    disabled: false,
    error: false,
    labelRequired: false,
    rows: 5,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const isFocused = ref(false);

// Check if textarea has value
const isFilled = computed(() => !!props.modelValue && props.modelValue.length > 0);

// Root classes
const rootClasses = computed(() => ({
  "ui-textarea--disabled": props.disabled,
  "ui-textarea--error": props.error,
  "ui-textarea--focused": isFocused.value,
  "ui-textarea--filled": isFilled.value,
}));

// Field classes
const fieldClasses = computed(() => ({
  "ui-textarea__field--disabled": props.disabled,
  "ui-textarea__field--error": props.error,
  "ui-textarea__field--focused": isFocused.value,
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
          `[UiTextarea] Icon "${iconName}" not found in @tabler/icons-vue`
        );
        return { render: () => null };
      }
      return iconComp;
    })
  );
}

const iconErrorComponent = computed(() => resolveIcon("exclamation-circle"));
const iconInfoComponent = computed(() => resolveIcon("info-circle"));

// Event handlers
function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement;
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
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur(),
});
</script>

<style scoped>
.ui-textarea {
  display: flex;
  flex-direction: column;
  gap: var(--brand-scale-2);
  width: 100%;
}

.ui-textarea__label {
  margin-bottom: calc(var(--gap-field-label) - var(--brand-scale-2));
}

/* ==========================================
 * FIELD
 * ========================================== */

.ui-textarea__field {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--gap-field-label);
  padding: var(--brand-scale-12);
  background-color: var(--surface-field);
  border: var(--alias-border-width-sm) solid var(--border-default);
  border-radius: var(--field-border-radius);
  transition: all 0.2s ease;
  min-height: 140px;
}

/* Hover state - default */
.ui-textarea__field:hover:not(.ui-textarea__field--disabled):not(.ui-textarea__field--focused):not(.ui-textarea__field--error) {
  background-color: var(--surface-default);
}

/* Focus state */
.ui-textarea__field--focused {
  background-color: var(--surface-field);
  border-color: var(--border-action);
}

/* Error state */
.ui-textarea__field--error {
  border-color: var(--border-error);
}

/* Disabled state */
.ui-textarea__field--disabled {
  background-color: var(--surface-disable);
  border-color: var(--border-disabled);
  cursor: not-allowed;
}

/* ==========================================
 * NATIVE TEXTAREA
 * ========================================== */

.ui-textarea__native {
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: 80px;
  border: none;
  background: transparent;
  outline: none;
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--body-line-height);
  color: var(--text-placeholder);
  resize: none;
  padding-right: 28px;
}

.ui-textarea__native::placeholder {
  color: var(--text-placeholder);
}

/* Filled state */
.ui-textarea__native--filled {
  font-weight: var(--font-weight-medium);
  color: var(--text-body);
}

/* Error text color */
.ui-textarea__field--error .ui-textarea__native,
.ui-textarea__field--error .ui-textarea__native::placeholder {
  color: var(--text-error);
}

/* Disabled state */
.ui-textarea__field--disabled .ui-textarea__native {
  color: var(--text-disable);
  cursor: not-allowed;
}

.ui-textarea__field--disabled .ui-textarea__native::placeholder {
  color: var(--text-disable);
}

/* ==========================================
 * ICONS
 * ========================================== */

.ui-textarea__icon {
  flex-shrink: 0;
}

.ui-textarea__icon--info {
  color: var(--icon-secondary);
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ui-textarea__icon-wrapper:hover .ui-textarea__icon--info {
  animation: soft-bounce-info 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes soft-bounce-info {
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

.ui-textarea__icon--error {
  color: var(--icon-error);
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ui-textarea__icon-wrapper {
  position: absolute;
  top: var(--brand-scale-12);
  right: var(--brand-scale-12);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ui-textarea__icon-wrapper:hover .ui-textarea__icon--error {
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

/* ==========================================
 * HINT TEXT
 * ========================================== */

.ui-textarea__hint {
  margin: 0;
  font-family: var(--font-family-body);
  font-size: var(--caption-font-size);
  line-height: var(--body-line-height);
  color: var(--text-body-secondary);
}

.ui-textarea__hint--error {
  color: var(--text-error);
}
</style>

