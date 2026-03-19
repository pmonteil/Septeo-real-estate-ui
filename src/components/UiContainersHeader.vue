<template>
  <div class="ui-containers-header" :class="rootClasses">
    <div class="ui-containers-header__content">
      <div class="ui-containers-header__title-area">
        <button
          v-if="props.showBackButton"
          class="ui-containers-header__back"
          type="button"
          @click="emit('back')"
        >
          <component
            :is="backIcon"
            :size="14"
            :stroke="2"
          />
        </button>

        <span class="ui-containers-header__title">{{ props.title }}</span>

        <div v-if="$slots.state" class="ui-containers-header__state">
          <slot name="state" />
        </div>
      </div>

      <div v-if="$slots.tabs" class="ui-containers-header__tabs">
        <slot name="tabs" />
      </div>

      <div v-if="$slots.actions" class="ui-containers-header__actions">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from "vue";

type HeaderSize = "default" | "xs";

const props = withDefaults(
  defineProps<{
    title?: string;
    size?: HeaderSize;
    showBackButton?: boolean;
  }>(),
  {
    title: "",
    size: "default",
    showBackButton: true,
  }
);

const emit = defineEmits<{
  (e: "back"): void;
}>();

const rootClasses = computed(() => ({
  "ui-containers-header--xs": props.size === "xs",
}));

const backIcon = defineAsyncComponent(() =>
  import("@tabler/icons-vue").then((mod) => {
    const icons = mod as unknown as Record<string, Component>;
    return icons["IconChevronLeft"] || { render: () => null };
  })
);
</script>

<style scoped>
.ui-containers-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: var(--alias-border-width-sm) solid var(--border-default);
  box-sizing: border-box;
}

.ui-containers-header--xs {
  padding: 8px 16px;
}

.ui-containers-header__content {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.ui-containers-header__title-area {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.ui-containers-header__back {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  min-height: 28px;
  padding: var(--button-xs-padding-y) var(--button-xs-padding-x);
  background-color: var(--surface-default);
  border: var(--alias-border-width-sm) solid var(--border-default-light);
  border-radius: var(--alias-border-radius-sm);
  cursor: pointer;
  color: var(--icon-default);
  flex-shrink: 0;
  transition: border-color 0.15s ease;
}

.ui-containers-header__back:hover {
  border-color: var(--border-default);
}

.ui-containers-header__title {
  font-family: var(--font-family-headings);
  font-size: var(--h2-font-size);
  font-weight: var(--font-weight-semi-bold);
  line-height: var(--h2-line-height);
  color: var(--text-body);
  white-space: nowrap;
  flex-shrink: 0;
}

.ui-containers-header--xs .ui-containers-header__title {
  font-size: var(--h3-font-size);
  line-height: var(--h3-line-height);
}

.ui-containers-header__state {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  min-width: 0;
}

.ui-containers-header__tabs {
  flex-shrink: 0;
}

.ui-containers-header__actions {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  min-width: 0;
}
</style>
