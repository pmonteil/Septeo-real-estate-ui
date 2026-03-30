<template>
  <div class="ui-pill" :class="rootClasses">
    <component
      v-if="iconComponent"
      :is="iconComponent"
      class="ui-pill__icon"
      :size="props.size === 'xs' ? 10 : 14"
      :stroke="2"
    />
    <span class="ui-pill__label">{{ props.label }}</span>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  type Component,
  type FunctionalComponent,
} from "vue";

type PillColor = "blue" | "red" | "orange" | "green" | "purple" | "grey";
type PillType = "default" | "rounded";
type PillSize = "default" | "xs";
type IconProp = string | Component | FunctionalComponent;

const props = withDefaults(
  defineProps<{
    label?: string;
    icon?: IconProp;
    color?: PillColor;
    type?: PillType;
    size?: PillSize;
  }>(),
  {
    label: "Label",
    icon: undefined,
    color: "blue",
    type: "default",
    size: "default",
  }
);

const rootClasses = computed(() => [
  `ui-pill--${props.color}`,
  {
    "ui-pill--rounded": props.type === "rounded",
    "ui-pill--xs": props.size === "xs",
  },
]);

function toIconName(name: string): string {
  return (
    "Icon" +
    name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")
  );
}

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
        console.warn(`[UiPill] Icon "${iconName}" not found in @tabler/icons-vue`);
        return { render: () => null };
      }
      return iconComp;
    })
  );
}

const iconComponent = computed(() => resolveIcon(props.icon));
</script>

<style scoped>
.ui-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap-icon-text);
  padding: var(--spacing-sm) var(--radius-md);
  border-radius: var(--radius-md);
  font-family: var(--font-family-body);
  font-size: var(--body-small-font-size);
  font-weight: var(--font-weight-semi-bold);
  line-height: var(--body-small-line-height);
  white-space: nowrap;
}

.ui-pill--rounded {
  border-radius: var(--radius-full);
}

.ui-pill--xs {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--caption-font-size);
  line-height: var(--caption-line-height);
}

.ui-pill__icon {
  flex-shrink: 0;
}

.ui-pill__label {
  flex-shrink: 0;
}

/* ==========================================
 * COLOR: BLUE
 * ========================================== */
.ui-pill--blue {
  background-color: var(--context-blue-lighter);
  color: var(--context-blue-darker);
}

.ui-pill--blue .ui-pill__icon {
  color: var(--context-blue-darker);
}

/* ==========================================
 * COLOR: RED
 * ========================================== */
.ui-pill--red {
  background-color: var(--context-red-lighter);
  color: var(--context-red-darker);
}

.ui-pill--red .ui-pill__icon {
  color: var(--context-red-darker);
}

/* ==========================================
 * COLOR: ORANGE
 * ========================================== */
.ui-pill--orange {
  background-color: var(--context-orange-lighter);
  color: var(--context-orange-darker);
}

.ui-pill--orange .ui-pill__icon {
  color: var(--context-orange-darker);
}

/* ==========================================
 * COLOR: GREEN
 * ========================================== */
.ui-pill--green {
  background-color: var(--context-green-lighter);
  color: var(--context-green-darker);
}

.ui-pill--green .ui-pill__icon {
  color: var(--context-green-darker);
}

/* ==========================================
 * COLOR: PURPLE
 * ========================================== */
.ui-pill--purple {
  background-color: var(--context-purple-lighter);
  color: var(--context-purple-darker);
}

.ui-pill--purple .ui-pill__icon {
  color: var(--context-purple-darker);
}

/* ==========================================
 * COLOR: GREY
 * ========================================== */
.ui-pill--grey {
  background-color: var(--context-grey-light);
  color: var(--context-grey-dark);
}

.ui-pill--grey .ui-pill__icon {
  color: var(--context-grey-dark);
}
</style>
