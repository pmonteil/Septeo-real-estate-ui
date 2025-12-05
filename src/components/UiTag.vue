<template>
  <button
    type="button"
    class="ui-tag"
    :class="rootClasses"
    :disabled="props.disabled"
    @click="onClick"
    @mouseleave="onMouseLeave"
  >
    <span class="ui-tag__label">{{ props.label }}</span>
    <component
      :is="iconComponent"
      class="ui-tag__icon"
      :size="14"
      :stroke="2"
    />
  </button>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, type Component } from "vue";

const props = withDefaults(
  defineProps<{
    label: string;
    selected?: boolean;
    disabled?: boolean;
  }>(),
  {
    selected: false,
    disabled: false,
  }
);

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
  (e: "toggle", selected: boolean): void;
}>();

// Prevent shake animation right after clicking (until mouse leaves and re-enters)
const canShake = ref(true);

// Root classes
const rootClasses = computed(() => ({
  "ui-tag--selected": props.selected,
  "ui-tag--disabled": props.disabled,
  "ui-tag--can-shake": canShake.value,
}));

// Convert icon name to PascalCase for @tabler/icons-vue
function toIconName(name: string): string {
  return (
    "Icon" +
    name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")
  );
}

// Icon component based on selected state
const iconComponent = computed(() => {
  const iconName = props.selected ? "x" : "plus";
  const componentName = toIconName(iconName);
  
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((module) => {
      const icons = module as unknown as Record<string, Component>;
      const iconComp = icons[componentName];
      if (!iconComp) {
        console.warn(
          `[UiTag] Icon "${componentName}" not found in @tabler/icons-vue`
        );
        return { render: () => null };
      }
      return iconComp;
    })
  );
});

function onClick(event: MouseEvent) {
  if (props.disabled) return;
  // Disable shake animation until mouse leaves
  canShake.value = false;
  emit("click", event);
  emit("toggle", !props.selected);
}

function onMouseLeave() {
  // Re-enable shake animation when mouse leaves
  canShake.value = true;
}
</script>

<style scoped>
.ui-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap-icon-text);
  padding: var(--brand-scale-4);
  border-radius: var(--alias-border-radius-md);
  background: transparent;
  cursor: pointer;
  font-family: var(--font-family-body);
  font-size: var(--body-small-font-size);
  line-height: var(--body-small-line-height);
  color: var(--text-body);
  transition: all 0.2s ease;
}

/* Unselected state - dashed border, regular font */
.ui-tag:not(.ui-tag--selected) {
  border: var(--alias-border-width-sm) dashed var(--border-action-neutral);
  font-weight: var(--font-weight-regular);
}

/* Selected state - solid border, medium font */
.ui-tag--selected {
  border: var(--alias-border-width-sm) solid var(--border-action);
  font-weight: var(--font-weight-medium);
}

/* Pop animation only on initial selection (when canShake is false = just clicked) */
.ui-tag--selected:not(.ui-tag--can-shake) {
  animation: tag-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes tag-pop {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Icon styling */
.ui-tag__icon {
  flex-shrink: 0;
  color: var(--alias-neutral-500);
  transition: all 0.2s ease;
}

/* ==========================================
 * HOVER STATE - UNSELECTED (blue)
 * ========================================== */

.ui-tag:not(.ui-tag--selected):hover:not(.ui-tag--disabled) {
  border-color: var(--border-action-hover);
  border-style: dashed;
}

.ui-tag:not(.ui-tag--selected):hover:not(.ui-tag--disabled) .ui-tag__icon {
  color: var(--border-action-hover);
}

/* ==========================================
 * HOVER STATE - SELECTED (red for removal + shake)
 * ========================================== */

.ui-tag--selected:hover:not(.ui-tag--disabled) {
  border-color: var(--border-error);
  border-style: solid;
}

/* Only shake if canShake is true (mouse has left and re-entered) */
.ui-tag--selected.ui-tag--can-shake:hover:not(.ui-tag--disabled) {
  animation: tag-shake 0.5s ease-in-out infinite;
}

.ui-tag--selected:hover:not(.ui-tag--disabled) .ui-tag__icon {
  color: var(--border-error);
}

@keyframes tag-shake {
  0%, 100% {
    transform: translateX(0) rotate(0deg);
  }
  25% {
    transform: translateX(-1px) rotate(-0.5deg);
  }
  50% {
    transform: translateX(1px) rotate(0.5deg);
  }
  75% {
    transform: translateX(-0.5px) rotate(-0.25deg);
  }
}

/* ==========================================
 * FOCUS STATE
 * ========================================== */

.ui-tag:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

/* ==========================================
 * DISABLED STATE
 * ========================================== */

.ui-tag--disabled {
  cursor: not-allowed;
  border-color: var(--border-disabled);
  color: var(--text-disable);
}

.ui-tag--disabled .ui-tag__icon {
  color: var(--text-disable);
}

/* ==========================================
 * ACTIVE STATE (click animation)
 * ========================================== */

.ui-tag:active:not(.ui-tag--disabled) {
  transform: scale(0.95);
}
</style>

