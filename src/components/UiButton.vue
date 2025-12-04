<template>
  <q-btn
    class="ui-button"
    :class="[`ui-button--${props.variant}`, `ui-button--${props.size}`]"
    :label="props.label"
    :icon="props.icon"
    :loading="props.loading"
    :disable="props.disabled"
    :outline="props.variant === 'secondary'"
    :flat="props.variant === 'ghost'"
    color="primary"
    unelevated
    @click="handleClick"
  />
</template>

<script setup lang="ts">
type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    label: string;
    icon?: string;
    loading?: boolean;
    disabled?: boolean;
    variant?: Variant;
    size?: Size;
  }>(),
  {
    variant: "primary",
    size: "md",
  }
);

const emit = defineEmits<{
  (e: "click", evt: Event): void;
}>();

function handleClick(event: Event) {
  emit("click", event);
}
</script>

<style scoped>
.ui-button {
  border-radius: 999px;
  font-weight: 500;
}

/* tailles */
.ui-button--sm {
  font-size: 12px;
  padding: 4px 10px;
}

.ui-button--md {
  font-size: 14px;
  padding: 6px 14px;
}

.ui-button--lg {
  font-size: 16px;
  padding: 8px 18px;
}

/* variants */
.ui-button--primary {
}
.ui-button--secondary {
}
.ui-button--ghost {
}
.ui-button--danger {
}
</style>
