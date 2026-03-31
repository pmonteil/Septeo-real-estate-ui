<template>
  <div class="ui-badge" :class="rootClasses">
    <span v-if="showContent" class="ui-badge__content">
      {{ displayValue }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type BadgeType = "notification" | "quantity";
type BadgeStatus = "selected" | "not-selected" | "disabled";
type BadgeSize = "default" | "xs";

const props = withDefaults(
  defineProps<{
    value?: number | string;
    max?: number;
    type?: BadgeType;
    status?: BadgeStatus;
    size?: BadgeSize;
  }>(),
  {
    value: 0,
    max: 99,
    type: "notification",
    status: "not-selected",
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
  `ui-badge--status-${props.status}`,
]);
</script>

<style scoped>
.ui-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  flex-shrink: 0;
  aspect-ratio: 1;
}

/* ── SIZES ───────────────────────────────────── */

.ui-badge--size-default {
  padding: var(--spacing-xs);
  width: 20px;
  height: 20px;
}

.ui-badge--size-xs {
  width: 8px;
  height: 8px;
}

/* ── TYPE: NOTIFICATION ──────────────────────── */

.ui-badge--type-notification.ui-badge--status-not-selected {
  background-color: var(--surface-accent);
}

.ui-badge--type-notification.ui-badge--status-not-selected .ui-badge__content {
  color: var(--alias-neutral-white);
}

.ui-badge--type-notification.ui-badge--status-selected {
  background-color: var(--surface-default);
}

.ui-badge--type-notification.ui-badge--status-selected .ui-badge__content {
  color: var(--text-accent);
}

/* ── TYPE: QUANTITY ───────────────────────────── */

.ui-badge--type-quantity.ui-badge--status-not-selected {
  background-color: var(--surface-default-bis);
}

.ui-badge--type-quantity.ui-badge--status-not-selected .ui-badge__content {
  color: var(--text-placeholder);
}

.ui-badge--type-quantity.ui-badge--status-selected {
  background-color: var(--surface-light-accent);
}

.ui-badge--type-quantity.ui-badge--status-selected .ui-badge__content {
  color: var(--text-accent);
}

/* ── DISABLED ────────────────────────────────── */

.ui-badge--status-disabled {
  opacity: var(--opacity-disabled);
  pointer-events: none;
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
