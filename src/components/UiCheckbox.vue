<template>
  <label
    class="ui-checkbox"
    :class="rootClasses"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Native checkbox (masqué) -->
    <input
      ref="inputRef"
      type="checkbox"
      class="ui-checkbox__native"
      :checked="modelValue"
      :indeterminate="indeterminate"
      :disabled="disabled"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
    />

    <!-- Checkbox box -->
    <span class="ui-checkbox__box" :class="boxClasses">
      <!-- Indeterminate icon (minus) -->
      <svg
        v-if="indeterminate && !modelValue"
        class="ui-checkbox__icon"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.91675 7H11.0834"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <!-- Check icon -->
      <svg
        v-else-if="modelValue"
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

    <!-- Icône contextuelle (Style=LabelIcon) -->
    <component
      v-if="iconComponent"
      :is="iconComponent"
      class="ui-checkbox__context-icon"
      :size="18"
      :stroke="2"
    />

    <!-- Label -->
    <span v-if="label" class="ui-checkbox__label">{{ label }}</span>

    <!-- Slot pour contenu custom -->
    <slot />
  </label>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  defineAsyncComponent,
  type Component,
  type FunctionalComponent,
} from "vue";

type IconProp = string | Component | FunctionalComponent;

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    label?: string;
    icon?: IconProp;
    disabled?: boolean;
    indeterminate?: boolean;
  }>(),
  {
    modelValue: false,
    disabled: false,
    indeterminate: false,
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
const isHovered = ref(false);

const isActive = computed(() => props.modelValue || props.indeterminate);

function toIconName(name: string): string {
  return (
    "Icon" +
    name
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join("")
  );
}

const iconComponent = computed(() => {
  if (!props.icon) return null;
  if (typeof props.icon !== "string") return props.icon;
  const iconName = toIconName(props.icon);
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((module) => {
      const icons = module as unknown as Record<string, Component>;
      const icon = icons[iconName];
      if (!icon) {
        console.warn(`[UiCheckbox] Icon "${iconName}" not found in @tabler/icons-vue`);
        return { render: () => null };
      }
      return icon;
    })
  );
});

const rootClasses = computed(() => ({
  "ui-checkbox--active": isActive.value,
  "ui-checkbox--hover": isHovered.value && !props.disabled,
  "ui-checkbox--focused": isFocused.value,
  "ui-checkbox--disabled": props.disabled,
}));

const boxClasses = computed(() => ({
  "ui-checkbox__box--active": isActive.value,
}));

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
/* ==========================================
 * BASE
 * ========================================== */

.ui-checkbox {
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

/* Active (selected / indeterminate) — fond bleu clair */
.ui-checkbox--active {
  background-color: var(--surface-light-action);
}

/* Hover unselected — fond neutre gris */
.ui-checkbox:hover:not(.ui-checkbox--disabled):not(.ui-checkbox--active) {
  background-color: var(--surface-neutral);
}

/* Hover active — fond identique (pas de changement card) */
.ui-checkbox--active:hover:not(.ui-checkbox--disabled) {
  background-color: var(--surface-light-action);
}

/* Focus — bordure bleue sur la card */
.ui-checkbox--focused {
  border-color: var(--border-action);
}

/* Disabled */
.ui-checkbox--disabled {
  opacity: var(--opacity-disabled);
  pointer-events: none;
  cursor: not-allowed;
}

/* Native input masqué */
.ui-checkbox__native {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
}

/* ==========================================
 * CHECKBOX BOX (18×18px)
 * ========================================== */

.ui-checkbox__box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--sizing-icon-xs);    /* 18px */
  height: var(--sizing-icon-xs);   /* 18px */
  flex-shrink: 0;
  background-color: var(--surface-field);
  border: var(--alias-border-width-sm) solid var(--border-action-neutral);
  border-radius: var(--radius-sm);  /* 4px */
  transition: all 0.15s ease;
}

/* Hover unselected box — bordure action */
.ui-checkbox:hover:not(.ui-checkbox--disabled) .ui-checkbox__box:not(.ui-checkbox__box--active) {
  border-color: var(--border-action);
}

/* Active box — fond bleu solide */
.ui-checkbox__box--active {
  background-color: var(--surface-action);
  border-color: var(--surface-action);
}

/* Hover active box */
.ui-checkbox:hover:not(.ui-checkbox--disabled) .ui-checkbox__box--active {
  background-color: var(--surface-action-hover);
  border-color: var(--surface-action-hover);
}

/* ==========================================
 * CHECK / INDETERMINATE ICON (14px)
 * ========================================== */

.ui-checkbox__icon {
  width: var(--sizing-icon-xxs);   /* 14px */
  height: var(--sizing-icon-xxs);  /* 14px */
  color: var(--icon-on-action);
  flex-shrink: 0;
}

/* ==========================================
 * CONTEXT ICON (LabelIcon style — 18px)
 * ========================================== */

.ui-checkbox__context-icon {
  flex-shrink: 0;
  color: var(--icon-action);
  transition: color 0.15s ease;
}

.ui-checkbox--active .ui-checkbox__context-icon {
  color: var(--icon-action);
}

.ui-checkbox--active:hover:not(.ui-checkbox--disabled) .ui-checkbox__context-icon {
  color: var(--icon-action-hover);
}

/* ==========================================
 * LABEL
 * ========================================== */

.ui-checkbox__label {
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-line-height);
  color: var(--text-body-secondary);
  transition: color 0.15s ease;
}

/* Active — label bleu */
.ui-checkbox--active .ui-checkbox__label {
  color: var(--text-action);
}

/* Hover active — label bleu hover */
.ui-checkbox--active:hover:not(.ui-checkbox--disabled) .ui-checkbox__label {
  color: var(--text-action-hover);
}
</style>
