<template>
  <Teleport to="body">
    <Transition name="ui-popup-fade">
      <div
        v-if="modelValue"
        class="ui-popup-overlay"
        @click.self="onOverlayClick"
      >
        <Transition name="ui-popup-scale" appear>
          <div v-if="modelValue" class="ui-popup" :class="popupClasses">
            <!-- Close button -->
            <button
              v-if="showCloseButton"
              class="ui-popup__close"
              type="button"
              @click="close"
            >
              <component
                :is="closeIconComponent"
                class="ui-popup__close-icon"
                :size="14"
                :stroke="2"
              />
            </button>

            <!-- Content -->
            <div class="ui-popup__content">
              <!-- Icon -->
              <UiPopupIcon
                v-if="showIcon"
                :variant="iconVariant"
                class="ui-popup__icon"
              />

              <!-- Text content -->
              <div class="ui-popup__text">
                <h2 v-if="title" class="ui-popup__title">{{ title }}</h2>
                <p v-if="description" class="ui-popup__description">
                  {{ description }}
                </p>
                <slot />
              </div>
            </div>

            <!-- Actions -->
            <div v-if="showActions" class="ui-popup__actions">
              <UiButton
                v-if="cancelLabel"
                :label="cancelLabel"
                variant="secondary"
                class="ui-popup__btn ui-popup__btn--cancel"
                @click="onCancel"
              />
              <UiButton
                v-if="confirmLabel"
                :label="confirmLabel"
                :icon="confirmIcon"
                :variant="confirmVariant"
                class="ui-popup__btn ui-popup__btn--confirm"
                @click="onConfirm"
              />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from "vue";
import UiPopupIcon from "./UiPopupIcon.vue";
import UiButton from "./UiButton.vue";

type PopupVariant = "positive" | "negative";
type IconVariant = "information" | "error" | "warning" | "neutral";
type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "error"
  | "accent"
  | "ai";

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    variant?: PopupVariant;
    title?: string;
    description?: string;
    iconVariant?: IconVariant;
    showIcon?: boolean;
    showCloseButton?: boolean;
    cancelLabel?: string;
    confirmLabel?: string;
    confirmIcon?: string;
    closeOnOverlay?: boolean;
    persistent?: boolean;
  }>(),
  {
    modelValue: false,
    variant: "positive",
    title: "",
    description: "",
    iconVariant: undefined,
    showIcon: true,
    showCloseButton: true,
    cancelLabel: "Retour",
    confirmLabel: "Je confirme",
    confirmIcon: "check",
    closeOnOverlay: true,
    persistent: false,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
  (e: "close"): void;
}>();

// Determine icon variant based on popup variant if not explicitly set
const computedIconVariant = computed<IconVariant>(() => {
  if (props.iconVariant) return props.iconVariant;
  return props.variant === "negative" ? "error" : "information";
});

// Pass computed icon variant to the icon
const iconVariant = computed(() => computedIconVariant.value);

// Determine confirm button variant
const confirmVariant = computed<ButtonVariant>(() => {
  return props.variant === "negative" ? "error" : "primary";
});

// Show actions if at least one button label is provided
const showActions = computed(() => props.cancelLabel || props.confirmLabel);

// Popup classes
const popupClasses = computed(() => ({
  [`ui-popup--${props.variant}`]: true,
}));

// Close icon component
const closeIconComponent = computed(() => {
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((module) => {
      const icons = module as unknown as Record<string, Component>;
      return icons.IconX || { render: () => null };
    })
  );
});

// Methods
function close() {
  emit("update:modelValue", false);
  emit("close");
}

function onOverlayClick() {
  if (props.closeOnOverlay && !props.persistent) {
    close();
  }
}

function onConfirm() {
  emit("confirm");
  if (!props.persistent) {
    close();
  }
}

function onCancel() {
  emit("cancel");
  close();
}

// Expose methods
defineExpose({
  open: () => emit("update:modelValue", true),
  close,
});
</script>

<style scoped>
.ui-popup-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  padding: 20px;
}

.ui-popup {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--brand-scale-24, 24px);
  width: 100%;
  max-width: 430px;
  padding: 20px;
  background-color: var(--surface-default);
  border: 1px solid var(--border-default-light);
  border-radius: var(--alias-border-radius-md);
  box-shadow: 0 8px 100px -50px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

/* Close button */
.ui-popup__close {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  min-width: 28px;
  min-height: 28px;
  padding: var(--button-xs-padding-y) var(--button-xs-padding-x);
  background-color: var(--surface-default);
  border: var(--alias-border-width-sm) solid var(--border-default-light);
  border-radius: var(--alias-border-radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.ui-popup__close:hover {
  background-color: var(--surface-neutral-hover);
}

.ui-popup__close-icon {
  color: var(--icon-secondary);
  flex-shrink: 0;
}

.ui-popup__close:hover .ui-popup__close-icon {
  color: var(--icon-default);
}

/* Content */
.ui-popup__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--brand-scale-24, 24px);
  width: 100%;
}

.ui-popup__icon {
  flex-shrink: 0;
}

.ui-popup__text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--brand-scale-16, 16px);
  width: 100%;
  text-align: center;
}

.ui-popup__title {
  margin: 0;
  font-family: var(--font-family-headings);
  font-size: 18px !important;
  font-weight: var(--font-weight-semi-bold);
  line-height: 24px;
  color: var(--text-headings);
  text-transform: none !important;
  letter-spacing: normal !important;
}

.ui-popup__description {
  margin: 0;
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--body-line-height);
  color: var(--text-body);
}

/* Actions */
.ui-popup__actions {
  display: flex;
  gap: 8px;
  width: 100%;
}

.ui-popup__btn {
  flex: 1;
}

/* Transitions */
.ui-popup-fade-enter-active,
.ui-popup-fade-leave-active {
  transition: opacity 0.2s ease;
}

.ui-popup-fade-enter-from,
.ui-popup-fade-leave-to {
  opacity: 0;
}

.ui-popup-scale-enter-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ui-popup-scale-leave-active {
  transition: all 0.15s ease;
}

.ui-popup-scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.ui-popup-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
