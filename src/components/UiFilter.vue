<template>
  <button
    class="ui-filter"
    :class="rootClasses"
    type="button"
    :disabled="props.disabled"
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
        :status="badgeStatus"
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
type FilterState = "selected" | "not-selected";
type FilterStatus = "default" | "hover" | "disabled";
type FilterSize = "default" | "xs";

const props = withDefaults(
  defineProps<{
    label?: string;
    icon?: IconProp;
    count?: number;
    state?: FilterState;
    disabled?: boolean;
    showBadge?: boolean;
    showDropdown?: boolean;
    size?: FilterSize;
  }>(),
  {
    state: "not-selected",
    disabled: false,
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

const isSelected = computed(() => props.state === "selected");

const rootClasses = computed(() => ({
  "ui-filter--selected": isSelected.value,
  "ui-filter--disabled": props.disabled,
  "ui-filter--xs": props.size === "xs",
}));

const badgeStatus = computed(() => {
  if (isSelected.value || isHovered.value) return "selected";
  return "not-selected";
});

function handleClick(event: Event) {
  emit("click", event);
}
</script>

<style scoped>
.ui-filter {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-md);
  width: fit-content;
  height: 34px;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--surface-field);
  border: var(--alias-border-width-sm) solid var(--border-default);
  border-radius: var(--radius-md);
  box-sizing: border-box;
  cursor: pointer;
  font-family: var(--font-family-body);
  transition:
    border-color 0.15s ease,
    color 0.15s ease;
}

/* ── SIZE XS ─────────────────────────────── */
.ui-filter--xs {
  height: 28px;
  padding: var(--radius-md) var(--spacing-md);
  border-radius: var(--radius-sm);
}

/* ── HOVER ───────────────────────────────── */
.ui-filter:hover:not(.ui-filter--selected):not(.ui-filter--disabled) {
  border-color: var(--border-action-accent);
}

.ui-filter:hover:not(.ui-filter--selected):not(.ui-filter--disabled) .ui-filter__label {
  color: var(--text-accent);
}

.ui-filter:hover:not(.ui-filter--selected):not(.ui-filter--disabled) .ui-filter__icon,
.ui-filter:hover:not(.ui-filter--selected):not(.ui-filter--disabled) .ui-filter__chevron {
  color: var(--icon-accent);
}

/* ── SELECTED ───────────────────────────── */
.ui-filter--selected {
  border-color: var(--border-action-accent);
}

.ui-filter--selected .ui-filter__label {
  color: var(--text-accent);
}

.ui-filter--selected .ui-filter__icon,
.ui-filter--selected .ui-filter__chevron {
  color: var(--icon-accent);
}

/* ── DISABLED ───────────────────────────── */
.ui-filter--disabled {
  opacity: var(--opacity-disabled);
  pointer-events: none;
  cursor: not-allowed;
}

/* ── LEFT GROUP ──────────────────────────── */
.ui-filter__left {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
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
