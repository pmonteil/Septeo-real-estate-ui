<template>
  <button
    class="ui-filter"
    :class="rootClasses"
    type="button"
    @click="handleClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <span class="ui-filter__left">
      <component
        v-if="iconComponent"
        :is="iconComponent"
        class="ui-filter__icon"
        :size="14"
        :stroke="2"
      />

      <span v-if="props.label" class="ui-filter__label">{{ props.label }}</span>

      <UiBadge
        v-if="props.showBadge && props.count !== undefined"
        :value="props.count"
        type="quantity"
        :selected="props.active || isHovered"
        class="ui-filter__badge"
      />
    </span>

    <component
      v-if="props.showDropdown && chevronComponent"
      :is="chevronComponent"
      class="ui-filter__chevron"
      :size="14"
      :stroke="2"
    />
  </button>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  defineAsyncComponent,
  type Component,
  type FunctionalComponent,
} from "vue";
import UiBadge from "./UiBadge.vue";

type IconProp = string | Component | FunctionalComponent;
type FilterSize = "default" | "xs";

const props = withDefaults(
  defineProps<{
    label?: string;
    icon?: IconProp;
    count?: number;
    active?: boolean;
    showBadge?: boolean;
    showDropdown?: boolean;
    size?: FilterSize;
  }>(),
  {
    active: false,
    showBadge: true,
    showDropdown: true,
    size: "default",
  }
);

const emit = defineEmits<{
  (e: "click", evt: Event): void;
}>();

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
  if (typeof icon !== "string") return icon;
  const iconName = toIconName(icon);
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((mod) => {
      const icons = mod as unknown as Record<string, Component>;
      const c = icons[iconName];
      if (!c) {
        console.warn(`[UiFilter] Icon "${iconName}" not found in @tabler/icons-vue`);
        return { render: () => null };
      }
      return c;
    })
  );
}

const isHovered = ref(false);

const iconComponent = computed(() => resolveIcon(props.icon));
const chevronComponent = computed(() => resolveIcon("chevron-down"));

const rootClasses = computed(() => ({
  "ui-filter--active": props.active,
  "ui-filter--xs": props.size === "xs",
}));

function handleClick(event: Event) {
  emit("click", event);
}
</script>

<style scoped>
.ui-filter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding: var(--brand-scale-8) var(--brand-scale-12);
  background-color: var(--surface-field);
  border: var(--alias-border-width-sm) solid var(--border-default);
  border-radius: var(--brand-scale-6);
  cursor: pointer;
  font-family: var(--font-family-body);
  transition:
    border-color 0.15s ease,
    color 0.15s ease;
}

/* ── SIZE XS ─────────────────────────────── */
.ui-filter--xs {
  padding: var(--brand-scale-4) var(--brand-scale-8);
  border-radius: var(--brand-scale-4);
}

/* ── HOVER ───────────────────────────────── */
.ui-filter:hover:not(.ui-filter--active) {
  border-color: var(--border-action-accent);
}

.ui-filter:hover:not(.ui-filter--active) .ui-filter__label {
  color: var(--text-accent);
}

.ui-filter:hover:not(.ui-filter--active) .ui-filter__icon,
.ui-filter:hover:not(.ui-filter--active) .ui-filter__chevron {
  color: var(--icon-accent);
}

/* ── ACTIVE ──────────────────────────────── */
.ui-filter--active {
  border-color: var(--border-action-accent);
}

.ui-filter--active .ui-filter__label {
  color: var(--text-accent);
}

.ui-filter--active .ui-filter__icon,
.ui-filter--active .ui-filter__chevron {
  color: var(--icon-accent);
}

/* ── LEFT GROUP ──────────────────────────── */
.ui-filter__left {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ── ICON ────────────────────────────────── */
.ui-filter__icon {
  flex-shrink: 0;
  color: var(--icon-default);
  transition: color 0.15s ease;
}

/* ── LABEL ───────────────────────────────── */
.ui-filter__label {
  font-size: var(--body-small-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--body-small-line-height);
  color: var(--text-body);
  white-space: nowrap;
  transition: color 0.15s ease;
}

/* ── CHEVRON ─────────────────────────────── */
.ui-filter__chevron {
  flex-shrink: 0;
  color: var(--icon-secondary);
  transition: color 0.15s ease;
}
</style>
