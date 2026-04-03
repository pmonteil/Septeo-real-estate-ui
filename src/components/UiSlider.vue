<template>
  <div class="ui-slider" :class="sliderClasses">
    <!-- Label -->
    <div v-if="props.label" class="ui-slider__header">
      <span class="ui-slider__label">{{ props.label }}</span>
      <span v-if="props.showValue" class="ui-slider__value">{{ displayValue }}</span>
    </div>

    <!-- Track -->
    <div class="ui-slider__track-wrapper">
      <div
        v-if="props.style !== 'minimal' && props.showScale"
        class="ui-slider__scale"
      >
        <span class="ui-slider__scale-label">{{ props.min }}</span>
        <span class="ui-slider__scale-label">{{ props.max }}</span>
      </div>

      <div class="ui-slider__track" ref="trackRef" @click="onTrackClick">
        <div
          class="ui-slider__fill"
          :style="{ width: fillPercent + '%' }"
        />
        <div
          class="ui-slider__thumb"
          :style="{ left: fillPercent + '%' }"
          @mousedown="onThumbMouseDown"
          @touchstart.prevent="onThumbTouchStart"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

type SliderStyle = "default" | "minimal" | "no-scale";

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    showValue?: boolean;
    showScale?: boolean;
    style?: SliderStyle;
    disabled?: boolean;
    suffix?: string;
  }>(),
  {
    modelValue: 0,
    min: 0,
    max: 100,
    step: 1,
    showValue: true,
    showScale: true,
    style: "default",
    disabled: false,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const trackRef = ref<HTMLElement | null>(null);

const fillPercent = computed(() => {
  const range = props.max - props.min;
  if (range <= 0) return 0;
  return ((props.modelValue - props.min) / range) * 100;
});

const displayValue = computed(() => {
  const formatted = props.modelValue.toString();
  return props.suffix ? `${formatted}${props.suffix}` : formatted;
});

function valueFromPosition(clientX: number) {
  if (!trackRef.value) return props.modelValue;
  const rect = trackRef.value.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  const raw = props.min + pct * (props.max - props.min);
  const stepped = Math.round(raw / props.step) * props.step;
  return Math.max(props.min, Math.min(props.max, stepped));
}

function onTrackClick(e: MouseEvent) {
  if (props.disabled) return;
  emit("update:modelValue", valueFromPosition(e.clientX));
}

function onThumbMouseDown(e: MouseEvent) {
  if (props.disabled) return;
  e.preventDefault();

  const onMove = (ev: MouseEvent) => {
    emit("update:modelValue", valueFromPosition(ev.clientX));
  };
  const onUp = () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
  };
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
}

function onThumbTouchStart(e: TouchEvent) {
  if (props.disabled) return;

  const onMove = (ev: TouchEvent) => {
    emit("update:modelValue", valueFromPosition(ev.touches[0].clientX));
  };
  const onEnd = () => {
    window.removeEventListener("touchmove", onMove);
    window.removeEventListener("touchend", onEnd);
  };
  window.addEventListener("touchmove", onMove);
  window.addEventListener("touchend", onEnd);
}

const sliderClasses = computed(() => [
  `ui-slider--${props.style}`,
  { "ui-slider--disabled": props.disabled },
]);
</script>

<style scoped>
.ui-slider {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.ui-slider--disabled {
  opacity: var(--opacity-disabled);
  pointer-events: none;
}

.ui-slider__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.ui-slider__label {
  font-family: var(--font-family-body);
  font-size: var(--body-small-font-size);
  line-height: var(--body-small-line-height);
  font-weight: var(--font-weight-medium);
  color: var(--text-body);
}

.ui-slider__value {
  font-family: var(--font-family-body);
  font-size: var(--body-small-font-size);
  line-height: var(--body-small-line-height);
  font-weight: var(--font-weight-semi-bold);
  color: var(--text-headings);
}

.ui-slider__track-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.ui-slider__track {
  position: relative;
  width: 100%;
  height: 6px;
  background-color: var(--surface-default-bis);
  border-radius: var(--radius-full);
  cursor: pointer;
}

.ui-slider__fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: var(--alias-accent-default);
  border-radius: var(--radius-full);
  pointer-events: none;
}

.ui-slider__thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background-color: var(--surface-default);
  border: 2px solid var(--alias-accent-default);
  border-radius: var(--radius-full);
  cursor: grab;
  transition: box-shadow 0.15s ease;
  z-index: 1;
}

.ui-slider__thumb:hover {
  box-shadow: 0 0 0 4px rgba(255, 97, 54, 0.15);
}

.ui-slider__thumb:active {
  cursor: grabbing;
  box-shadow: 0 0 0 6px rgba(255, 97, 54, 0.2);
}

.ui-slider__scale {
  display: flex;
  justify-content: space-between;
}

.ui-slider__scale-label {
  font-family: var(--font-family-body);
  font-size: var(--caption-font-size);
  line-height: var(--caption-line-height);
  color: var(--text-body-secondary);
}
</style>
