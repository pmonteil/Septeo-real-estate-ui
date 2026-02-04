<template>
  <div class="ui-table">
    <!-- Header with title and toolbar -->
    <div v-if="title || $slots.toolbar" class="ui-table__header">
      <h3 v-if="title" class="ui-table__title">{{ title }}</h3>
      <div class="ui-table__toolbar">
        <slot name="toolbar">
          <UiButton
            v-for="(action, index) in toolbarActions"
            :key="index"
            :icon="action.icon"
            :variant="action.primary ? 'third' : 'secondary'"
            size="sm"
            @click="$emit('toolbar-action', action.name)"
          />
        </slot>
      </div>
    </div>

    <!-- Table content -->
    <div class="ui-table__container">
      <table class="ui-table__table">
        <thead v-if="showHeader">
          <tr class="ui-table__row ui-table__row--header">
            <th
              v-for="(column, colIndex) in columns"
              :key="colIndex"
              class="ui-table__th"
              :class="{
                'ui-table__th--sortable':
                  column.sortable !== false && column.type !== 'action',
                'ui-table__th--sorted': sortKey === column.key,
                'ui-table__th--action': column.type === 'action',
              }"
              :style="{ width: column.width }"
              @click="
                column.sortable !== false &&
                  column.type !== 'action' &&
                  handleSort(column.key)
              "
            >
              <div class="ui-table__th-content">
                <component
                  v-if="column.icon"
                  :is="resolveIcon(column.icon)"
                  class="ui-table__th-icon"
                  :size="14"
                  :stroke="2"
                />
                <span class="ui-table__th-text">{{ column.label }}</span>
                <component
                  v-if="column.sortable !== false && column.type !== 'action'"
                  :is="resolveIcon('chevron-down')"
                  class="ui-table__th-sort-icon"
                  :class="{
                    'ui-table__th-sort-icon--active': sortKey === column.key,
                  }"
                  :size="14"
                  :stroke="2"
                />
              </div>
            </th>
          </tr>
        </thead>
        <TransitionGroup tag="tbody" name="table-row">
          <tr
            v-for="(row, rowIndex) in sortedRows"
            :key="getRowKey(row, rowIndex)"
            class="ui-table__row"
            :class="{ 'ui-table__row--clickable': rowClickable }"
            @click="rowClickable && $emit('row-click', row, rowIndex)"
          >
            <td
              v-for="(column, colIndex) in columns"
              :key="colIndex"
              class="ui-table__td"
              :class="{ 'ui-table__td--action': column.type === 'action' }"
            >
              <UiTableCell
                :type="column.type || 'text'"
                :value="getCellValue(row, column)"
                :icon-left="column.iconLeft"
                :icon-right="column.iconRight"
                :link-icon-left="column.linkIconLeft"
                :link-icon-right="column.linkIconRight"
                :href="column.href ? row[column.href] : undefined"
                :to="column.to ? row[column.to] : undefined"
                :actions="column.actions"
                :pill-label="
                  column.type === 'pill' ? getCellValue(row, column) : undefined
                "
                :pill-icon="
                  column.pillIcon
                    ? row[column.pillIcon]
                    : column.pillIconDefault
                "
                :pill-color="
                  column.pillColor
                    ? row[column.pillColor]
                    : column.pillColorDefault
                "
                @action="
                  (name) =>
                    $emit('cell-action', {
                      action: name,
                      row,
                      rowIndex,
                      column,
                    })
                "
              />
            </td>
          </tr>
        </TransitionGroup>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, type Component } from "vue";
import UiTableCell from "./UiTableCell.vue";
import UiButton from "./UiButton.vue";

type CellType = "text" | "link" | "action" | "pill";
type PillColor = "blue" | "red" | "orange" | "green" | "purple" | "grey";
type SortDirection = "asc" | "desc";

interface ToolbarAction {
  name: string;
  icon: string;
  primary?: boolean;
}

interface TableColumn {
  key: string;
  label: string;
  type?: CellType;
  width?: string;
  sortable?: boolean;
  // Header icon (left of label)
  icon?: string;
  // Text options
  iconLeft?: string;
  iconRight?: string;
  // Link options
  linkIconLeft?: string;
  linkIconRight?: string;
  href?: string;
  to?: string;
  // Action options
  actions?: { name: string; icon: string; secondary?: boolean }[];
  // Pill options
  pillIcon?: string;
  pillIconDefault?: string;
  pillColor?: string;
  pillColorDefault?: PillColor;
}

