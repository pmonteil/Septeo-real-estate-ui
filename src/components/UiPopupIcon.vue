<template>
  <div class="ui-popup-icon" :class="iconClasses">
    <component
      :is="iconComponent"
      class="ui-popup-icon__icon"
      :size="20"
      :stroke="2"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from "vue";

type IconVariant = "information" | "error" | "warning" | "neutral";

const props = withDefaults(
  defineProps<{
    variant?: IconVariant;
  }>(),
  {
    variant: "information",
  }
);

// Icon mapping per variant
const iconNames: Record<IconVariant, string> = {
  information: "info-circle",
  error: "exclamation-circle",
  warning: "alert-triangle",
  neutral: "alien",
};

// Convert icon name to component name
function toIconName(name: string): string {
  return (
    "Icon" +
    name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")
  );
}

const iconComponent = computed(() => {
  const iconName = toIconName(iconNames[props.variant]);
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((module) => {
      const icons = module as unknown as Record<string, Component>;
      const icon = icons[iconName];
      if (!icon) {
        console.warn(`[UiPopupIcon] Icon "${iconName}" not found`);
        return { render: () => null };
      }
      return icon;
    })
  );
});

const iconClasses = computed(() => ({
  [`ui-popup-icon--${props.variant}`]: true,
}));
</script>

<style scoped>
.ui-popup-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--alias-border-radius-lg);
  flex-shrink: 0;
}

.ui-popup-icon__icon {
  flex-shrink: 0;
}

/* Variants */
.ui-popup-icon--information {
  background-color: var(--surface-light-action);
}

.ui-popup-icon--information .ui-popup-icon__icon {
  color: var(--icon-action);
}

.ui-popup-icon--error {
  background-color: var(--surface-error);
}

.ui-popup-icon--error .ui-popup-icon__icon {
  color: var(--icon-error);
}

.ui-popup-icon--warning {
  background-color: var(--surface-warning);
}

.ui-popup-icon--warning .ui-popup-icon__icon {
  color: var(--icon-warning);
}

.ui-popup-icon--neutral {
  background-color: var(--surface-default-bis);
}

.ui-popup-icon--neutral .ui-popup-icon__icon {
  color: var(--icon-secondary);
}
</style>
