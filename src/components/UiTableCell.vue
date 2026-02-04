<template>
  <!-- Type: text -->
  <div v-if="type === 'text'" class="ui-table-cell ui-table-cell--text">
    <div class="ui-table-cell__content">
      <component
        v-if="iconLeft"
        :is="iconLeftComponent"
        class="ui-table-cell__icon ui-table-cell__icon--left"
        :size="18"
        :stroke="2"
      />
      <span class="ui-table-cell__text">{{ value }}</span>
      <component
        v-if="iconRight"
        :is="iconRightComponent"
        class="ui-table-cell__icon ui-table-cell__icon--right"
        :size="14"
        :stroke="2"
      />
    </div>
  </div>

  <!-- Type: link -->
  <div v-else-if="type === 'link'" class="ui-table-cell ui-table-cell--link">
    <UiLink
      :label="value"
      :icon-left="linkIconLeft"
      :icon-right="linkIconRight"
      :href="href"
      :to="to"
    />
  </div>

  <!-- Type: action -->
  <div
    v-else-if="type === 'action'"
    class="ui-table-cell ui-table-cell--action"
  >
    <div class="ui-table-cell__actions">
      <UiButton
        v-for="(action, index) in actions"
        :key="index"
        :icon="action.icon"
        :variant="getActionVariant(action)"
        size="sm"
        :class="getActionClasses(action)"
        @click.stop="$emit('action', action.name)"
      />
    </div>
  </div>

  <!-- Type: pill -->
  <div v-else-if="type === 'pill'" class="ui-table-cell ui-table-cell--pill">
    <UiPill :label="pillLabel" :icon="pillIcon" :color="pillColor" />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  type Component,
  type FunctionalComponent,
} from "vue";
import UiLink from "./UiLink.vue";
import UiButton from "./UiButton.vue";
import UiPill from "./UiPill.vue";

type IconProp = string | Component | FunctionalComponent;
type CellType = "text" | "link" | "action" | "pill";
type PillColor = "blue" | "red" | "orange" | "green" | "purple" | "grey";

type ActionVariant = "ghost" | "error" | "transparent";
type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "error"
  | "accent"
  | "ai"
  | "third";
type ButtonSize = "sm" | "md";

interface ActionItem {
  name: string;
  icon: string;
  secondary?: boolean;
  variant?: ActionVariant;
}

const props = withDefaults(
  defineProps<{
    type?: CellType;
    value?: string;
    // Text type options
    iconLeft?: IconProp;
    iconRight?: IconProp;
    // Link type options
    linkIconLeft?: string;
    linkIconRight?: string;
    href?: string;
    to?: string;
    // Action type options
    actions?: ActionItem[];
    // Pill type options
    pillLabel?: string;
    pillIcon?: string;
    pillColor?: PillColor;
  }>(),
  {
    type: "text",
    value: "",
    iconLeft: undefined,
    iconRight: undefined,
    linkIconLeft: undefined,
    linkIconRight: undefined,
    href: undefined,
    to: undefined,
    actions: () => [
      { name: "view", icon: "eye" },
      { name: "edit", icon: "pencil" },
      { name: "menu", icon: "dots-vertical", secondary: true },
    ],
    pillLabel: "En cours",
    pillIcon: "refresh",
    pillColor: "blue",
  }
);

defineEmits<{
  (e: "action", name: string): void;
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

function resolveIcon(icon: IconProp | undefined) {
  if (!icon) return null;
  if (typeof icon !== "string") {
    return icon;
  }
  const iconName = toIconName(icon);
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((module) => {
      const icons = module as unknown as Record<string, Component>;
      const iconComp = icons[iconName];
      if (!iconComp) {
        console.warn(
          `[UiTableCell] Icon "${iconName}" not found in @tabler/icons-vue`
        );
        return { render: () => null };
      }
      return iconComp;
    })
  );
}

const iconLeftComponent = computed(() => resolveIcon(props.iconLeft));
const iconRightComponent = computed(() => resolveIcon(props.iconRight));

// Get button variant for action
function getActionVariant(action: ActionItem): ButtonVariant {
  if (action.variant === "error") return "error";
  return "ghost";
}

// Get action button classes
function getActionClasses(action: ActionItem): Record<string, boolean> {
  return {
    "ui-table-cell__action-btn--secondary": !!action.secondary,
    "ui-table-cell__action-btn--transparent": action.variant === "transparent",
    "ui-table-cell__action-btn--error": action.variant === "error",
  };
}
</script>

<style scoped>
.ui-table-cell {
  display: flex;
  align-items: center;
  padding: var(--scale-2, 2px);
  height: 26px;
  box-sizing: border-box;
}

.ui-table-cell__content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.ui-table-cell__text {
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--body-line-height);
  color: var(--text-body);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ui-table-cell__icon {
  flex-shrink: 0;
}

.ui-table-cell__icon--left {
  color: var(--text-body);
}

.ui-table-cell__icon--right {
  color: var(--text-body-secondary);
}

/* Link type */
.ui-table-cell--link {
  padding: var(--scale-2, 2px);
}

/* Action type */
.ui-table-cell--action {
  justify-content: flex-end;
}

.ui-table-cell__actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Override button padding for table actions to make them square */
.ui-table-cell__actions :deep(.ui-button) {
  padding-left: 4px;
  padding-right: 4px;
}

/* Secondary action buttons - lighter color */
.ui-table-cell__action-btn--secondary :deep(.ui-button__icon) {
  color: var(--text-body-secondary);
}

.ui-table-cell__action-btn--secondary:hover :deep(.ui-button__icon) {
  color: var(--icon-action);
}

/* Transparent variant - no background, no hover effect */
.ui-table-cell__action-btn--transparent :deep(.ui-button) {
  background-color: transparent !important;
}

.ui-table-cell__action-btn--transparent :deep(.ui-button:hover) {
  background-color: transparent !important;
}

/* Error variant styling - already handled by UiButton error variant */
.ui-table-cell__action-btn--error :deep(.ui-button) {
  min-width: 28px;
  min-height: 28px;
}

/* Pill type */
.ui-table-cell--pill {
  justify-content: flex-start;
}
</style>
