<template>
  <div class="ui-tabs-dark">
    <div class="ui-tabs-dark__container">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        class="ui-tabs-dark__tab"
        :class="{ 
          'ui-tabs-dark__tab--active': modelValue === tab.value,
          'ui-tabs-dark__tab--disabled': tab.disabled
        }"
        :disabled="tab.disabled"
        @click="!tab.disabled && $emit('update:modelValue', tab.value)"
      >
        <component 
          v-if="tab.icon"
          :is="resolveIcon(tab.icon)" 
          class="ui-tabs-dark__icon"
          :size="16" 
          :stroke="2" 
        />
        <span class="ui-tabs-dark__label">{{ tab.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, type Component } from "vue";

interface Tab {
  label: string;
  value: string | number;
  icon?: string;
  disabled?: boolean;
}

const props = defineProps<{
  tabs: Tab[];
  modelValue: string | number;
}>();

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
        console.warn(`[UiTabDark] Icon "${iconName}" not found in @tabler/icons-vue`);
        return { render: () => null };
      }
      return iconComp;
    })
  );
}
</script>

<style scoped>
.ui-tabs-dark {
  display: inline-flex;
}

.ui-tabs-dark__container {
  display: flex;
  align-items: center;
  gap: var(--scale-4, 4px);
  padding: var(--scale-4, 4px);
  background-color: rgba(36, 43, 74, 0.6);
  border-radius: 100px;
}

.ui-tabs-dark__tab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap-icon-text, 4px);
  padding: var(--scale-4, 4px) var(--scale-12, 12px);
  border: none;
  border-radius: 100px;
  background: transparent;
  cursor: pointer;
  transition: background 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--body-line-height);
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
}

.ui-tabs-dark__tab:hover:not(.ui-tabs-dark__tab--active):not(.ui-tabs-dark__tab--disabled) {
  background-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.ui-tabs-dark__tab--active {
  background: var(--gradient-menu-active);
  color: var(--alias-neutral-white);
  box-shadow: 0 2px 8px rgba(255, 97, 54, 0.25);
  font-weight: var(--font-weight-medium);
}

.ui-tabs-dark__tab--active:hover {
  box-shadow: 0 4px 12px rgba(255, 97, 54, 0.35);
}

.ui-tabs-dark__tab--active .ui-tabs-dark__icon {
  color: var(--alias-neutral-white);
}

.ui-tabs-dark__tab--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ui-tabs-dark__icon {
  flex-shrink: 0;
}

.ui-tabs-dark__label {
  /* No transition for color - instant change when active */
}

/* Animation on tab change */
.ui-tabs-dark__tab--active {
  animation: tab-pop-dark 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes tab-pop-dark {
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

