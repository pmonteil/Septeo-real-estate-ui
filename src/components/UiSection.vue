<template>
  <div class="ui-section" :class="sectionClasses">
    <UiSectionTitle
      v-if="props.title"
      :title="props.title"
      :description="props.description"
      :type="props.headingType"
      :style="props.description ? 'with-description' : 'default'"
      :size="props.size"
      :has-icon="props.hasIcon"
      :icon="props.icon"
    >
      <template v-if="$slots.actions" #actions>
        <slot name="actions" />
      </template>
    </UiSectionTitle>

    <div class="ui-section__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component, type FunctionalComponent } from "vue";
import UiSectionTitle from "./UiSectionTitle.vue";

type HeadingType = "h1" | "h2" | "h3" | "h4";
type Size = "default" | "xs";
type IconProp = string | Component | FunctionalComponent;

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    headingType?: HeadingType;
    size?: Size;
    hasIcon?: boolean;
    icon?: IconProp;
    noPadding?: boolean;
  }>(),
  {
    headingType: "h2",
    size: "default",
    hasIcon: false,
    noPadding: false,
  }
);

const sectionClasses = computed(() => [
  `ui-section--${props.size}`,
  { "ui-section--no-padding": props.noPadding },
]);
</script>

<style scoped>
.ui-section {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.ui-section--default {
  gap: var(--spacing-xl);
  padding: var(--spacing-xl);
}

.ui-section--xs {
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
}

.ui-section--no-padding {
  padding: 0;
}

.ui-section__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}
</style>
