<template>
  <q-btn
    class="ui-button"
    :class="[`ui-button--${variant}`, `ui-button--${size}`]"
    :label="label"
    :icon="icon"
    :loading="loading"
    :disable="disabled"
    :outline="variant === 'secondary'"
    :flat="variant === 'ghost'"
    color="primary"
    unelevated
    @click="$emit('click', $event)"
  />
</template>

<script setup lang="ts">
type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const props = defineProps<{
  label: string;
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
  size?: Size;
}>();

withDefaults(props, {
  variant: "primary",
  size: "md",
});

defineEmits<{
  (e: "click", evt: MouseEvent): void;
}>();
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
