<template>
  <div class="ui-search-bar" :class="rootClasses">
    <UiLabel
      v-if="props.hasLabel && props.label"
      :label="props.label"
      class="ui-search-bar__label"
    />

    <div class="ui-search-bar__field" :class="fieldClasses">
      <component
        :is="searchIcon"
        class="ui-search-bar__icon ui-search-bar__icon--search"
        :size="iconSize"
        :stroke="2"
      />

      <input
        ref="inputRef"
        type="text"
        class="ui-search-bar__native"
        :class="{ 'ui-search-bar__native--filled': isFilled }"
        :value="modelValue"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />

      <button
        v-if="isFilled && !props.disabled"
        class="ui-search-bar__clear"
        type="button"
        @click="onClear"
      >
        <component :is="clearIcon" :size="iconSize" :stroke="2" />
      </button>
    </div>

    <p v-if="props.hintText" class="ui-search-bar__hint">
      {{ props.hintText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, type Component } from "vue";
import UiLabel from "./UiLabel.vue";

type Size = "default" | "xs";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    size?: Size;
    label?: string;
    hasLabel?: boolean;
    hintText?: string;
  }>(),
  {
    modelValue: "",
    placeholder: "Rechercher...",
    disabled: false,
    error: false,
    size: "default",
    hasLabel: false,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
  (e: "clear"): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const isFocused = ref(false);
const isFilled = computed(
  () => !!props.modelValue && props.modelValue.length > 0
);

const iconSize = computed(() => (props.size === "xs" ? 14 : 18));

function toIconName(name: string): string {
  return (
    "Icon" +
    name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")
  );
}

function resolveIcon(name: string) {
  const iconName = toIconName(name);
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((module) => {
      const icons = module as unknown as Record<string, Component>;
      return icons[iconName] || { render: () => null };
    })
  );
}

const searchIcon = resolveIcon("search");
const clearIcon = resolveIcon("x");

const rootClasses = computed(() => [
  `ui-search-bar--${props.size}`,
  {
    "ui-search-bar--disabled": props.disabled,
    "ui-search-bar--error": props.error,
    "ui-search-bar--focused": isFocused.value,
  },
]);

const fieldClasses = computed(() => ({
  "ui-search-bar__field--disabled": props.disabled,
  "ui-search-bar__field--error": props.error,
  "ui-search-bar__field--focused": isFocused.value,
}));

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

function onClear() {
  emit("update:modelValue", "");
  emit("clear");
  inputRef.value?.focus();
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
});
</script>

<style scoped>
.ui-search-bar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  width: 100%;
}

.ui-search-bar__field {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background-color: var(--surface-field);
  border: var(--alias-border-width-sm) solid var(--border-default);
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
  cursor: text;
}

.ui-search-bar--default .ui-search-bar__field {
  padding: var(--spacing-md) var(--spacing-lg);
  min-height: 36px;
}

.ui-search-bar--xs .ui-search-bar__field {
  padding: var(--spacing-sm) var(--spacing-md);
  min-height: 28px;
}

.ui-search-bar__field:hover:not(.ui-search-bar__field--disabled):not(.ui-search-bar__field--focused):not(.ui-search-bar__field--error) {
  background-color: var(--surface-default);
}

.ui-search-bar__field--focused {
  background-color: var(--surface-field);
  border-color: var(--border-action);
}

.ui-search-bar__field--error {
  border-color: var(--border-danger);
}

.ui-search-bar__field--disabled {
  opacity: var(--opacity-disabled);
  pointer-events: none;
  cursor: not-allowed;
}

.ui-search-bar__native {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-regular);
  color: var(--text-placeholder);
}

.ui-search-bar--default .ui-search-bar__native {
  font-size: var(--body-font-size);
  line-height: var(--body-line-height);
}

.ui-search-bar--xs .ui-search-bar__native {
  font-size: var(--body-small-font-size);
  line-height: var(--body-small-line-height);
}

.ui-search-bar__native::placeholder {
  color: var(--text-placeholder);
}

.ui-search-bar__native--filled {
  font-weight: var(--font-weight-medium);
  color: var(--text-body);
}

.ui-search-bar__icon {
  flex-shrink: 0;
  color: var(--icon-secondary);
}

.ui-search-bar__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  color: var(--icon-secondary);
  transition: color 0.15s ease;
}

.ui-search-bar__clear:hover {
  color: var(--icon-default);
}

.ui-search-bar__hint {
  margin: 0;
  font-family: var(--font-family-body);
  font-size: var(--caption-font-size);
  line-height: var(--caption-line-height);
  color: var(--text-body-secondary);
}
</style>
