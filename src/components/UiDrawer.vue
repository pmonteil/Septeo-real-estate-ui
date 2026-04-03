<template>
  <Teleport to="body">
    <Transition name="ui-drawer">
      <div v-if="props.modelValue" class="ui-drawer__overlay" @click.self="onOverlayClick">
        <div class="ui-drawer" :class="drawerClasses">
          <!-- Header -->
          <div class="ui-drawer__header">
            <div class="ui-drawer__header-content">
              <component
                v-if="headerIconComponent"
                :is="headerIconComponent"
                class="ui-drawer__header-icon"
                :size="20"
                :stroke="2"
              />
              <h2 class="ui-drawer__title">{{ props.title }}</h2>
            </div>
            <button class="ui-drawer__close" type="button" @click="close">
              <component :is="closeIcon" :size="18" :stroke="2" />
            </button>
          </div>

          <!-- Body -->
          <div class="ui-drawer__body">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer || props.hasFooter" class="ui-drawer__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  type Component,
  type FunctionalComponent,
} from "vue";

type Position = "right" | "left";
type IconProp = string | Component | FunctionalComponent;

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    title: string;
    position?: Position;
    icon?: IconProp;
    hasFooter?: boolean;
    closeOnOverlay?: boolean;
    width?: string;
  }>(),
  {
    modelValue: false,
    position: "right",
    hasFooter: false,
    closeOnOverlay: true,
    width: "480px",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "close"): void;
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

function resolveIcon(icon: IconProp | undefined) {
  if (!icon) return null;
  if (typeof icon !== "string") return icon;

  const iconName = toIconName(icon);
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((module) => {
      const icons = module as unknown as Record<string, Component>;
      return icons[iconName] || { render: () => null };
    })
  );
}

const headerIconComponent = computed(() => resolveIcon(props.icon));

const closeIcon = defineAsyncComponent(() =>
  import("@tabler/icons-vue").then((module) => {
    const icons = module as unknown as Record<string, Component>;
    return icons[toIconName("x")] || { render: () => null };
  })
);

function close() {
  emit("update:modelValue", false);
  emit("close");
}

function onOverlayClick() {
  if (props.closeOnOverlay) close();
}

const drawerClasses = computed(() => [`ui-drawer--${props.position}`]);
</script>

<style scoped>
.ui-drawer__overlay {
  position: fixed;
  inset: 0;
  display: flex;
  background-color: rgba(0, 0, 0, var(--opacity-overlay));
  z-index: 9998;
}

.ui-drawer {
  display: flex;
  flex-direction: column;
  background-color: var(--surface-default);
  width: v-bind(width);
  max-width: 90vw;
  height: 100vh;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.08);
}

.ui-drawer--right {
  margin-left: auto;
}

.ui-drawer--left {
  margin-right: auto;
}

.ui-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-xl) var(--spacing-3xl);
  border-bottom: var(--alias-border-width-sm) solid var(--border-default-light);
  flex-shrink: 0;
}

.ui-drawer__header-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  min-width: 0;
}

.ui-drawer__header-icon {
  flex-shrink: 0;
  color: var(--icon-default);
}

.ui-drawer__title {
  margin: 0;
  font-family: var(--font-family-headings);
  font-size: var(--h1-font-size);
  font-weight: var(--font-weight-semi-bold);
  line-height: var(--h1-line-height);
  color: var(--text-headings);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ui-drawer__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  padding: var(--spacing-sm);
  cursor: pointer;
  color: var(--icon-secondary);
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
}

.ui-drawer__close:hover {
  background-color: var(--surface-neutral-hover);
  color: var(--icon-default);
}

.ui-drawer__body {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-3xl);
}

.ui-drawer__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-xl) var(--spacing-3xl);
  border-top: var(--alias-border-width-sm) solid var(--border-default-light);
  flex-shrink: 0;
}

/* Transitions */
.ui-drawer-enter-active,
.ui-drawer-leave-active {
  transition: opacity 0.25s ease;
}

.ui-drawer-enter-active .ui-drawer,
.ui-drawer-leave-active .ui-drawer {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.ui-drawer-enter-from,
.ui-drawer-leave-to {
  opacity: 0;
}

.ui-drawer--right.ui-drawer-enter-from,
.ui-drawer--right.ui-drawer-leave-to {
  transform: translateX(100%);
}

.ui-drawer--left.ui-drawer-enter-from,
.ui-drawer--left.ui-drawer-leave-to {
  transform: translateX(-100%);
}
</style>
