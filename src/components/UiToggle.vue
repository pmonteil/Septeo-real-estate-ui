<template>
  <div class="ui-toggle">
    <!-- Label optionnel -->
    <UiLabel
      v-if="label"
      :label="label"
      :icon="labelIcon"
      :tooltip="labelTooltip"
      :required="required"
    />
    
    <!-- Container des options -->
    <div class="ui-toggle__container">
      <button
        v-for="(option, index) in options"
        :key="index"
        class="ui-toggle__item"
        :class="{ 
          'ui-toggle__item--active': modelValue === option.value,
          'ui-toggle__item--disabled': option.disabled
        }"
        :disabled="option.disabled"
        @click="!option.disabled && $emit('update:modelValue', option.value)"
      >
        <component 
          v-if="option.icon"
          :is="resolveIcon(option.icon)" 
          class="ui-toggle__icon"
          :size="18" 
          :stroke="2" 
        />
        <span class="ui-toggle__label">{{ option.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, type Component } from "vue";
import UiLabel from "./UiLabel.vue";

interface ToggleOption {
  label: string;
  value: string | number;
  icon?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<{
  options: ToggleOption[];
  modelValue: string | number;
  label?: string;
  labelIcon?: string | boolean;
  labelTooltip?: string;
  required?: boolean;
}>(), {
  labelIcon: "help-circle",
  required: false,
});

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
        console.warn(`[UiToggle] Icon "${iconName}" not found in @tabler/icons-vue`);
        return { render: () => null };
      }
      return iconComp;
    })
  );
}
</script>

<style scoped>
.ui-toggle {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--brand-scale-8, 8px);
}

.ui-toggle__container {
  display: inline-flex;
  align-items: center;
  gap: var(--brand-scale-4, 4px);
  padding: var(--brand-scale-4, 4px);
  background-color: var(--surface-default-bis, #f5f7f9);
  border-radius: var(--alias-border-radius-lg, 8px);
}

.ui-toggle__item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--brand-scale-4, 4px);
  padding: var(--brand-scale-8, 8px);
  border: none;
  border-radius: var(--alias-border-radius-sm, 6px);
  background: var(--surface-default, #ffffff);
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
  font-family: var(--font-family-body);
  font-size: var(--body-font-size, 14px);
  font-weight: var(--font-weight-semi-bold, 600);
  line-height: var(--body-line-height, 20px);
  color: var(--text-body-secondary, #7e8fb3);
  white-space: nowrap;
}

.ui-toggle__item:hover:not(.ui-toggle__item--active):not(.ui-toggle__item--disabled) {
  color: var(--text-accent, #ff6136);
}

.ui-toggle__item:hover:not(.ui-toggle__item--active):not(.ui-toggle__item--disabled) .ui-toggle__icon {
  color: var(--icon-accent, #ff6136);
}

.ui-toggle__item--active {
  background: var(--gradient-menu-active, linear-gradient(90deg, #FF9271 0%, #FF6136 100%));
  color: var(--alias-neutral-white, #ffffff);
  box-shadow: 0 4px 12px rgba(255, 97, 54, 0.35);
}

.ui-toggle__item--active:hover {
  box-shadow: 0 6px 16px rgba(255, 97, 54, 0.45);
  transform: translateY(-1px);
}

.ui-toggle__item--active .ui-toggle__icon {
  color: var(--alias-neutral-white, #ffffff);
}

.ui-toggle__item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ui-toggle__icon {
  flex-shrink: 0;
  color: var(--icon-secondary, #7e8fb3);
}

.ui-toggle__item--active .ui-toggle__icon {
  color: var(--alias-neutral-white, #ffffff);
}

.ui-toggle__label {
  /* Label styling inherited from button */
}
</style>
