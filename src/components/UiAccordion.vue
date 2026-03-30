<template>
  <div class="ui-accordion" :class="rootClasses">
    <button
      class="ui-accordion__header"
      :class="headerClasses"
      type="button"
      :disabled="props.disabled"
      @click="toggle"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div class="ui-accordion__left">
        <component
          v-if="iconComponent"
          :is="iconComponent"
          class="ui-accordion__icon"
          :size="20"
          :stroke="2"
        />
        <span class="ui-accordion__title">{{ props.title }}</span>
        <div v-if="$slots.state" class="ui-accordion__state">
          <slot name="state" />
        </div>
      </div>

      <div class="ui-accordion__right">
        <component
          v-if="props.error && warningIconComponent"
          :is="warningIconComponent"
          class="ui-accordion__warning"
          :size="14"
          :stroke="2"
        />
        <component
          :is="chevronComponent"
          class="ui-accordion__chevron"
          :class="{ 'ui-accordion__chevron--open': isOpen }"
          :size="18"
          :stroke="2"
        />
      </div>
    </button>

    <Transition name="ui-accordion-slide">
      <div v-if="isOpen" class="ui-accordion__content">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  defineAsyncComponent,
  type Component,
  type FunctionalComponent,
} from "vue";

type IconProp = string | Component | FunctionalComponent;

const props = withDefaults(
  defineProps<{
    title?: string;
    icon?: IconProp;
    modelValue?: boolean;
    disabled?: boolean;
    error?: boolean;
  }>(),
  {
    title: "",
    modelValue: false,
    disabled: false,
    error: false,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const isHovered = ref(false);
const isOpen = computed(() => props.modelValue);

function toIconName(name: string): string {
  return (
    "Icon" +
    name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")
  );
}

function resolveIcon(icon: IconProp | undefined) {
  if (!icon) return null;
  if (typeof icon !== "string") return icon;
  const iconName = toIconName(icon);
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((mod) => {
      const icons = mod as unknown as Record<string, Component>;
      const c = icons[iconName];
      if (!c) {
        console.warn(`[UiAccordion] Icon "${iconName}" not found`);
        return { render: () => null };
      }
      return c;
    })
  );
}

const iconComponent = computed(() => resolveIcon(props.icon));
const chevronComponent = computed(() => resolveIcon("chevron-up"));
const warningIconComponent = computed(() => resolveIcon("alert-circle"));

const rootClasses = computed(() => ({
  "ui-accordion--open": isOpen.value,
  "ui-accordion--disabled": props.disabled,
  "ui-accordion--error": props.error,
}));

const headerClasses = computed(() => ({
  "ui-accordion__header--hover": isHovered.value && !props.disabled,
  "ui-accordion__header--error": props.error,
}));

function toggle() {
  if (props.disabled) return;
  emit("update:modelValue", !isOpen.value);
}
</script>

<style scoped>
.ui-accordion {
  display: flex;
  flex-direction: column;
  background-color: var(--surface-default);
  border: var(--alias-border-width-sm) solid var(--border-default-light);
  border-radius: var(--radius-lg);
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.ui-accordion--disabled {
  opacity: var(--opacity-disabled);
  pointer-events: none;
}

.ui-accordion--error {
  border-color: var(--border-danger);
}

.ui-accordion__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-3xl);
  padding: var(--spacing-xl);
  background: var(--surface-default);
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.ui-accordion__header:hover:not(:disabled) {
  background-color: var(--surface-neutral-hover);
}

.ui-accordion__left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
  min-width: 0;
}

.ui-accordion__icon {
  flex-shrink: 0;
  color: var(--icon-default);
}

.ui-accordion__title {
  font-family: var(--font-family-headings);
  font-size: var(--h3-font-size);
  font-weight: var(--font-weight-semi-bold);
  line-height: var(--h3-line-height);
  color: var(--text-headings);
  white-space: nowrap;
}

.ui-accordion__state {
  display: flex;
  flex: 1;
  align-items: center;
  overflow: hidden;
  min-width: 0;
}

.ui-accordion__right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-shrink: 0;
}

.ui-accordion__warning {
  color: var(--icon-danger);
  flex-shrink: 0;
}

.ui-accordion__chevron {
  color: var(--icon-secondary);
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.ui-accordion__chevron--open {
  transform: rotate(180deg);
}

.ui-accordion__content {
  flex: 1;
  min-height: 0;
  padding: 0 var(--spacing-xl) var(--spacing-xl);
}

/* Slide transition */
.ui-accordion-slide-enter-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.ui-accordion-slide-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.ui-accordion-slide-enter-from,
.ui-accordion-slide-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
