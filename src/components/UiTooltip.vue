<template>
  <q-tooltip
    class="ui-tooltip"
    :anchor="props.anchor"
    :self="props.self"
    :offset="props.offset"
    :delay="props.delay"
    :max-width="props.maxWidth"
  >
    <slot>{{ props.text }}</slot>
  </q-tooltip>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text?: string;
    anchor?: string;
    self?: string;
    offset?: [number, number];
    delay?: number;
    maxWidth?: string;
  }>(),
  {
    anchor: "top middle",
    self: "bottom middle",
    offset: () => [0, 8],
    delay: 300,
    maxWidth: "280px",
  }
);
</script>

<style scoped>
.ui-tooltip {
  font-family: var(--font-family-body);
  font-size: var(--body-small-font-size);
  line-height: var(--body-small-line-height);
  font-weight: var(--font-weight-medium);
  background-color: var(--alias-neutral-900);
  color: var(--alias-neutral-white);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
}
</style>
