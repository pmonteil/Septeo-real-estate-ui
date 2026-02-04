<template>
  <div class="ui-select" :class="rootClasses">
    <!-- Label -->
    <UiLabel
      v-if="props.label"
      :label="props.label"
      :icon="props.labelIcon"
      :required="props.labelRequired"
      :tooltip="props.labelTooltip"
      class="ui-select__label"
    />

    <!-- Field -->
    <div
      ref="fieldRef"
      class="ui-select__field"
      :class="fieldClasses"
      tabindex="0"
      @click="toggleDropdown"
      @keydown="onFieldKeydown"
      @focus="onFocus"
      @blur="onBlur"
    >
      <!-- Content wrapper (icon-left + value) -->
      <div class="ui-select__content">
        <!-- Icon Left -->
        <component
          v-if="iconLeftComponent"
          :is="iconLeftComponent"
          class="ui-select__icon ui-select__icon--left"
          :size="18"
          :stroke="2"
        />

        <!-- Selected value or placeholder -->
        <span
          class="ui-select__value"
          :class="{ 'ui-select__value--filled': isFilled }"
        >
          {{ displayValue }}
        </span>
      </div>

      <!-- Icons Right -->
      <div class="ui-select__icons-right">
        <!-- Error icon -->
        <div
          v-if="props.error && iconErrorComponent"
          class="ui-select__error-icon-wrapper"
        >
          <component
            :is="iconErrorComponent"
            class="ui-select__icon ui-select__icon--error"
            :size="18"
            :stroke="2"
          />
          <q-tooltip
            v-if="props.errorMessage"
            class="ui-select__tooltip"
            anchor="top middle"
            self="bottom middle"
            :offset="[0, 8]"
          >
            {{ props.errorMessage }}
          </q-tooltip>
        </div>

        <!-- Chevron icon -->
        <component
          v-if="iconChevronComponent"
          :is="iconChevronComponent"
          class="ui-select__icon ui-select__icon--chevron"
          :class="{ 'ui-select__icon--chevron-up': isOpen }"
          :size="18"
          :stroke="2"
        />
      </div>

      <!-- Dropdown menu -->
      <Transition name="ui-select-dropdown">
        <div
          v-if="isOpen && !props.disabled"
          class="ui-select__dropdown"
          @click.stop
        >
          <div
            v-for="option in props.options"
            :key="getOptionValue(option)"
            class="ui-select__option"
            :class="{
              'ui-select__option--selected': isSelected(option),
              'ui-select__option--disabled': option.disabled,
            }"
            @click="selectOption(option)"
          >
            {{ getOptionLabel(option) }}
          </div>
        </div>
      </Transition>
    </div>

    <!-- Hint Text -->
    <p v-if="props.hintText" class="ui-select__hint">
      {{ props.hintText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  defineAsyncComponent,
  onMounted,
  onUnmounted,
  type Component,
  type FunctionalComponent,
} from "vue";
import UiLabel from "./UiLabel.vue";

type IconProp = string | Component | FunctionalComponent;

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

type OptionType = SelectOption | string | number;

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null;
    options?: OptionType[];
    label?: string;
    labelIcon?: IconProp;
    labelRequired?: boolean;
    labelTooltip?: string;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    errorMessage?: string;
    hintText?: string;
    iconLeft?: IconProp;
  }>(),
  {
    modelValue: null,
    options: () => [],
    placeholder: "placeholder",
    disabled: false,
    error: false,
    labelRequired: false,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | null): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
  (e: "change", value: string | number | null): void;
}>();

const fieldRef = ref<HTMLDivElement | null>(null);
const isOpen = ref(false);
const isFocused = ref(false);

// Check if select has a value
const isFilled = computed(
  () => props.modelValue !== null && props.modelValue !== ""
);

// Get display value
const displayValue = computed(() => {
  if (!isFilled.value) return props.placeholder;

  const selectedOption = props.options.find(
    (opt) => getOptionValue(opt) === props.modelValue
  );
  return selectedOption ? getOptionLabel(selectedOption) : props.placeholder;
});

// Root classes
const rootClasses = computed(() => ({
  "ui-select--disabled": props.disabled,
  "ui-select--error": props.error,
  "ui-select--focused": isFocused.value,
  "ui-select--filled": isFilled.value,
  "ui-select--open": isOpen.value,
}));

// Field classes
const fieldClasses = computed(() => ({
  "ui-select__field--disabled": props.disabled,
  "ui-select__field--error": props.error,
  "ui-select__field--focused": isFocused.value || isOpen.value,
}));

