<template>
  <div class="ui-pill" :class="rootClasses">
    <component
      v-if="iconComponent"
      :is="iconComponent"
      class="ui-pill__icon"
      :size="14"
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
type IconProp = string | Component | FunctionalComponent;

const props = withDefaults(
  defineProps<{
    label?: string;
    icon?: IconProp;
    color?: PillColor;
  }>(),
  {
    label: "Label",
    icon: undefined,
    color: "blue",
  }
);

const rootClasses = computed(() => [`ui-pill--${props.color}`]);

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
  padding: var(--brand-scale-4);
  border-radius: var(--alias-border-radius-md);
  font-family: var(--font-family-body);
  font-size: var(--body-small-font-size);
  font-weight: var(--font-weight-semi-bold);
  line-height: var(--body-small-line-height);
  white-space: nowrap;
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
  background-color: var(--context-blue-lighter, #eef4ff);
  color: var(--context-blue-darker, #3456d0);
}

.ui-pill--blue .ui-pill__icon {
  color: var(--context-blue-darker, #3456d0);
}

/* ==========================================
 * COLOR: RED
 * ========================================== */
.ui-pill--red {
  background-color: var(--context-red-lighter, #fff0f0);
  color: var(--context-red-darker, #ed1136);
}

.ui-pill--red .ui-pill__icon {
  color: var(--context-red-darker, #ed1136);
}

/* ==========================================
 * COLOR: ORANGE
 * ========================================== */
.ui-pill--orange {
  background-color: var(--context-orange-lighter, #fff2ed);
  color: var(--context-orange-darker, #dd370e);
}

.ui-pill--orange .ui-pill__icon {
  color: var(--context-orange-darker, #dd370e);
}

/* ==========================================
 * COLOR: GREEN
 * ========================================== */
.ui-pill--green {
  background-color: var(--context-green-lighter, #f2fbf9);
  color: var(--context-green-darker, #20817c);
}

.ui-pill--green .ui-pill__icon {
  color: var(--context-green-darker, #20817c);
}

/* ==========================================
 * COLOR: PURPLE
 * ========================================== */
.ui-pill--purple {
  background-color: var(--context-purple-lighter, #f4f0ff);
  color: var(--context-purple-darker, #802ced);
}

.ui-pill--purple .ui-pill__icon {
  color: var(--context-purple-darker, #802ced);
}

/* ==========================================
 * COLOR: GREY
 * ========================================== */
.ui-pill--grey {
  background-color: var(--context-grey-light, #f5f7f9);
  color: var(--context-grey-dark, #6a7896);
}

.ui-pill--grey .ui-pill__icon {
  color: var(--context-grey-dark, #6a7896);
}
</style>

