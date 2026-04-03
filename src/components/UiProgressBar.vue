<template>
  <div class="ui-progress-bar" :class="progressClasses">
    <div class="ui-progress-bar__track">
      <div
        class="ui-progress-bar__fill"
        :style="{ width: clampedPercent + '%' }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    value?: number;
    max?: number;
  }>(),
  {
    value: 0,
    max: 100,
  }
);

const clampedPercent = computed(() => {
  const pct = (props.value / props.max) * 100;
  return Math.min(100, Math.max(0, pct));
});

const isComplete = computed(() => clampedPercent.value >= 100);

const progressClasses = computed(() => ({
  "ui-progress-bar--complete": isComplete.value,
}));
</script>

<style scoped>
.ui-progress-bar {
  width: 100%;
}

.ui-progress-bar__track {
  width: 100%;
  height: 6px;
  background-color: var(--surface-default-bis);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.ui-progress-bar__fill {
  height: 100%;
  background-color: var(--surface-accent);
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

.ui-progress-bar--complete .ui-progress-bar__fill {
  background-color: var(--alias-success-default);
}
</style>