// Convert icon name to component name
function toIconName(name: string): string {
  return (
    "Icon" +
    name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")
  );
}

// Resolve icon component
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
          `[UiSelect] Icon "${iconName}" not found in @tabler/icons-vue`
        );
        return { render: () => null };
      }
      return iconComp;
    })
  );
}

const iconLeftComponent = computed(() => resolveIcon(props.iconLeft));
const iconErrorComponent = computed(() => resolveIcon("exclamation-circle"));
const iconChevronComponent = computed(() => resolveIcon("chevron-down"));

// Get option value
function getOptionValue(option: OptionType): string | number {
  if (typeof option === "object") {
    return option.value;
  }
  return option;
}

// Get option label
function getOptionLabel(option: OptionType): string {
  if (typeof option === "object") {
    return option.label;
  }
  return String(option);
}

// Check if option is selected
function isSelected(option: OptionType): boolean {
  return getOptionValue(option) === props.modelValue;
}

// Toggle dropdown
function toggleDropdown() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
}

// Select option
function selectOption(option: OptionType) {
  if (typeof option === "object" && option.disabled) return;

  const value = getOptionValue(option);
  emit("update:modelValue", value);
  emit("change", value);
  isOpen.value = false;
}

// Handle keyboard navigation
function onFieldKeydown(event: KeyboardEvent) {
  if (props.disabled) return;

  switch (event.key) {
    case "Enter":
    case " ":
      event.preventDefault();
      toggleDropdown();
      break;
    case "Escape":
      isOpen.value = false;
      break;
    case "ArrowDown":
      event.preventDefault();
      if (!isOpen.value) {
        isOpen.value = true;
      } else {
        selectNextOption();
      }
      break;
    case "ArrowUp":
      event.preventDefault();
      if (isOpen.value) {
        selectPreviousOption();
      }
      break;
  }
}

// Select next option
function selectNextOption() {
  const enabledOptions = props.options.filter(
    (opt) => !(typeof opt === "object" && opt.disabled)
  );
  const currentIndex = enabledOptions.findIndex(
    (opt) => getOptionValue(opt) === props.modelValue
  );
  const nextIndex =
    currentIndex < enabledOptions.length - 1 ? currentIndex + 1 : 0;
  const nextOption = enabledOptions[nextIndex];
  if (nextOption) {
    emit("update:modelValue", getOptionValue(nextOption));
  }
}

// Select previous option
function selectPreviousOption() {
  const enabledOptions = props.options.filter(
    (opt) => !(typeof opt === "object" && opt.disabled)
  );
  const currentIndex = enabledOptions.findIndex(
    (opt) => getOptionValue(opt) === props.modelValue
  );
  const prevIndex =
    currentIndex > 0 ? currentIndex - 1 : enabledOptions.length - 1;
  const prevOption = enabledOptions[prevIndex];
  if (prevOption) {
    emit("update:modelValue", getOptionValue(prevOption));
  }
}

// Event handlers
function onFocus(event: FocusEvent) {
  isFocused.value = true;
  emit("focus", event);
}

function onBlur(event: FocusEvent) {
  // Delay to allow click on dropdown options
  setTimeout(() => {
    isFocused.value = false;
    isOpen.value = false;
    emit("blur", event);
  }, 150);
}

