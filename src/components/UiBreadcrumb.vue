<template>
  <nav class="ui-breadcrumb" aria-label="Breadcrumb">
    <ol class="ui-breadcrumb__list">
      <li
        v-for="(item, index) in props.items"
        :key="index"
        class="ui-breadcrumb__item"
      >
        <!-- Separator (except for first item) -->
        <component
          v-if="index > 0"
          :is="separatorIcon"
          class="ui-breadcrumb__separator"
          :size="14"
          :stroke="2"
        />

        <!-- Link item -->
        <UiLink
          :label="item.label"
          :href="item.href"
          :to="item.to"
          :icon-left="item.iconLeft"
          :icon-right="item.iconRight"
          :active="index === 0"
          :disabled="item.disabled"
          class="ui-breadcrumb__link"
          @click="(e) => onItemClick(e, item, index)"
        />
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from "vue";
import UiLink from "./UiLink.vue";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  to?: string | object;
  iconLeft?: string;
  iconRight?: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    items: BreadcrumbItem[];
    separator?: string;
  }>(),
  {
    separator: "chevron-right",
  }
);

const emit = defineEmits<{
  (e: "click", item: BreadcrumbItem, index: number): void;
}>();

// Convert icon name to PascalCase for @tabler/icons-vue
function toIconName(name: string): string {
  return (
    "Icon" +
    name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")
  );
}

// Resolve separator icon
const separatorIcon = computed(() => {
  const iconName = toIconName(props.separator);
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((module) => {
      const icons = module as unknown as Record<string, Component>;
      const iconComp = icons[iconName];
      if (!iconComp) {
        console.warn(
          `[UiBreadcrumb] Icon "${iconName}" not found in @tabler/icons-vue`
        );
        return { render: () => null };
      }
      return iconComp;
    })
  );
});

function onItemClick(event: MouseEvent, item: BreadcrumbItem, index: number) {
  emit("click", item, index);
}
</script>

<style scoped>
.ui-breadcrumb {
  display: inline-flex;
}

.ui-breadcrumb__list {
  display: flex;
  align-items: center;
  gap: var(--brand-scale-4);
  list-style: none;
  margin: 0;
  padding: 0;
}

.ui-breadcrumb__item {
  display: flex;
  align-items: center;
  gap: var(--brand-scale-4);
}

.ui-breadcrumb__separator {
  flex-shrink: 0;
  color: var(--alias-neutral-500);
}

.ui-breadcrumb__link {
  /* Override default link padding for breadcrumb context */
}
</style>




