<template>
  <div class="ui-badge" :class="rootClasses">
    <span v-if="props.size === 'default'" class="ui-badge__content">
      {{ displayValue }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type BadgeStatus = "default" | "error" | "success";
type BadgeSize = "default" | "xs";

const props = withDefaults(
  defineProps<{
    value?: number | string;
    max?: number;
    status?: BadgeStatus;
    size?: BadgeSize;
  }>(),
  {
    value: 0,
    max: 99,
    status: "default",
    size: "default",
  }
);

// Display value (cap at max)
const displayValue = computed(() => {
  if (typeof props.value === "string") {
    return props.value;
  }
  if (props.value > props.max) {
    return `${props.max}+`;
  }
  return props.value;
});

// Root classes
const rootClasses = computed(() => [
  `ui-badge--status-${props.status}`,
  `ui-badge--size-${props.size}`,
]);
</script>

<style scoped>
.ui-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ==========================================
 * SIZES
 * ========================================== */

/* Default size - circle with content */
.ui-badge--size-default {
  width: 22px;
  height: 22px;
}

/* XS size - small dot */
.ui-badge--size-xs {
  width: 8px;
  height: 8px;
}

/* ==========================================
 * STATUS / COLORS
 * ========================================== */

/* Default (blue) */
.ui-badge--status-default {
  background-color: var(--icon-action);
}

/* Error (red) */
.ui-badge--status-error {
  background-color: var(--icon-error);
}

/* Success (green) */
.ui-badge--status-success {
  background-color: var(--icon-success);
}

/* ==========================================
 * CONTENT
 * ========================================== */

.ui-badge__content {
  font-family: var(--font-family-body);
  font-size: var(--caption-font-size);
  font-weight: var(--font-weight-semi-bold);
  line-height: 1;
  color: var(--alias-neutral-white);
  text-align: center;
  white-space: nowrap;
}
</style>

