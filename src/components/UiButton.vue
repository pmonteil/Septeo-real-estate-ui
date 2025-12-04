<template>
  <q-btn
    class="ui-button"
    :class="buttonClasses"
    :loading="props.loading"
    :disable="props.disabled"
    :flat="isFlat"
    :outline="false"
    :unelevated="true"
    no-caps
    @click="handleClick"
  >
    <span class="ui-button__content">
      <slot name="icon">
        <component
          v-if="iconComponent"
          :is="iconComponent"
          class="ui-button__icon"
          :size="iconSize"
          :stroke="1.5"
        />
      </slot>
      <span v-if="props.label" class="ui-button__label">{{ props.label }}</span>
    </span>
  </q-btn>
</template>

<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  type Component,
  type FunctionalComponent,
} from "vue";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";
type IconProp = string | Component | FunctionalComponent;

const props = withDefaults(
  defineProps<{
    label?: string;
    icon?: IconProp;
    loading?: boolean;
    disabled?: boolean;
    variant?: Variant;
    size?: Size;
  }>(),
  {
    variant: "primary",
    size: "md",
  }
);

const emit = defineEmits<{
  (e: "click", evt: Event): void;
}>();

// Convertit "mail" en "IconMail", "arrow-left" en "IconArrowLeft"
function toIconName(name: string): string {
  return (
    "Icon" +
    name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")
  );
}

// Résout l'icône : soit un composant passé directement, soit un string à charger
const iconComponent = computed(() => {
  if (!props.icon) return null;

  // Si c'est déjà un composant, le retourner directement
  if (typeof props.icon !== "string") {
    return props.icon;
  }

  // Sinon, charger dynamiquement depuis @tabler/icons-vue
  const iconName = toIconName(props.icon);
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((module) => {
      // Double cast pour satisfaire TypeScript
      const icons = module as unknown as Record<string, Component>;
      const icon = icons[iconName];
      if (!icon) {
        console.warn(
          `[UiButton] Icon "${iconName}" not found in @tabler/icons-vue`
        );
        return { render: () => null };
      }
      return icon;
    })
  );
});

const isFlat = computed(() => props.variant === "ghost");

const buttonClasses = computed(() => [
  `ui-button--${props.variant}`,
  `ui-button--${props.size}`,
]);

const iconSize = computed(() => (props.size === "sm" ? 14 : 20));

function handleClick(event: Event) {
  emit("click", event);
}
</script>

<style scoped>
/* Base styles - utilise les design tokens */
.ui-button {
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-semi-bold);
  line-height: var(--body-line-height);
  letter-spacing: 0;
  border-radius: var(--alias-border-radius-lg);
  transition: all 0.2s ease;
}

.ui-button__content {
  display: flex;
  align-items: center;
  gap: var(--gap-icon-text);
}

.ui-button__icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ui-button__label {
  white-space: nowrap;
}

/* ======================== */
/* SIZES                    */
/* ======================== */

/* SM (XS dans Figma) */
.ui-button--sm {
  padding: var(--button-xs-padding-y) var(--button-xs-padding-x);
  border-radius: var(--button-xs-border-radius);
  min-height: 28px;
}

.ui-button--sm .ui-button__icon {
  width: var(--button-xs-icon-size);
  height: var(--button-xs-icon-size);
}

/* MD (Default dans Figma) */
.ui-button--md {
  padding: var(--button-default-padding-y) var(--button-default-padding-x);
  border-radius: var(--button-default-border-radius);
  min-height: 36px;
}

.ui-button--md .ui-button__icon {
  width: var(--button-default-icon-size);
  height: var(--button-default-icon-size);
}

/* ======================== */
/* VARIANTS                 */
/* ======================== */

/* PRIMARY (default dans Figma) */
.ui-button--primary {
  background-color: var(--surface-action) !important;
  color: var(--text-on-action) !important;
  border: var(--alias-border-width-sm) solid var(--border-action);
}

.ui-button--primary:hover:not(:disabled):not(.disabled) {
  background-color: var(--surface-action-hover) !important;
  border-color: var(--border-action-hover);
}

.ui-button--primary:focus-visible {
  outline: var(--alias-border-width-md) solid var(--border-focus);
  outline-offset: 1px;
}

.ui-button--primary:disabled,
.ui-button--primary.disabled {
  background-color: var(--surface-disable) !important;
  color: var(--text-disable) !important;
  border-color: var(--border-disabled);
}

/* SECONDARY (outline dans Figma) */
.ui-button--secondary {
  background-color: var(--surface-default) !important;
  color: var(--text-body) !important;
  border: var(--alias-border-width-sm) solid var(--border-action-neutral);
}

.ui-button--secondary:hover:not(:disabled):not(.disabled) {
  border-color: var(--border-action-hover);
}

.ui-button--secondary:focus-visible {
  outline: var(--alias-border-width-md) solid var(--border-focus);
  outline-offset: 1px;
  border-color: var(--border-action);
}

.ui-button--secondary:disabled,
.ui-button--secondary.disabled {
  background-color: var(--surface-disable) !important;
  color: var(--text-disable) !important;
  border-color: var(--border-disabled);
}

/* GHOST (transparent dans Figma) */
.ui-button--ghost {
  background-color: transparent !important;
  color: var(--text-action) !important;
  border: none;
}

.ui-button--ghost:hover:not(:disabled):not(.disabled) {
  color: var(--text-action-hover) !important;
  background-color: var(--surface-light-action) !important;
}

.ui-button--ghost:focus-visible {
  outline: var(--alias-border-width-md) solid var(--border-focus);
  outline-offset: -2px;
}

.ui-button--ghost:disabled,
.ui-button--ghost.disabled {
  background-color: var(--surface-disable) !important;
  color: var(--text-disable) !important;
}

/* DANGER (Error dans Figma) */
.ui-button--danger {
  background-color: var(--surface-error) !important;
  color: var(--text-error) !important;
  border: none;
}

.ui-button--danger:hover:not(:disabled):not(.disabled) {
  background-color: var(--surface-error-hover) !important;
}

.ui-button--danger:focus-visible {
  outline: var(--alias-border-width-md) solid var(--border-error);
  outline-offset: -2px;
}

.ui-button--danger:disabled,
.ui-button--danger.disabled {
  background-color: var(--surface-disable) !important;
  color: var(--text-disable) !important;
}

/* ======================== */
/* QUASAR OVERRIDES         */
/* ======================== */

/* Remove Quasar's default focus ring */
.ui-button:deep(.q-focus-helper) {
  display: none;
}

/* Loading state */
.ui-button :deep(.q-spinner) {
  color: currentColor;
}
</style>
