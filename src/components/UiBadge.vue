<template>
  <div class="ui-badge" :class="rootClasses">
    <span v-if="showContent" class="ui-badge__content">
      {{ displayValue }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type BadgeType = "notifications" | "quantity";
type BadgeSize = "default" | "xs";

const props = withDefaults(
  defineProps<{
    value?: number | string;
    max?: number;
    type?: BadgeType;
    selected?: boolean;
    size?: BadgeSize;
  }>(),
  {
    value: 0,
    max: 99,
    type: "notifications",
    selected: false,
    size: "default",
  }
);

const displayValue = computed(() => {
  if (typeof props.value === "string") return props.value;
  if (props.value > props.max) return `${props.max}+`;
  return props.value;
});

const showContent = computed(() => props.size === "default");

const rootClasses = computed(() => [
  `ui-badge--type-${props.type}`,
  `ui-badge--size-${props.size}`,
  { "ui-badge--selected": props.selected },
]);
</script>

<style scoped>
.ui-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  flex-shrink: 0;
  aspect-ratio: 1;
}

/* ── SIZES ───────────────────────────────────── */

.ui-badge--size-default {
  padding: 2px;
  width: 17px;
  height: 17px;
}

.ui-badge--size-xs {
  width: 8px;
  height: 8px;
}

/* ── TYPE: NOTIFICATIONS ─────────────────────── */

.ui-badge--type-notifications {
  background-color: var(--surface-accent);
}

.ui-badge--type-notifications .ui-badge__content {
  color: var(--alias-neutral-white);
}

.ui-badge--type-notifications.ui-badge--selected {
  background-color: var(--surface-default);
}

.ui-badge--type-notifications.ui-badge--selected .ui-badge__content {
  color: var(--text-accent);
}

/* ── TYPE: QUANTITY ───────────────────────────── */

.ui-badge--type-quantity {
  background-color: var(--surface-default-bis);
}

.ui-badge--type-quantity .ui-badge__content {
  color: var(--text-placeholder);
}

.ui-badge--type-quantity.ui-badge--selected {
  background-color: var(--surface-light-accent);
}

.ui-badge--type-quantity.ui-badge--selected .ui-badge__content {
  color: var(--text-accent);
}

/* ── CONTENT ─────────────────────────────────── */

.ui-badge__content {
  font-family: var(--font-family-body);
  font-size: var(--caption-font-size);
  font-weight: var(--font-weight-semi-bold);
  line-height: var(--body-line-height);
  text-align: center;
  white-space: nowrap;
  width: 13px;
  height: 13px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
