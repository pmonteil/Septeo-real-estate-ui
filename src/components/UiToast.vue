<template>
  <Transition name="ui-toast">
    <div v-if="visible" class="ui-toast" :class="toastClasses">
      <component
        v-if="iconComponent"
        :is="iconComponent"
        class="ui-toast__icon"
        :size="20"
        :stroke="2"
      />
      <div class="ui-toast__content">
        <span class="ui-toast__message">{{ props.message }}</span>
      </div>
      <button
        v-if="props.closable"
        class="ui-toast__close"
        type="button"
        @click="close"
      >
        <component :is="closeIcon" :size="18" :stroke="2" />
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  defineAsyncComponent,
  type Component,
} from "vue";

type ToastType = "notification" | "danger";

const props = withDefaults(
  defineProps<{
    message: string;
    type?: ToastType;
    closable?: boolean;
    duration?: number;
    modelValue?: boolean;
  }>(),
  {
    type: "notification",
    closable: true,
    duration: 5000,
    modelValue: true,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "close"): void;
}>();

const visible = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val;
  }
);

function close() {
  visible.value = false;
  emit("update:modelValue", false);
  emit("close");
}

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(close, props.duration);
  }
});

function toIconName(name: string): string {
  return (
    "Icon" +
    name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")
  );
}

function resolveIcon(name: string) {
  const iconName = toIconName(name);
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((module) => {
      const icons = module as unknown as Record<string, Component>;
      return icons[iconName] || { render: () => null };
    })
  );
}

const iconComponent = computed(() =>
  props.type === "danger"
    ? resolveIcon("alert-triangle")
    : resolveIcon("info-circle")
);

const closeIcon = resolveIcon("x");

const toastClasses = computed(() => [`ui-toast--${props.type}`]);
</script>

<style scoped>
.ui-toast {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg) var(--spacing-xl);
  border-radius: var(--radius-lg);
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  line-height: var(--body-line-height);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  max-width: 480px;
}

.ui-toast--notification {
  background-color: var(--alias-neutral-900);
  color: var(--alias-neutral-white);
}

.ui-toast--danger {
  background-color: var(--surface-danger);
  color: var(--text-danger);
  border: var(--alias-border-width-sm) solid var(--border-danger);
}

.ui-toast__icon {
  flex-shrink: 0;
}

.ui-toast--notification .ui-toast__icon {
  color: var(--alias-neutral-white);
}

.ui-toast--danger .ui-toast__icon {
  color: var(--icon-danger);
}

.ui-toast__content {
  flex: 1;
  min-width: 0;
}

.ui-toast__message {
  font-weight: var(--font-weight-medium);
}

.ui-toast__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.15s ease;
}

.ui-toast__close:hover {
  opacity: 1;
}

.ui-toast-enter-active,
.ui-toast-leave-active {
  transition: all 0.3s ease;
}

.ui-toast-enter-from,
.ui-toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