interface TableRow {
  [key: string]: unknown;
}

const props = withDefaults(
  defineProps<{
    title?: string;
    columns: TableColumn[];
    rows: TableRow[];
    showHeader?: boolean;
    rowClickable?: boolean;
    toolbarActions?: ToolbarAction[];
  }>(),
  {
    title: "",
    showHeader: true,
    rowClickable: false,
    toolbarActions: () => [
      { name: "filter", icon: "dots-vertical" },
      { name: "filter2", icon: "dots-vertical" },
      { name: "filter3", icon: "dots-vertical" },
      { name: "filter4", icon: "dots-vertical" },
      { name: "download", icon: "download" },
      { name: "add", icon: "plus", primary: true },
    ],
  }
);

const emit = defineEmits<{
  (e: "toolbar-action", name: string): void;
  (e: "row-click", row: TableRow, index: number): void;
  (
    e: "cell-action",
    payload: {
      action: string;
      row: TableRow;
      rowIndex: number;
      column: TableColumn;
    }
  ): void;
  (e: "sort", key: string, direction: SortDirection): void;
}>();

const sortKey = ref<string | null>(null);
const sortDirection = ref<SortDirection>("desc");

function toIconName(name: string): string {
  return (
    "Icon" +
    name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")
  );
}

function resolveIcon(icon: string) {
  const iconName = toIconName(icon);
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((module) => {
      const icons = module as unknown as Record<string, Component>;
      const iconComp = icons[iconName];
      if (!iconComp) {
        console.warn(
          `[UiTable] Icon "${iconName}" not found in @tabler/icons-vue`
        );
        return { render: () => null };
      }
      return iconComp;
    })
  );
}

function getCellValue(row: TableRow, column: TableColumn): string {
  const value = row[column.key];
  return value !== undefined && value !== null ? String(value) : "";
}

function getRowKey(row: TableRow, index: number): string {
  // Try to use a unique identifier from the row data
  if (row.id !== undefined) return String(row.id);
  if (row.reference !== undefined) return String(row.reference);
  // Fallback: create a key from all values
  return Object.values(row).join("-") || String(index);
}

function handleSort(key: string) {
  if (sortKey.value === key) {
    // Toggle: if already sorted by this column, reset to no sort
    sortKey.value = null;
    sortDirection.value = "desc";
  } else {
    // Sort by this column
    sortKey.value = key;
    sortDirection.value = "desc";
  }
  emit("sort", sortKey.value || "", sortDirection.value);
}

const sortedRows = computed(() => {
  if (!sortKey.value) return props.rows;

  return [...props.rows].sort((a, b) => {
    const aVal = a[sortKey.value!];
    const bVal = b[sortKey.value!];

    // Handle null/undefined
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return sortDirection.value === "asc" ? -1 : 1;
    if (bVal == null) return sortDirection.value === "asc" ? 1 : -1;

    // Compare values
    let comparison = 0;
    if (typeof aVal === "number" && typeof bVal === "number") {
      comparison = aVal - bVal;
    } else {
      comparison = String(aVal).localeCompare(String(bVal));
    }

    return sortDirection.value === "asc" ? comparison : -comparison;
  });
});
</script>

<style scoped>
.ui-table {
  display: flex;
  flex-direction: column;
  gap: var(--scale-16, 16px);
  background-color: var(--surface-default);
}

.ui-table__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ui-table__title {
  font-family: var(--font-family-headings);
  font-size: var(--h3-font-size);
  font-weight: var(--font-weight-semi-bold);
  line-height: var(--h3-line-height);
  color: var(--text-body);
  margin: 0;
}

.ui-table__toolbar {
  display: flex;
  align-items: center;
  gap: var(--gap-icon-text, 4px);
}

/* Table container with 8px radius */
.ui-table__container {
  border: var(--alias-border-width-sm, 1px) solid var(--border-default-light);
  border-radius: var(--border-radius-lg, 8px);
  overflow: hidden;
}

.ui-table__table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}

