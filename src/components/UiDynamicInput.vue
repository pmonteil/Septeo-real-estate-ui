<template>
  <div class="ui-dynamic-input" :class="rootClasses">
    <!-- Label -->
    <UiLabel
      v-if="props.label"
      :label="props.label"
      :icon="props.labelIcon"
      :required="props.labelRequired"
      :tooltip="props.labelTooltip"
      class="ui-dynamic-input__label"
    />

    <!-- Field -->
    <div class="ui-dynamic-input__field" :class="fieldClasses" @click="focusInput">
      <!-- Tags + native input -->
      <div class="ui-dynamic-input__content">
        <!-- Tags -->
        <span
          v-for="(tag, index) in props.modelValue"
          :key="index"
          class="ui-dynamic-input__tag"
        >
          <span class="ui-dynamic-input__tag-text">{{ tag }}</span>
          <button
            v-if="!props.disabled"
            class="ui-dynamic-input__tag-remove"
            type="button"
            @click.stop="removeTag(index)"
          >
            <component
              v-if="iconXComponent"
              :is="iconXComponent"
              :size="10"
              :stroke="2.5"
            />
          </button>
        </span>

        <!-- Inline text input -->
        <input
          v-if="!props.disabled"
          ref="inputRef"
          v-model="inputValue"
          class="ui-dynamic-input__native"
          type="text"
          :placeholder="props.modelValue.length === 0 ? props.placeholder : ''"
          @keydown="onKeydown"
          @focus="isFocused = true"
          @blur="onBlur"
        />
      </div>

      <!-- Suffix { } -->
      <button
        class="ui-dynamic-input__suffix"
        :class="suffixClasses"
        type="button"
        :disabled="props.disabled"
        @click.stop="$emit('suffix-click')"
      >
        <component
          v-if="iconBracesComponent"
          :is="iconBracesComponent"
          :size="14"
          :stroke="2"
        />
      </button>
    </div>

    <!-- Hint text -->
    <p v-if="props.hintText" class="ui-dynamic-input__hint">{{ props.hintText }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, type Component, type FunctionalComponent } from "vue";
import UiLabel from "./UiLabel.vue";

type IconProp = string | Component | FunctionalComponent;

const props = withDefaults(
  defineProps<{
    modelValue: string[];
    label?: string;
    labelIcon?: IconProp;
    labelRequired?: boolean;
    labelTooltip?: string;
    placeholder?: string;
    hintText?: string;
    error?: boolean;
    errorMessage?: string;
    disabled?: boolean;
  }>(),
  {
    modelValue: () => [],
    placeholder: "Ajouter une valeur…",
    error: false,
    disabled: false,
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string[]];
  "suffix-click": [];
  add: [tag: string];
  remove: [tag: string, index: number];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const inputValue = ref("");
const isFocused = ref(false);

// ─── Icon helpers ─────────────────────────────────────────────────────────────

function toIconName(name: string): string {
  return name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

function resolveIcon(icon: IconProp | undefined) {
  if (!icon) return null;
  if (typeof icon === "string") {
    const pascalName = `Icon${toIconName(icon)}`;
    return defineAsyncComponent(() =>
      import("@tabler/icons-vue").then((mod) => {
        const c = (mod as Record<string, Component>)[pascalName];
        if (!c) throw new Error(`Icon ${pascalName} not found`);
        return c;
      })
    );
  }
  return icon;
}

const iconXComponent = computed(() => resolveIcon("x"));
const iconBracesComponent = computed(() => resolveIcon("braces"));

// ─── State classes ─────────────────────────────────────────────────────────────

const rootClasses = computed(() => ({
  "ui-dynamic-input--error": props.error,
  "ui-dynamic-input--disabled": props.disabled,
}));

const fieldClasses = computed(() => ({
  "ui-dynamic-input__field--focused": isFocused.value,
  "ui-dynamic-input__field--error": props.error,
  "ui-dynamic-input__field--disabled": props.disabled,
}));

const suffixClasses = computed(() => ({
  "ui-dynamic-input__suffix--focused": isFocused.value && !props.error,
  "ui-dynamic-input__suffix--error": props.error,
  "ui-dynamic-input__suffix--disabled": props.disabled,
}));

// ─── Methods ──────────────────────────────────────────────────────────────────

function focusInput() {
  inputRef.value?.focus();
}

function addTag() {
  const value = inputValue.value.trim();
  if (!value) return;
  const newTags = [...props.modelValue, value];
  emit("update:modelValue", newTags);
  emit("add", value);
  inputValue.value = "";
}

function removeTag(index: number) {
  const tag = props.modelValue[index];
  const newTags = props.modelValue.filter((_, i) => i !== index);
  emit("update:modelValue", newTags);
  emit("remove", tag, index);
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Enter") {
    event.preventDefault();
    addTag();
  } else if (
    event.key === "Backspace" &&
    inputValue.value === "" &&
    props.modelValue.length > 0
  ) {
    removeTag(props.modelValue.length - 1);
  }
}

function onBlur() {
  isFocused.value = false;
  if (inputValue.value.trim()) {
    addTag();
  }
}

defineExpose({ focusInput });
</script>

<style scoped>
/* ─── Root ────────────────────────────────────────────────────────────────────── */
.ui-dynamic-input {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--gap-field-label);
  width: 100%;
}

