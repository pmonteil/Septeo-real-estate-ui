<template>
  <header class="ui-page-header">
    <div class="ui-page-header__row">
      <!-- Left: Title area -->
      <div class="ui-page-header__title-area">
        <button
          v-if="props.hasBack"
          class="ui-page-header__back"
          type="button"
          @click="$emit('back')"
        >
          <component :is="backIcon" :size="20" :stroke="2" />
        </button>
        <div class="ui-page-header__title-text">
          <h1 class="ui-page-header__title">{{ props.title }}</h1>
          <p v-if="props.subtitle" class="ui-page-header__subtitle">
            {{ props.subtitle }}
          </p>
        </div>
      </div>

      <!-- Center: Content slot (estimation widget, etc.) -->
      <div v-if="$slots.content" class="ui-page-header__content">
        <slot name="content" />
      </div>

      <!-- Right: Actions -->
      <div v-if="$slots.actions" class="ui-page-header__actions">
        <slot name="actions" />
      </div>
    </div>

    <!-- Tab bar -->
    <div v-if="$slots.tabs" class="ui-page-header__tabs">
      <slot name="tabs" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { defineAsyncComponent, type Component } from "vue";

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    hasBack?: boolean;
  }>(),
  {
    hasBack: false,
  }
);

defineEmits<{
  (e: "back"): void;
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

const backIcon = defineAsyncComponent(() =>
  import("@tabler/icons-vue").then((module) => {
    const icons = module as unknown as Record<string, Component>;
    return icons[toIconName("arrow-left")] || { render: () => null };
  })
);
</script>

<style scoped>
.ui-page-header {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--surface-default);
  border-bottom: var(--alias-border-width-sm) solid var(--border-default-light);
  padding: var(--spacing-xl) var(--spacing-3xl);
  gap: var(--spacing-lg);
}

.ui-page-header__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xl);
}

.ui-page-header__title-area {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  min-width: 0;
  max-width: 250px;
}

.ui-page-header__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  padding: var(--spacing-sm);
  cursor: pointer;
  color: var(--icon-default);
  border-radius: var(--radius-sm);
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.ui-page-header__back:hover {
  background-color: var(--surface-neutral-hover);
  color: var(--icon-action);
}

.ui-page-header__title-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.ui-page-header__title {
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

.ui-page-header__subtitle {
  margin: 0;
  font-family: var(--font-family-body);
  font-size: var(--body-small-font-size);
  line-height: var(--body-small-line-height);
  color: var(--text-body-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ui-page-header__content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ui-page-header__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-shrink: 0;
}

.ui-page-header__tabs {
  margin: 0 calc(-1 * var(--spacing-3xl));
  padding: 0 var(--spacing-3xl);
}
</style>
