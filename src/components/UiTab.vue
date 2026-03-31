<template>
  <div class="ui-tabs" :class="{ 'ui-tabs--xs': props.size === 'xs' }">
    <div class="ui-tabs__container">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        class="ui-tabs__tab"
        :class="{ 
          'ui-tabs__tab--active': modelValue === tab.value,
          'ui-tabs__tab--disabled': tab.disabled
        }"
        :disabled="tab.disabled"
        @click="!tab.disabled && $emit('update:modelValue', tab.value)"
      >
        <component 
          v-if="tab.icon"
          :is="resolveIcon(tab.icon)" 
          class="ui-tabs__icon"
          :size="props.size === 'xs' ? 14 : 18" 
          :stroke="2" 
        />
        <span class="ui-tabs__label">{{ tab.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, type Component } from "vue";

type TabSize = "default" | "xs";

interface Tab {
  label: string;
  value: string | number;
  icon?: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    tabs: Tab[];
    modelValue: string | number;
    size?: TabSize;
  }>(),
  {
    size: "default",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
}>();

function toIconName(name: string): string {
  return (
    "Icon" +
    name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")
  );
}

function resolveIcon(icon: string) {
  const iconName = toIconName(icon);
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((module) => {
      const icons = module as unknown as Record<string, Component>;
      const iconComp = icons[iconName];
      if (!iconComp) {
        console.warn(`[UiTab] Icon "${iconName}" not found in @tabler/icons-vue`);
        return { render: () => null };
      }
      return iconComp;
    })
  );
}
</script>

<style scoped>
.ui-tabs {
  display: inline-flex;
}

.ui-tabs__container {
  display: flex;
  align-items: center;
  gap: var(--scale-4, 4px);
  padding: var(--scale-4, 4px);
  background-color: var(--alias-neutral-50);
  border-radius: var(--radius-full);
}

.ui-tabs__tab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--scale-4, 4px) var(--scale-12, 12px);
  border: none;
  border-radius: var(--radius-full);
  background: transparent;
  cursor: pointer;
  transition: background 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-line-height);
  color: var(--text-body);
  white-space: nowrap;
}

/* ── SIZE XS ─────────────────────────────── */
.ui-tabs--xs .ui-tabs__tab {
  padding: var(--spacing-sm) var(--radius-md);
  font-size: var(--body-small-font-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-small-line-height);
}

.ui-tabs__tab:hover:not(.ui-tabs__tab--active):not(.ui-tabs__tab--disabled) {
  background-color: var(--alias-neutral-100);
}

.ui-tabs__tab--active {
  background: var(--gradient-menu-active);
  color: var(--alias-neutral-white);
  box-shadow: 0 2px 8px rgba(255, 97, 54, 0.25);
  font-weight: var(--font-weight-medium);
}

.ui-tabs__tab--active:hover {
  box-shadow: 0 4px 12px rgba(255, 97, 54, 0.35);
}

.ui-tabs__tab--active .ui-tabs__icon {
  color: var(--alias-neutral-white);
}

.ui-tabs__tab--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ui-tabs__icon {
  flex-shrink: 0;
}

.ui-tabs__label {
  /* No transition for color - instant change when active */
}

/* Animation on tab change */
.ui-tabs__tab--active {
  animation: tab-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes tab-pop {
  0% {
    transform: scale(0.95);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}
</style>

