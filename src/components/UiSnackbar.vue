<template>
  <Transition name="snackbar">
    <div
      v-if="isVisible"
      class="ui-snackbar"
      :class="rootClasses"
      role="alert"
      aria-live="polite"
    >
      <!-- Content -->
      <div class="ui-snackbar__content">
        <div class="ui-snackbar__main">
          <!-- Status Icon -->
          <component
            :is="statusIconComponent"
            class="ui-snackbar__status-icon"
            :size="20"
            :stroke="2"
          />

          <!-- Text Content -->
          <div class="ui-snackbar__text">
            <h3 class="ui-snackbar__title">{{ props.title }}</h3>
            <p class="ui-snackbar__message">{{ props.message }}</p>

            <!-- Link -->
            <button
              v-if="props.linkText"
              class="ui-snackbar__link"
              @click="onLinkClick"
            >
              <span>{{ props.linkText }}</span>
              <component
                :is="chevronIconComponent"
                class="ui-snackbar__link-icon"
                :size="18"
                :stroke="2"
              />
            </button>
          </div>
        </div>

        <!-- Close Button -->
        <button
          class="ui-snackbar__close"
          @click="close"
          aria-label="Fermer"
        >
          <component
            :is="closeIconComponent"
            :size="22"
            :stroke="2.5"
          />
        </button>
      </div>

      <!-- Progress Bar -->
      <div v-if="props.showProgress" class="ui-snackbar__progress-track">
        <div
          class="ui-snackbar__progress-bar"
          :style="progressStyle"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch,
  defineAsyncComponent,
  type Component,
} from "vue";

type SnackbarStatus = "default" | "success" | "error" | "warning";

const props = withDefaults(
  defineProps<{
    title?: string;
    message?: string;
    status?: SnackbarStatus;
    duration?: number;
    showProgress?: boolean;
    linkText?: string;
    modelValue?: boolean;
  }>(),
  {
    title: "Notification",
    message: "",
    status: "default",
    duration: 5000,
    showProgress: true,
    linkText: "",
    modelValue: true,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "close"): void;
  (e: "link-click"): void;
}>();

const isVisible = ref(props.modelValue);
const progress = ref(0);
let progressInterval: ReturnType<typeof setInterval> | null = null;

watch(
  () => props.modelValue,
  (newVal) => {
    isVisible.value = newVal;
    if (newVal) {
      startProgress();
    } else {
      stopProgress();
    }
  }
);

const rootClasses = computed(() => [
  `ui-snackbar--${props.status}`,
]);

const progressStyle = computed(() => ({
  width: `${progress.value}%`,
  transition: progress.value === 0 ? "none" : "width 100ms linear",
}));

const statusIconMap: Record<SnackbarStatus, string> = {
  default: "info-circle",
  success: "circle-check",
  error: "alert-circle",
  warning: "alert-triangle",
};

function toIconName(name: string): string {
  return (
    "Icon" +
    name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")
  );
}

function resolveIcon(iconName: string) {
  const componentName = toIconName(iconName);
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((module) => {
      const icons = module as unknown as Record<string, Component>;
      const iconComp = icons[componentName];
      if (!iconComp) {
        console.warn(`[UiSnackbar] Icon "${componentName}" not found`);
        return { render: () => null };
      }
      return iconComp;
    })
  );
}

const statusIconComponent = computed(() =>
  resolveIcon(statusIconMap[props.status])
);
const closeIconComponent = computed(() => resolveIcon("x"));
const chevronIconComponent = computed(() => resolveIcon("chevron-right"));

function startProgress() {
  progress.value = 0;
  stopProgress();

  const intervalTime = 100;
  const steps = props.duration / intervalTime;
  const increment = 100 / steps;

  progressInterval = setInterval(() => {
    progress.value += increment;
    if (progress.value >= 100) {
      progress.value = 100;
      stopProgress();
      close();
    }
  }, intervalTime);
}

function stopProgress() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

function close() {
  isVisible.value = false;
  emit("update:modelValue", false);
  emit("close");
}

function onLinkClick() {
  emit("link-click");
}

onMounted(() => {
  if (props.modelValue) {
    startProgress();
  }
});

onUnmounted(() => {
  stopProgress();
});
</script>