/* Responsive: scrollable table below 768px */
@media (max-width: 768px) {
  .ui-table__container {
    overflow-x: auto;
    overflow-y: hidden;
  }

  .ui-table__table {
    width: auto;
    table-layout: auto;
  }

  .ui-table__th,
  .ui-table__td {
    white-space: nowrap;
    width: auto;
  }

  /* Sticky action column */
  .ui-table__th--action,
  .ui-table__td--action {
    position: sticky;
    right: 0;
    background-color: var(--surface-default);
    box-shadow: -4px 0 8px -4px rgba(0, 0, 0, 0.1);
  }

  .ui-table__th--action {
    z-index: 2;
  }

  .ui-table__td--action {
    z-index: 1;
  }

  /* Custom scrollbar for horizontal scroll */
  .ui-table__container::-webkit-scrollbar {
    height: 6px;
  }

  .ui-table__container::-webkit-scrollbar-track {
    background: var(--surface-hover);
    border-radius: 3px;
  }

  .ui-table__container::-webkit-scrollbar-thumb {
    background: var(--border-default);
    border-radius: 3px;
  }

  .ui-table__container::-webkit-scrollbar-thumb:hover {
    background: var(--text-body-secondary);
  }
}

.ui-table__row {
  display: table-row;
}

/* Table row transition animations */
.table-row-move {
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.table-row-enter-active {
  transition: all 0.3s ease-out;
}

.table-row-leave-active {
  transition: all 0.2s ease-in;
  display: none;
}

.table-row-enter-from {
  opacity: 0;
  background-color: var(--surface-light-action);
}

.table-row-enter-to {
  opacity: 1;
  background-color: transparent;
}

.ui-table__row--clickable {
  cursor: pointer;
}

.ui-table__row--clickable:hover {
  background-color: var(--surface-hover);
}

/* Header cells (th) */
.ui-table__th {
  padding: var(--scale-8, 8px) var(--scale-12, 12px);
  border-bottom: var(--alias-border-width-sm, 1px) solid
    var(--border-default-light);
  text-align: left;
  vertical-align: middle;
  background-color: var(--surface-default);
  transition: background-color 0.15s ease;
}

.ui-table__th--sortable {
  cursor: pointer;
  user-select: none;
}

.ui-table__th--sortable:hover {
  background-color: var(--surface-hover);
}

.ui-table__th--sortable:hover .ui-table__th-icon {
  color: var(--icon-action);
  transform: scale(1.1);
}

.ui-table__th--sortable:hover .ui-table__th-text {
  color: var(--text-action);
}

.ui-table__th--sortable:hover .ui-table__th-sort-icon {
  color: var(--icon-action);
}

.ui-table__th--sorted {
  background-color: var(--surface-light-action);
}

.ui-table__th--sorted .ui-table__th-text,
.ui-table__th--sorted .ui-table__th-sort-icon {
  color: var(--icon-action);
}

.ui-table__th-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 30px;
}

.ui-table__th-icon {
  flex-shrink: 0;
  color: var(--text-body-secondary);
  transition: color 0.15s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ui-table__th--sorted .ui-table__th-icon {
  color: var(--icon-action);
}

.ui-table__th-text {
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-semi-bold);
  line-height: var(--body-line-height);
  color: var(--text-body);
  flex: 1;
  transition: color 0.15s ease;
}

.ui-table__th-sort-icon {
  flex-shrink: 0;
  color: var(--text-body-secondary);
  transition: transform 0.2s ease, color 0.15s ease;
}

.ui-table__th-sort-icon--active {
  transform: rotate(180deg);
}

/* Body cells (td) */
.ui-table__td {
  padding: var(--scale-8, 8px) var(--scale-12, 12px);
  border-bottom: var(--alias-border-width-sm, 1px) solid
    var(--border-default-light);
  vertical-align: middle;
}

.ui-table__row:last-child .ui-table__td {
  border-bottom: none;
}

.ui-table__td--action {
  text-align: right;
  width: 1%;
  white-space: nowrap;
}

/* Column borders */
.ui-table__table th:not(:last-child),
.ui-table__table td:not(:last-child) {
  border-right: var(--alias-border-width-sm, 1px) solid
    var(--border-default-light);
}
</style>
