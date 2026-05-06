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
          :stroke="2"
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

type Variant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "text"
  | "ai"
  | "accent"
  | "danger"
  | "outline"  // compat → secondary
  | "ghost"    // compat → text
  | "error"    // compat → danger
  | "third";   // compat → tertiary
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

const normalizedVariant = computed(() => {
  const map: Record<string, string> = {
    outline: "secondary",
    ghost: "text",
    third: "tertiary",
    error: "danger",
  };
  return map[props.variant] || props.variant;
});

const isFlat = computed(() => normalizedVariant.value === "text");

const isIconOnly = computed(() => props.icon && !props.label);

const buttonClasses = computed(() => [
  `ui-button--${normalizedVariant.value}`,
  `ui-button--${props.size}`,
  { "ui-button--icon-only": isIconOnly.value },
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
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
  overflow: hidden;
}

.ui-button__content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.ui-button {
  transition: all 0.2s ease;
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

/* Icon-only buttons should be square */
.ui-button--icon-only {
  aspect-ratio: 1;
  padding: 0 !important;
  justify-content: center;
}

.ui-button--icon-only.ui-button--sm {
  width: 28px;
  min-width: 28px;
}

.ui-button--icon-only.ui-button--md {
  width: 36px;
  min-width: 36px;
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
  opacity: var(--opacity-disabled);
  pointer-events: none;
}

/* SECONDARY — fond neutre gris, sans bordure (Figma Secondary) */
.ui-button--secondary {
  background-color: var(--surface-neutral) !important;
  color: var(--text-body) !important;
  border: none;
}

.ui-button--secondary:hover:not(:disabled):not(.disabled) {
  background-color: var(--surface-neutral-hover) !important;
}

.ui-button--secondary:focus-visible {
  outline: var(--alias-border-width-md) solid var(--border-focus);
  outline-offset: 1px;
}

.ui-button--secondary:disabled,
.ui-button--secondary.disabled {
  opacity: var(--opacity-disabled);
  pointer-events: none;
}

/* TEXT — transparent, texte action (Figma Text) */
.ui-button--text {
  background-color: transparent !important;
  color: var(--text-action) !important;
  border: none;
}

.ui-button--text:hover:not(:disabled):not(.disabled) {
  color: var(--text-action-hover) !important;
  background-color: var(--surface-light-action) !important;
}

.ui-button--text:focus-visible {
  outline: var(--alias-border-width-md) solid var(--border-focus);
  outline-offset: -2px;
}

.ui-button--text:disabled,
.ui-button--text.disabled {
  opacity: var(--opacity-disabled);
  pointer-events: none;
}

/* DANGER — fond rouge clair, texte danger (Figma Danger) */
.ui-button--danger {
  background-color: var(--surface-danger) !important;
  color: var(--text-danger) !important;
  border: none;
}

.ui-button--danger:hover:not(:disabled):not(.disabled) {
  background-color: var(--surface-danger-hover) !important;
}

.ui-button--danger:focus-visible {
  outline: var(--alias-border-width-md) solid var(--border-danger);
  outline-offset: -2px;
}

.ui-button--danger:disabled,
.ui-button--danger.disabled {
  opacity: var(--opacity-disabled);
  pointer-events: none;
}

/* ACCENT (orange) */
.ui-button--accent {
  background-color: var(--surface-accent) !important;
  color: var(--text-on-action) !important;
  border: var(--alias-border-width-sm) solid var(--border-action-accent);
}

.ui-button--accent:hover:not(:disabled):not(.disabled) {
  background-color: var(--surface-accent-hover) !important;
  border-color: var(--border-action-accent-hover);
}

.ui-button--accent:focus-visible {
  outline: var(--alias-border-width-md) solid var(--border-action-accent);
  outline-offset: 1px;
}

.ui-button--accent:disabled,
.ui-button--accent.disabled {
  opacity: var(--opacity-disabled);
  pointer-events: none;
}

/* TERTIARY — fond bleu clair, texte action (Figma Tertiary) */
.ui-button--tertiary {
  background-color: var(--surface-light-action) !important;
  color: var(--text-action) !important;
  border: none;
}

.ui-button--tertiary:hover:not(:disabled):not(.disabled) {
  background-color: var(--surface-light-action-hover) !important;
}

.ui-button--tertiary:focus-visible {
  outline: var(--alias-border-width-md) solid var(--border-focus);
  outline-offset: 1px;
}

.ui-button--tertiary:disabled,
.ui-button--tertiary.disabled {
  opacity: var(--opacity-disabled);
  pointer-events: none;
}

/* AI — gradient 5 stops (Figma AI) */
.ui-button--ai {
  background: linear-gradient(
    90deg,
    var(--ai-0) 0%,
    var(--ai-25) 25%,
    var(--ai-50) 50%,
    var(--ai-75) 75%,
    var(--ai-100) 100%
  ) !important;
  color: var(--text-on-action) !important;
  border: none;
}


.ui-button--ai:focus-visible {
  outline: var(--alias-border-width-md) solid var(--border-action-ai);
  outline-offset: 1px;
}

.ui-button--ai:disabled,
.ui-button--ai.disabled {
  opacity: var(--opacity-disabled);
  pointer-events: none;
}

/* ======================== */
/* QUASAR OVERRIDES         */
/* ======================== */

/* Remove Quasar's default focus ring */
.ui-button:deep(.q-focus-helper) {
  display: none;
}

/* Secondary ripple - very light */
.ui-button--secondary:deep(.q-ripple) {
  background: rgba(61, 100, 237, 0.04) !important;
}

/* Loading state */
.ui-button :deep(.q-spinner) {
  color: currentColor;
}
</style>
