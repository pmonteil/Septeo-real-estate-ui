<template>
  <div class="ui-attribute" :class="attributeClasses">
    <component
      v-if="props.hasIcon && iconComponent"
      :is="iconComponent"
      class="ui-attribute__icon"
      :size="iconSize"
      :stroke="2"
    />
    <span class="ui-attribute__label">{{ props.label }}</span>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  type Component,
  type FunctionalComponent,
} from "vue";

type Size = "default" | "xs";
type IconProp = string | Component | FunctionalComponent;

const props = withDefaults(
  defineProps<{
    label: string;
    icon?: IconProp;
    hasIcon?: boolean;
    size?: Size;
    disabled?: boolean;
  }>(),
  {
    hasIcon: true,
    size: "default",
    disabled: false,
  }
);

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
  if (!props.icon) return null;
  if (typeof props.icon !== "string") return props.icon;

  const iconName = toIconName(props.icon);
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((module) => {
      const icons = module as unknown as Record<string, Component>;
      const icon = icons[iconName];
      if (!icon) {
        console.warn(`[UiAttribute] Icon "${iconName}" not found`);
        return { render: () => null };
      }
      return icon;
    })
  );
});

const iconSize = computed(() => (props.size === "xs" ? 14 : 18));

const attributeClasses = computed(() => [
  `ui-attribute--${props.size}`,
  { "ui-attribute--disabled": props.disabled },
]);
</script>

<style scoped>
.ui-attribute {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background-color: var(--surface-page);
  border-radius: var(--radius-md);
  white-space: nowrap;
}

.ui-attribute--default {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--body-font-size);
  line-height: var(--body-line-height);
}

.ui-attribute--xs {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--body-small-font-size);
  line-height: var(--body-small-line-height);
}

.ui-attribute--disabled {
  opacity: var(--opacity-disabled);
  pointer-events: none;
}

.ui-attribute__icon {
  flex-shrink: 0;
  color: var(--icon-secondary);
}

.ui-attribute__label {
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-medium);
  color: var(--text-body);
}
</style>
