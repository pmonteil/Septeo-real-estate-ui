<template>
  <nav class="ui-pagination" :class="paginationClasses">
    <!-- Previous arrow -->
    <button
      class="ui-pagination__item ui-pagination__item--arrow"
      :class="{ 'ui-pagination__item--disabled': currentPage <= 1 }"
      :disabled="currentPage <= 1"
      @click="goTo(currentPage - 1)"
    >
      <component :is="chevronLeftIcon" :size="iconSize" :stroke="2" />
    </button>

    <!-- Page items -->
    <template v-for="item in pageItems" :key="item.key">
      <span
        v-if="item.type === 'ellipsis'"
        class="ui-pagination__item ui-pagination__item--ellipsis"
      >
        &hellip;
      </span>
      <button
        v-else
        class="ui-pagination__item ui-pagination__item--page"
        :class="{
          'ui-pagination__item--active': item.page === currentPage,
        }"
        @click="goTo(item.page!)"
      >
        {{ item.page }}
      </button>
    </template>

    <!-- Next arrow -->
    <button
      class="ui-pagination__item ui-pagination__item--arrow"
      :class="{ 'ui-pagination__item--disabled': currentPage >= totalPages }"
      :disabled="currentPage >= totalPages"
      @click="goTo(currentPage + 1)"
    >
      <component :is="chevronRightIcon" :size="iconSize" :stroke="2" />
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from "vue";

type Size = "default" | "xs";
type PageItem = { type: "page" | "ellipsis"; page?: number; key: string };

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    totalPages: number;
    size?: Size;
    siblingCount?: number;
  }>(),
  {
    modelValue: 1,
    size: "default",
    siblingCount: 1,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", page: number): void;
}>();

const currentPage = computed(() => props.modelValue);

const iconSize = computed(() => (props.size === "xs" ? 14 : 16));

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

const chevronLeftIcon = resolveIcon("chevron-left");
const chevronRightIcon = resolveIcon("chevron-right");

const pageItems = computed<PageItem[]>(() => {
  const total = props.totalPages;
  const current = currentPage.value;
  const sibling = props.siblingCount;
  const items: PageItem[] = [];

  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const leftSiblingIndex = Math.max(current - sibling, 1);
  const rightSiblingIndex = Math.min(current + sibling, total);

  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < total - 1;

  if (!showLeftDots && showRightDots) {
    const leftRange = range(1, Math.max(3, 1 + 2 * sibling));
    leftRange.forEach((p) =>
      items.push({ type: "page", page: p, key: `p${p}` })
    );
    items.push({ type: "ellipsis", key: "dots-r" });
    items.push({ type: "page", page: total, key: `p${total}` });
  } else if (showLeftDots && !showRightDots) {
    items.push({ type: "page", page: 1, key: "p1" });
    items.push({ type: "ellipsis", key: "dots-l" });
    const rightRange = range(Math.min(total - 2, total - 2 * sibling), total);
    rightRange.forEach((p) =>
      items.push({ type: "page", page: p, key: `p${p}` })
    );
  } else if (showLeftDots && showRightDots) {
    items.push({ type: "page", page: 1, key: "p1" });
    items.push({ type: "ellipsis", key: "dots-l" });
    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    middleRange.forEach((p) =>
      items.push({ type: "page", page: p, key: `p${p}` })
    );
    items.push({ type: "ellipsis", key: "dots-r" });
    items.push({ type: "page", page: total, key: `p${total}` });
  } else {
    range(1, total).forEach((p) =>
      items.push({ type: "page", page: p, key: `p${p}` })
    );
  }

  return items;
});

function goTo(page: number) {
  if (page < 1 || page > props.totalPages) return;
  emit("update:modelValue", page);
}

const paginationClasses = computed(() => [`ui-pagination--${props.size}`]);
</script>

<style scoped>
.ui-pagination {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.ui-pagination__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: var(--radius-sm);
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-medium);
  color: var(--text-body);
  transition: all 0.15s ease;
}

.ui-pagination--default .ui-pagination__item {
  width: 28px;
  height: 28px;
  font-size: var(--body-small-font-size);
}

.ui-pagination--xs .ui-pagination__item {
  width: 24px;
  height: 24px;
  font-size: var(--caption-font-size);
}

.ui-pagination__item--page:hover:not(.ui-pagination__item--active) {
  background-color: var(--surface-neutral-hover);
}

.ui-pagination__item--active {
  background: var(--gradient-menu-active);
  color: var(--text-on-action);
  font-weight: var(--font-weight-semi-bold);
  border-radius: var(--radius-md);
}

.ui-pagination__item--arrow {
  color: var(--icon-secondary);
}

.ui-pagination__item--arrow:hover:not(:disabled) {
  color: var(--icon-action);
}

.ui-pagination__item--disabled {
  opacity: var(--opacity-disabled);
  pointer-events: none;
  cursor: not-allowed;
}

.ui-pagination__item--ellipsis {
  cursor: default;
  color: var(--text-body-secondary);
}
</style>