<style scoped>
.ui-snackbar {
  position: relative;
  width: 380px;
  background-color: var(--surface-default);
  border: var(--alias-border-width-sm) solid var(--border-default-light);
  border-radius: var(--alias-border-radius-md);
  box-shadow: 0px 8px 100px -50px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  padding: 20px;
  padding-bottom: 24px;
}

.ui-snackbar__content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--gap-field-label);
}

.ui-snackbar__main {
  display: flex;
  gap: var(--gap-field-label);
  flex: 1;
  min-width: 0;
}

.ui-snackbar__status-icon {
  flex-shrink: 0;
}

.ui-snackbar__text {
  display: flex;
  flex-direction: column;
  gap: var(--brand-scale-16);
  flex: 1;
  min-width: 0;
}

.ui-snackbar__title {
  font-family: var(--font-family-headings);
  font-size: var(--h2-font-size);
  font-weight: var(--font-weight-semi-bold);
  line-height: var(--h2-line-height);
  margin: 0;
}

.ui-snackbar__message {
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--body-line-height);
  color: var(--text-body);
  margin: 0;
}

.ui-snackbar__link {
  display: inline-flex;
  align-items: center;
  gap: var(--gap-icon-text);
  padding: var(--brand-scale-4) 0;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-line-height);
  transition: opacity 0.2s ease;
}

.ui-snackbar__link:hover {
  opacity: 0.8;
}

.ui-snackbar__link-icon {
  flex-shrink: 0;
}

.ui-snackbar__close {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--icon-secondary);
  transition: color 0.2s ease, transform 0.2s ease;
  border-radius: var(--alias-border-radius-md);
}

.ui-snackbar__close:hover {
  color: var(--icon-default);
  transform: scale(1.15);
}

.ui-snackbar__progress-track {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 6px;
  border-radius: 2px;
  overflow: hidden;
}

.ui-snackbar__progress-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 100px;
}

/* DEFAULT (Blue) */
.ui-snackbar--default .ui-snackbar__status-icon {
  color: var(--text-information);
}

.ui-snackbar--default .ui-snackbar__title {
  color: var(--text-information);
}

.ui-snackbar--default .ui-snackbar__link {
  color: var(--text-information);
}

.ui-snackbar--default .ui-snackbar__progress-track {
  background-color: var(--surface-information);
}

.ui-snackbar--default .ui-snackbar__progress-bar {
  background-color: var(--text-information);
}

/* SUCCESS (Green) */
.ui-snackbar--success .ui-snackbar__status-icon {
  color: var(--icon-success);
}

.ui-snackbar--success .ui-snackbar__title {
  color: var(--text-success);
}

.ui-snackbar--success .ui-snackbar__link {
  color: var(--text-success);
}

.ui-snackbar--success .ui-snackbar__progress-track {
  background-color: var(--surface-success);
}

.ui-snackbar--success .ui-snackbar__progress-bar {
  background-color: var(--icon-success);
}

/* ERROR (Red) */
.ui-snackbar--error .ui-snackbar__status-icon {
  color: var(--icon-error);
}

.ui-snackbar--error .ui-snackbar__title {
  color: var(--text-error);
}

.ui-snackbar--error .ui-snackbar__link {
  color: var(--text-error);
}

.ui-snackbar--error .ui-snackbar__progress-track {
  background-color: var(--surface-error);
}

.ui-snackbar--error .ui-snackbar__progress-bar {
  background-color: var(--icon-error);
}

/* WARNING (Orange) */
.ui-snackbar--warning .ui-snackbar__status-icon {
  color: var(--icon-warning);
}

.ui-snackbar--warning .ui-snackbar__title {
  color: var(--text-warning);
}

.ui-snackbar--warning .ui-snackbar__link {
  color: var(--text-warning);
}

.ui-snackbar--warning .ui-snackbar__progress-track {
  background-color: var(--surface-warning);
}

.ui-snackbar--warning .ui-snackbar__progress-bar {
  background-color: var(--icon-warning);
}

/* TRANSITIONS */
.snackbar-enter-active {
  animation: snackbar-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.snackbar-leave-active {
  animation: snackbar-out 0.35s cubic-bezier(0.4, 0, 1, 1) forwards;
}

@keyframes snackbar-in {
  0% {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes snackbar-out {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
}
</style>