/* ─── Label ───────────────────────────────────────────────────────────────────── */
.ui-dynamic-input__label {
  width: 100%;
}

/* ─── Field ───────────────────────────────────────────────────────────────────── */
.ui-dynamic-input__field {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--gap-field-label);
  width: 100%;
  min-height: 36px;
  padding: var(--brand-scale-8) var(--brand-scale-12);
  padding-right: calc(36px + var(--brand-scale-12));
  background-color: var(--surface-field);
  border: var(--alias-border-width-sm) solid var(--border-default);
  border-radius: var(--field-border-radius);
  cursor: text;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
}

/* Hover: background becomes white, border stays default */
.ui-dynamic-input__field:hover:not(.ui-dynamic-input__field--disabled):not(.ui-dynamic-input__field--error):not(.ui-dynamic-input__field--focused) {
  background-color: var(--surface-default);
}

/* Focus: AI purple border (this component is AI-themed) */
.ui-dynamic-input__field--focused:not(.ui-dynamic-input__field--error) {
  border-color: var(--alias-ai-500);
}

.ui-dynamic-input__field--error {
  border-color: var(--border-error);
}

.ui-dynamic-input__field--disabled {
  background-color: var(--surface-disable);
  border-color: var(--border-disabled);
  cursor: not-allowed;
}

/* ─── Content (tags + input) ──────────────────────────────────────────────────── */
.ui-dynamic-input__content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  flex: 1 0 0;
  min-width: 0;
}

/* ─── Native input ────────────────────────────────────────────────────────────── */
.ui-dynamic-input__native {
  flex: 1 0 80px;
  min-width: 80px;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-family-body);
  font-size: var(--body-small-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--body-small-line-height);
  color: var(--text-body);
}

.ui-dynamic-input__native::placeholder {
  color: var(--text-placeholder);
}

.ui-dynamic-input--disabled .ui-dynamic-input__native {
  cursor: not-allowed;
}

/* ─── Tag (balise dynamique) ──────────────────────────────────────────────────── */
.ui-dynamic-input__tag {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 6px 4px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    var(--surface-ai-gradient-1) 0%,
    var(--surface-ai-gradient-2) 100%
  );
  cursor: default;
  flex-shrink: 0;
}

/* Disabled tag variant */
.ui-dynamic-input--disabled .ui-dynamic-input__tag {
  background: var(--surface-disable);
  border: var(--alias-border-width-sm) solid var(--border-default);
}

.ui-dynamic-input__tag-text {
  font-family: var(--font-family-body);
  font-size: 12px;
  font-weight: var(--font-weight-semi-bold);
  line-height: 10px;
  color: #fff;
  white-space: nowrap;
}

/* Disabled tag text */
.ui-dynamic-input--disabled .ui-dynamic-input__tag-text {
  color: var(--text-disable);
}

.ui-dynamic-input__tag-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 10px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #fff;
  opacity: 0.85;
  flex-shrink: 0;
  transition: opacity 0.1s ease;
}

.ui-dynamic-input__tag-remove:hover {
  opacity: 1;
}

/* Disabled tag remove button icon */
.ui-dynamic-input--disabled .ui-dynamic-input__tag-remove {
  color: var(--text-disable);
}

/* ─── Suffix { } ──────────────────────────────────────────────────────────────── */
.ui-dynamic-input__suffix {
  position: absolute;
  top: -1px;
  right: -1px;
  bottom: -1px;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-dynamic);
  border: var(--alias-border-width-sm) solid var(--border-dynamic);
  border-radius: 0 var(--field-border-radius) var(--field-border-radius) 0;
  color: var(--alias-ai-default);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.ui-dynamic-input__suffix:hover:not(:disabled) {
  background-color: var(--alias-ai-75);
  border-color: var(--alias-ai-200);
}

/* Focus: suffix border turns purple to match field */
.ui-dynamic-input__suffix--focused {
  border-color: var(--alias-ai-500);
}

.ui-dynamic-input__suffix--error {
  background-color: var(--surface-default);
  border-color: var(--border-error);
}

.ui-dynamic-input__suffix--disabled,
.ui-dynamic-input__suffix:disabled {
  background-color: var(--surface-disable);
  border-color: var(--border-disabled);
  color: var(--text-disable);
  cursor: not-allowed;
}

/* ─── Hint text ───────────────────────────────────────────────────────────────── */
.ui-dynamic-input__hint {
  margin: 0;
  font-family: var(--font-family-body);
  font-size: var(--caption-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--body-line-height);
  color: var(--text-body-secondary);
}
</style>
