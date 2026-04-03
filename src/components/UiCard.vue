<template>
  <div class="ui-card" :class="cardClasses">
    <!-- Media Top -->
    <div v-if="props.type === 'media-top' && props.showMedia" class="ui-card__media ui-card__media--top">
      <slot name="media" />
    </div>

    <div class="ui-card__body" :class="bodyLayoutClass">
      <!-- Media Left -->
      <div v-if="props.type === 'media-left' && props.showMedia" class="ui-card__media ui-card__media--left">
        <slot name="media" />
      </div>

      <div class="ui-card__inner">
        <!-- Header Slot -->
        <div v-if="props.showHeader && props.type !== 'minimal'" class="ui-card__header">
          <slot name="header">
            <div v-if="props.title || props.subtitle" class="ui-card__header-text">
              <h3 v-if="props.title" class="ui-card__title">{{ props.title }}</h3>
              <p v-if="props.subtitle" class="ui-card__subtitle">{{ props.subtitle }}</p>
            </div>
          </slot>
        </div>

        <!-- Content -->
        <div v-if="props.type !== 'minimal'" class="ui-card__content">
          <slot />
        </div>

        <!-- Minimal Content Slot -->
        <div v-if="props.type === 'minimal' && props.showContent" class="ui-card__content">
          <slot />
        </div>

        <!-- Footer Slot -->
        <div v-if="props.showFooter && props.type !== 'minimal'" class="ui-card__footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type CardType = "default" | "media-top" | "media-left" | "minimal";

const props = withDefaults(
  defineProps<{
    type?: CardType;
    title?: string;
    subtitle?: string;
    showHeader?: boolean;
    showFooter?: boolean;
    showMedia?: boolean;
    showContent?: boolean;
  }>(),
  {
    type: "default",
    showHeader: true,
    showFooter: true,
    showMedia: true,
    showContent: true,
  }
);

const cardClasses = computed(() => [`ui-card--${props.type}`]);

const bodyLayoutClass = computed(() => ({
  "ui-card__body--horizontal": props.type === "media-left",
}));
</script>

<style scoped>
.ui-card {
  display: flex;
  flex-direction: column;
  background-color: var(--surface-default);
  border: var(--alias-border-width-sm) solid var(--border-default);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.ui-card:hover {
  border-color: var(--border-action);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.ui-card__media {
  overflow: hidden;
}

.ui-card__media--top {
  width: 100%;
  min-height: 160px;
  background-color: var(--surface-default-bis);
}

.ui-card__media--top :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ui-card__media--left {
  width: 200px;
  min-height: 100%;
  flex-shrink: 0;
  background-color: var(--surface-default-bis);
}

.ui-card__media--left :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ui-card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.ui-card__body--horizontal {
  flex-direction: row;
}

.ui-card__inner {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  flex: 1;
  min-width: 0;
}

.ui-card__header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.ui-card__header-text {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 0;
}

.ui-card__title {
  margin: 0;
  font-family: var(--font-family-headings);
  font-size: var(--h2-font-size);
  font-weight: var(--font-weight-semi-bold);
  line-height: var(--h2-line-height);
  color: var(--text-headings);
}

.ui-card__subtitle {
  margin: 0;
  font-family: var(--font-family-body);
  font-size: var(--body-small-font-size);
  line-height: var(--body-small-line-height);
  color: var(--text-body-secondary);
}

.ui-card__content {
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  line-height: var(--body-line-height);
  color: var(--text-body);
}

.ui-card__footer {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: auto;
}
</style>
