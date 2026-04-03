<template>
  <div class="ui-stepper" :class="stepperClasses">
    <template v-for="(step, index) in props.steps" :key="index">
      <!-- Connector (between steps) -->
      <div
        v-if="index > 0"
        class="ui-stepper__connector"
        :class="{
          'ui-stepper__connector--completed': index < props.activeStep,
        }"
      />

      <!-- Step -->
      <div
        class="ui-stepper__step"
        :class="stepClasses(index)"
      >
        <div class="ui-stepper__indicator">
          <component
            v-if="index < props.activeStep"
            :is="checkIcon"
            :size="indicatorIconSize"
            :stroke="2.5"
          />
          <span v-else class="ui-stepper__number">{{ index + 1 }}</span>
        </div>

        <div class="ui-stepper__text">
          <span class="ui-stepper__label">{{ step.label }}</span>
          <span
            v-if="props.size === 'default' && step.description"
            class="ui-stepper__description"
          >
            {{ step.description }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from "vue";

type Size = "default" | "xs";

interface StepItem {
  label: string;
  description?: string;
}

const props = withDefaults(
  defineProps<{
    steps: StepItem[];
    activeStep?: number;
    size?: Size;
  }>(),
  {
    activeStep: 0,
    size: "default",
  }
);

const indicatorIconSize = computed(() => (props.size === "xs" ? 12 : 16));

function toIconName(name: string): string {
  return (
    "Icon" +
    name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")
  );
}

const checkIcon = defineAsyncComponent(() =>
  import("@tabler/icons-vue").then((module) => {
    const icons = module as unknown as Record<string, Component>;
    return icons[toIconName("check")] || { render: () => null };
  })
);

function stepClasses(index: number) {
  return {
    "ui-stepper__step--completed": index < props.activeStep,
    "ui-stepper__step--active": index === props.activeStep,
    "ui-stepper__step--upcoming": index > props.activeStep,
  };
}

const stepperClasses = computed(() => [`ui-stepper--${props.size}`]);
</script>

<style scoped>
.ui-stepper {
  display: flex;
  align-items: flex-start;
  width: 100%;
}

.ui-stepper__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  flex-shrink: 0;
}

.ui-stepper--xs .ui-stepper__step {
  gap: var(--spacing-sm);
}

.ui-stepper__connector {
  flex: 1;
  height: 2px;
  margin-top: 16px;
  background-color: var(--border-default);
  border-style: dashed;
}

.ui-stepper--xs .ui-stepper__connector {
  margin-top: 12px;
}

.ui-stepper__connector--completed {
  background-color: var(--alias-accent-default);
  border-style: solid;
}

.ui-stepper__indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-semi-bold);
}

.ui-stepper--default .ui-stepper__indicator {
  width: 32px;
  height: 32px;
  font-size: var(--body-font-size);
}

.ui-stepper--xs .ui-stepper__indicator {
  width: 24px;
  height: 24px;
  font-size: var(--body-small-font-size);
}

.ui-stepper__step--completed .ui-stepper__indicator {
  background-color: var(--alias-accent-default);
  color: var(--alias-neutral-white);
}

.ui-stepper__step--active .ui-stepper__indicator {
  background-color: transparent;
  border: 2px solid var(--alias-accent-default);
  color: var(--alias-accent-default);
}

.ui-stepper__step--upcoming .ui-stepper__indicator {
  background-color: transparent;
  border: 2px dashed var(--border-default);
  color: var(--text-body-secondary);
}

.ui-stepper__text {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--spacing-xs);
}

.ui-stepper__label {
  font-family: var(--font-family-body);
  font-size: var(--body-small-font-size);
  line-height: var(--body-small-line-height);
  color: var(--text-body-secondary);
}

.ui-stepper__step--active .ui-stepper__label {
  font-weight: var(--font-weight-semi-bold);
  color: var(--text-headings);
}

.ui-stepper__step--completed .ui-stepper__label {
  color: var(--text-body);
}

.ui-stepper--xs .ui-stepper__label {
  font-size: var(--caption-font-size);
  line-height: var(--caption-line-height);
}

.ui-stepper__description {
  font-family: var(--font-family-body);
  font-size: var(--caption-font-size);
  line-height: var(--caption-line-height);
  color: var(--text-body-secondary);
}

.ui-stepper__number {
  line-height: 1;
}
</style>
