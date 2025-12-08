<template>
  <component
    :is="tag"
    class="ui-link"
    :class="rootClasses"
    :href="props.href"
    :to="props.to"
    :disabled="props.disabled || undefined"
    @click="onClick"
  >
    <!-- Icon Left -->
    <component
      v-if="iconLeftComponent"
      :is="iconLeftComponent"
      class="ui-link__icon ui-link__icon--left"
      :size="18"
      :stroke="2"
    />

    <!-- Label -->
    <span class="ui-link__label">{{ props.label }}</span>

    <!-- Icon Right -->
    <component
      v-if="iconRightComponent"
      :is="iconRightComponent"
      class="ui-link__icon ui-link__icon--right"
      :size="18"
      :stroke="2"
    />
  </component>
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
    label: string;
    href?: string;
    to?: string | object;
    iconLeft?: IconProp;
    iconRight?: IconProp;
    disabled?: boolean;
    active?: boolean;
  }>(),
  {
    disabled: false,
    active: false,
  }
);

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const isHovered = ref(false);

// Determine which tag to use
const tag = computed(() => {
  if (props.to) return "router-link";
  if (props.href) return "a";
  return "button";
});

// Root classes
const rootClasses = computed(() => ({
  "ui-link--disabled": props.disabled,
  "ui-link--active": props.active,
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
          `[UiLink] Icon "${iconName}" not found in @tabler/icons-vue`
        );
        return { render: () => null };
      }
      return iconComp;
    })
  );
}

const iconLeftComponent = computed(() => resolveIcon(props.iconLeft));
const iconRightComponent = computed(() => resolveIcon(props.iconRight));

function onClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault();
    return;
  }
  emit("click", event);
}
</script>

<style scoped>
.ui-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap-icon-text);
  padding: var(--brand-scale-4) 0;
  border-radius: var(--alias-border-radius-md);
  background: transparent;
  border: none;
  cursor: pointer;
  text-decoration: none;
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-line-height);
  color: var(--text-body-secondary);
  transition: all 0.2s ease;
}

/* Icons */
.ui-link__icon {
  flex-shrink: 0;
  color: var(--alias-neutral-500);
  transition: all 0.2s ease;
}

/* Label */
.ui-link__label {
  white-space: nowrap;
}

/* ==========================================
 * HOVER STATE
 * ========================================== */

.ui-link:hover:not(.ui-link--disabled) {
  color: var(--text-action-hover);
}

.ui-link:hover:not(.ui-link--disabled) .ui-link__icon {
  color: var(--text-action-hover);
}

/* Icon bounce animation on hover */
.ui-link:hover:not(.ui-link--disabled) .ui-link__icon--left {
  animation: link-bounce-left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ui-link:hover:not(.ui-link--disabled) .ui-link__icon--right {
  animation: link-bounce-right 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes link-bounce-left {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-2px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes link-bounce-right {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(2px);
  }
  100% {
    transform: translateX(0);
  }
}

/* ==========================================
 * ACTIVE STATE
 * ========================================== */

.ui-link--active {
  color: var(--text-body);
}

.ui-link--active .ui-link__icon {
  color: var(--text-body);
}

/* ==========================================
 * DISABLED STATE
 * ========================================== */

.ui-link--disabled {
  color: var(--text-disable);
  cursor: not-allowed;
  pointer-events: none;
}

.ui-link--disabled .ui-link__icon {
  color: var(--text-disable);
}

/* ==========================================
 * FOCUS STATE
 * ========================================== */

.ui-link:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}
</style>




