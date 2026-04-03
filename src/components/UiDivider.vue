<template>
  <div class="ui-divider" :class="dividerClasses">
    <hr class="ui-divider__line" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type Size = "default" | "compact";

const props = withDefaults(
  defineProps<{
    size?: Size;
  }>(),
  {
    size: "default",
  }
);

const dividerClasses = computed(() => [`ui-divider--${props.size}`]);
</script>

<style scoped>
.ui-divider {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
}

.ui-divider--default {
  padding: var(--spacing-xl) 0;
}

.ui-divider--compact {
  padding: var(--spacing-md) 0;
}

.ui-divider__line {
  margin: 0;
  border: none;
  height: 1px;
  background-color: var(--border-default-light);
}
</style>