// Close dropdown on outside click
function handleClickOutside(event: MouseEvent) {
  if (fieldRef.value && !fieldRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Expose methods
defineExpose({
  open: () => {
    isOpen.value = true;
  },
  close: () => {
    isOpen.value = false;
  },
  focus: () => fieldRef.value?.focus(),
});
</script>

<style scoped>
.ui-select {
  display: flex;
  flex-direction: column;
  gap: var(--brand-scale-2);
  width: 100%;
}

.ui-select__label {
  margin-bottom: calc(var(--gap-field-label) - var(--brand-scale-2));
}

/* ==========================================
 * FIELD
 * ========================================== */

.ui-select__field {
  display: flex;
  align-items: center;
  gap: var(--gap-field-label);
  padding: var(--field-padding-y) var(--field-padding-x);
  background-color: var(--surface-field);
  border: var(--alias-border-width-sm) solid var(--border-default);
  border-radius: var(--field-border-radius);
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  outline: none;
}

/* Content wrapper for icon-left + value */
.ui-select__content {
  display: flex;
  align-items: center;
  gap: var(--gap-field-label);
  flex: 1;
  min-width: 0;
}

/* Icons right wrapper */
.ui-select__icons-right {
  display: flex;
  align-items: center;
  gap: var(--gap-icon-text);
}

/* Hover state - default */
.ui-select__field:hover:not(.ui-select__field--disabled):not(
    .ui-select__field--focused
  ):not(.ui-select__field--error) {
  background-color: var(--surface-default);
}

.ui-select__field:hover:not(.ui-select__field--disabled):not(
    .ui-select__field--focused
  ):not(.ui-select__field--error)
  .ui-select__icon--left {
  animation: soft-bounce-icon 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ui-select__field:hover:not(.ui-select__field--disabled):not(
    .ui-select__field--focused
  ):not(.ui-select__field--error)
  .ui-select__value {
  color: var(--text-action-hover);
}

/* Hover state - error (keep error colors, animate icon only) */
.ui-select__field--error:hover:not(.ui-select__field--disabled):not(
    .ui-select__field--focused
  )
  .ui-select__icon--left {
  animation: soft-bounce-icon 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes soft-bounce-icon {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(0);
  }
}

/* Focus state */
.ui-select__field--focused {
  background-color: var(--surface-field);
  border-color: var(--border-action);
}

/* Error state */
.ui-select__field--error {
  border-color: var(--border-error);
}

/* Disabled state */
.ui-select__field--disabled {
  background-color: var(--surface-disable);
  border-color: var(--border-disabled);
  cursor: not-allowed;
}

/* ==========================================
 * VALUE TEXT
 * ========================================== */

.ui-select__value {
  flex: 1;
  min-width: 0;
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--body-line-height);
  color: var(--text-placeholder);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Filled state */
.ui-select__value--filled {
  font-weight: var(--font-weight-medium);
  color: var(--text-body);
}

/* Error text color */
.ui-select__field--error .ui-select__value {
  color: var(--text-error);
}

/* Disabled state */
.ui-select__field--disabled .ui-select__value {
  color: var(--text-disable);
}

/* ==========================================
 * ICONS
 * ========================================== */

.ui-select__icon {
  flex-shrink: 0;
  color: var(--icon-default);
}

.ui-select__icon--chevron {
  transition: transform 0.2s ease;
}

.ui-select__icon--chevron-up {
  transform: rotate(180deg);
}

.ui-select__icon--error {
  color: var(--icon-error);
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ui-select__error-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ui-select__error-icon-wrapper:hover .ui-select__icon--error {
  animation: soft-bounce-error 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes soft-bounce-error {
  0% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-2px) scale(1.05);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}

/* Error state - icons */
.ui-select__field--error .ui-select__icon {
  color: var(--icon-error);
}

.ui-select__field--disabled .ui-select__icon {
  color: var(--icon-disable);
}

/* Hover state - icons */
.ui-select__field:hover:not(.ui-select__field--disabled):not(
    .ui-select__field--focused
  ):not(.ui-select__field--error)
  .ui-select__icon {
  color: var(--icon-action-hover);
}

/* Tooltip styling */
.ui-select__tooltip {
  font-family: var(--font-family-body);
  font-size: var(--body-small-font-size);
  background-color: var(--alias-neutral-900);
  color: var(--alias-neutral-white);
  padding: 6px 10px;
  border-radius: var(--alias-border-radius-sm);
}

/* ==========================================
 * DROPDOWN
 * ========================================== */

.ui-select__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: var(--surface-default);
  border: var(--alias-border-width-sm) solid var(--border-default);
  border-radius: var(--field-border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 200px;
  overflow-y: auto;
}

.ui-select__option {
  padding: var(--field-padding-y) var(--field-padding-x);
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--body-line-height);
  color: var(--text-body);
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.ui-select__option:hover:not(.ui-select__option--disabled) {
  background-color: var(--surface-light-action);
}

.ui-select__option--selected {
  background-color: var(--surface-light-action);
  font-weight: var(--font-weight-medium);
  color: var(--text-action);
}

.ui-select__option--disabled {
  color: var(--text-disable);
  cursor: not-allowed;
}

/* Dropdown transition */
.ui-select-dropdown-enter-active,
.ui-select-dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.ui-select-dropdown-enter-from,
.ui-select-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ==========================================
 * HINT TEXT
 * ========================================== */

.ui-select__hint {
  margin: 0;
  font-family: var(--font-family-body);
  font-size: var(--caption-font-size);
  line-height: var(--body-line-height);
  color: var(--text-body-secondary);
}
</style>
