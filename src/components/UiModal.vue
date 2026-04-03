<template>
  <Teleport to="body">
    <Transition name="ui-modal">
      <div v-if="props.modelValue" class="ui-modal__overlay" @click.self="onOverlayClick">
        <div class="ui-modal" :class="modalClasses" role="dialog" aria-modal="true">
          <!-- Header -->
          <div class="ui-modal__header">
            <div class="ui-modal__header-content">
              <component
                v-if="headerIconComponent"
                :is="headerIconComponent"
                class="ui-modal__header-icon"
                :size="20"
                :stroke="2"
              />
              <h3 class="ui-modal__title">{{ props.title }}</h3>
            </div>
            <button class="ui-modal__close" type="button" @click="close">
              <component :is="closeIcon" :size="18" :stroke="2" />
            </button>
          </div>

          <!-- Body -->
          <div class="ui-modal__body">
            <slot>
              <p v-if="props.description" class="ui-modal__description">
                {{ props.description }}
              </p>
            </slot>
          </div>

          <!-- Footer -->
          <div v-if="props.hasFooter" class="ui-modal__footer">
            <slot name="footer">
              <UiButton
                variant="secondary"
                :label="props.cancelLabel"
                size="sm"
                @click="close"
              />
              <UiButton
                :variant="props.type === 'danger' ? 'error' : 'primary'"
                :label="props.confirmLabel"
                size="sm"
                @click="confirm"
              />
            </slot>
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
import UiButton from "./UiButton.vue";

type ModalType = "default" | "danger";
type IconProp = string | Component | FunctionalComponent;

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    title: string;
    description?: string;
    type?: ModalType;
    hasFooter?: boolean;
    cancelLabel?: string;
    confirmLabel?: string;
    icon?: IconProp;
    closeOnOverlay?: boolean;
  }>(),
  {
    modelValue: false,
    type: "default",
    hasFooter: true,
    cancelLabel: "Annuler",
    confirmLabel: "Confirmer",
    closeOnOverlay: true,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
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

function confirm() {
  emit("confirm");
  close();
}

function onOverlayClick() {
  if (props.closeOnOverlay) close();
}

const modalClasses = computed(() => [`ui-modal--${props.type}`]);
</script>

<style scoped>
.ui-modal__overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, var(--opacity-overlay));
  z-index: 9999;
}

.ui-modal {
  display: flex;
  flex-direction: column;
  background-color: var(--surface-default);
  border-radius: var(--radius-xl);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  width: 520px;
  max-width: 90vw;
  max-height: 85vh;
  overflow: hidden;
}

.ui-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-xl) var(--spacing-3xl);
  border-bottom: var(--alias-border-width-sm) solid var(--border-default-light);
}

.ui-modal__header-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  min-width: 0;
}

.ui-modal__header-icon {
  flex-shrink: 0;
  color: var(--icon-default);
}

.ui-modal--danger .ui-modal__header-icon {
  color: var(--icon-danger);
}

.ui-modal__title {
  margin: 0;
  font-family: var(--font-family-headings);
  font-size: var(--h1-font-size);
  font-weight: var(--font-weight-semi-bold);
  line-height: var(--h1-line-height);
  color: var(--text-headings);
}

.ui-modal__close {
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

.ui-modal__close:hover {
  background-color: var(--surface-neutral-hover);
  color: var(--icon-default);
}

.ui-modal__body {
  padding: var(--spacing-3xl);
  overflow-y: auto;
  flex: 1;
}

.ui-modal__description {
  margin: 0;
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  line-height: var(--body-line-height);
  color: var(--text-body);
}

.ui-modal__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-xl) var(--spacing-3xl);
  border-top: var(--alias-border-width-sm) solid var(--border-default-light);
}

/* Transitions */
.ui-modal-enter-active,
.ui-modal-leave-active {
  transition: opacity 0.2s ease;
}

.ui-modal-enter-active .ui-modal,
.ui-modal-leave-active .ui-modal {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.ui-modal-enter-from,
.ui-modal-leave-to {
  opacity: 0;
}

.ui-modal-enter-from .ui-modal,
.ui-modal-leave-to .ui-modal {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
</style>
