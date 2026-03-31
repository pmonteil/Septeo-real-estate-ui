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
          'ui-toggle__item--disabled': option.disabled,
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

const props = withDefaults(
  defineProps<{
    options: ToggleOption[];
    modelValue: string | number;
    label?: string;
    labelIcon?: string | boolean;
    labelTooltip?: string;
    required?: boolean;
  }>(),
  {
    labelIcon: "help-circle",
    required: false,
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
        console.warn(
          `[UiToggle] Icon "${iconName}" not found in @tabler/icons-vue`
        );
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
  gap: var(--spacing-sm);
}

.ui-toggle__container {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background-color: var(--surface-default-bis);
  border-radius: var(--radius-lg);
}

.ui-toggle__item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  background: var(--surface-default);
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-semi-bold);
  line-height: var(--body-line-height);
  color: var(--text-body-secondary);
  white-space: nowrap;
}

.ui-toggle__item:hover:not(.ui-toggle__item--active):not(
    .ui-toggle__item--disabled
  ) {
  color: var(--text-accent);
}

.ui-toggle__item:hover:not(.ui-toggle__item--active):not(
    .ui-toggle__item--disabled
  )
  .ui-toggle__icon {
  color: var(--icon-accent);
}

.ui-toggle__item--active {
  background: var(
    --gradient-menu-active,
    linear-gradient(90deg, #ff9271 0%, #ff6136 100%)
  );
  color: var(--alias-neutral-white);
  box-shadow: 0 4px 12px rgba(255, 97, 54, 0.35);
}

.ui-toggle__item--active:hover {
  box-shadow: 0 6px 16px rgba(255, 97, 54, 0.45);
  transform: translateY(-1px);
}

.ui-toggle__item--active .ui-toggle__icon {
  color: var(--alias-neutral-white);
}

.ui-toggle__item--disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}

.ui-toggle__icon {
  flex-shrink: 0;
  color: var(--icon-secondary);
}

.ui-toggle__item--active .ui-toggle__icon {
  color: var(--alias-neutral-white, #ffffff);
}

.ui-toggle__label {
  /* Label styling inherited from button */
}
</style>
