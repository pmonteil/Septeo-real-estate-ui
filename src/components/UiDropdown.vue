<template>
  <div class="ui-dropdown" ref="dropdownRef">
    <div @click="toggleOpen">
      <slot name="trigger" :is-open="isOpen" />
    </div>

    <Teleport to="body">
      <Transition name="ui-dropdown-fade">
        <div
          v-if="isOpen"
          class="ui-dropdown__overlay"
          @click.self="close"
        />
      </Transition>
      <Transition name="ui-dropdown-scale">
        <div
          v-if="isOpen"
          ref="menuRef"
          class="ui-dropdown__menu"
          :style="menuStyle"
        >
          <template v-for="(item, index) in items" :key="index">
            <div
              v-if="item.type === 'title1' || item.type === 'title2'"
              class="ui-dropdown__title"
              :class="{
                'ui-dropdown__title--1': item.type === 'title1',
                'ui-dropdown__title--2': item.type === 'title2',
              }"
            >
              {{ item.label }}
            </div>

            <div v-else-if="item.type === 'separator'" class="ui-dropdown__separator" />

            <button
              v-else
              type="button"
              class="ui-dropdown__item"
              :class="{
                'ui-dropdown__item--disabled': item.disabled,
                'ui-dropdown__item--dynamic': item.type === 'dynamic',
                'ui-dropdown__item--checkbox': item.type === 'checkbox',
                'ui-dropdown__item--selected': item.selected,
              }"
              :disabled="item.disabled"
              @click="onItemClick(item, index)"
            >
              <span
                v-if="item.type === 'checkbox'"
                class="ui-dropdown__checkbox"
                :class="{ 'ui-dropdown__checkbox--checked': item.selected }"
              >
                <svg
                  v-if="item.selected"
                  class="ui-dropdown__check-icon"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>

              <component
                v-if="item.icon && resolveIcon(item.icon)"
                :is="resolveIcon(item.icon)"
                class="ui-dropdown__item-icon"
                :size="18"
                :stroke="2"
              />

              <span class="ui-dropdown__item-label">{{ item.label }}</span>

              <component
                v-if="item.iconRight && resolveIcon(item.iconRight)"
                :is="resolveIcon(item.iconRight)"
                class="ui-dropdown__item-icon-right"
                :size="18"
                :stroke="2"
              />
            </button>
          </template>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  defineAsyncComponent,
  type Component,
} from "vue";

export interface DropdownItem {
  label: string;
  value?: string | number;
  type?: "default" | "checkbox" | "dynamic" | "title1" | "title2" | "separator";
  icon?: string;
  iconRight?: string;
  disabled?: boolean;
  selected?: boolean;
}

const props = withDefaults(
  defineProps<{
    items: DropdownItem[];
    modelValue?: (string | number)[];
  }>(),
  {
    modelValue: () => [],
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: (string | number)[]): void;
  (e: "select", item: DropdownItem, index: number): void;
}>();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const menuStyle = ref<Record<string, string>>({});

function toIconName(name: string): string {
  return (
    "Icon" +
    name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")
  );
}

function resolveIcon(icon: string | undefined) {
  if (!icon) return null;
  const iconName = toIconName(icon);
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((mod) => {
      const icons = mod as unknown as Record<string, Component>;
      return icons[iconName] || { render: () => null };
    })
  );
}

function toggleOpen() {
  if (isOpen.value) {
    close();
  } else {
    open();
  }
}

async function open() {
  isOpen.value = true;
  await nextTick();
  positionMenu();
}

function close() {
  isOpen.value = false;
}

function positionMenu() {
  if (!dropdownRef.value || !menuRef.value) return;
  const rect = dropdownRef.value.getBoundingClientRect();
  menuStyle.value = {
    position: "fixed",
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    minWidth: `${rect.width}px`,
    zIndex: "2000",
  };
}

function onItemClick(item: DropdownItem, index: number) {
  if (item.disabled) return;

  if (item.type === "checkbox" && item.value !== undefined) {
    const current = [...props.modelValue];
    const idx = current.indexOf(item.value);
    if (idx >= 0) current.splice(idx, 1);
    else current.push(item.value);
    emit("update:modelValue", current);
  }

  emit("select", item, index);

  if (item.type !== "checkbox") {
    close();
  }
}

function onClickOutside(event: MouseEvent) {
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target as Node) &&
    menuRef.value &&
    !menuRef.value.contains(event.target as Node)
  ) {
    close();
  }
}

onMounted(() => {
  document.addEventListener("mousedown", onClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onClickOutside);
});
</script>

<style scoped>
.ui-dropdown {
  display: inline-flex;
  position: relative;
}

.ui-dropdown__overlay {
  position: fixed;
  inset: 0;
  z-index: 1999;
}

.ui-dropdown__menu {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background-color: var(--surface-default);
  border: var(--alias-border-width-sm) solid var(--border-default-light);
  border-radius: var(--radius-lg);
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.08);
  max-height: 320px;
  overflow-y: auto;
}

.ui-dropdown__item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-sm);
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  cursor: pointer;
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--body-line-height);
  color: var(--text-body);
  white-space: nowrap;
  transition: background-color 0.15s ease;
}

.ui-dropdown__item:hover:not(:disabled) {
  background-color: var(--surface-neutral-hover);
}

.ui-dropdown__item--disabled {
  opacity: var(--opacity-disabled);
  pointer-events: none;
  cursor: not-allowed;
}

.ui-dropdown__item--dynamic {
  color: var(--text-dynamic);
}

.ui-dropdown__item--dynamic .ui-dropdown__item-icon {
  color: var(--icon-dynamic);
}

.ui-dropdown__title {
  padding: var(--spacing-sm) var(--spacing-sm);
  font-family: var(--font-family-headings);
  font-weight: var(--font-weight-semi-bold);
  color: var(--text-headings);
  white-space: nowrap;
}

.ui-dropdown__title--1 {
  font-size: var(--body-font-size);
  line-height: var(--body-line-height);
}

.ui-dropdown__title--2 {
  font-size: var(--body-small-font-size);
  line-height: var(--body-small-line-height);
  color: var(--text-body-secondary);
}

.ui-dropdown__separator {
  height: 1px;
  margin: var(--spacing-xs) 0;
  background-color: var(--border-default-light);
}

.ui-dropdown__checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--sizing-icon-xs);
  height: var(--sizing-icon-xs);
  flex-shrink: 0;
  background-color: var(--surface-field);
  border: var(--alias-border-width-sm) solid var(--border-default);
  border-radius: var(--radius-md);
  transition: all 0.15s ease;
}

.ui-dropdown__checkbox--checked {
  background-color: var(--surface-action);
  border-color: var(--surface-action);
}

.ui-dropdown__check-icon {
  width: var(--sizing-icon-xxs);
  height: var(--sizing-icon-xxs);
  color: var(--icon-on-action);
}

.ui-dropdown__item-icon,
.ui-dropdown__item-icon-right {
  flex-shrink: 0;
  color: var(--icon-secondary);
}

.ui-dropdown__item-label {
  flex: 1;
  text-align: left;
}

/* Transitions */
.ui-dropdown-fade-enter-active,
.ui-dropdown-fade-leave-active {
  transition: opacity 0.15s ease;
}

.ui-dropdown-fade-enter-from,
.ui-dropdown-fade-leave-to {
  opacity: 0;
}

.ui-dropdown-scale-enter-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ui-dropdown-scale-leave-active {
  transition: all 0.1s ease;
}

.ui-dropdown-scale-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-4px);
}

.ui-dropdown-scale-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
