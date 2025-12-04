<template>
  <div class="ui-field-wrapper">
    <!-- SELECT -->
    <q-select
      v-if="props.type === 'select'"
      v-model="localValue"
      :options="props.options"
      :placeholder="props.placeholder"
      :disable="props.disabled"
      :error="props.error"
      :hide-bottom-space="true"
      outlined
      dense
      emit-value
      map-options
      class="ui-field ui-field--select"
      :class="fieldClasses"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
      <template v-if="iconLeftComponent" #prepend>
        <component
          :is="iconLeftComponent"
          class="ui-field__icon ui-field__icon--left"
          :size="18"
          :stroke="2"
        />
      </template>
      <template #append>
        <component
          v-if="props.error"
          :is="errorIcon"
          class="ui-field__icon ui-field__icon--error"
          :size="18"
          :stroke="2"
        />
        <component
          :is="selectChevronIcon"
          class="ui-field__icon ui-field__icon--chevron"
          :size="18"
          :stroke="2"
        />
      </template>
    </q-select>

    <!-- INPUT / QUANTITY -->
    <q-input
      v-else
      v-model="localValue"
      :type="props.type === 'quantity' ? 'number' : 'text'"
      :placeholder="props.placeholder"
      :disable="props.disabled"
      :error="props.error"
      :hide-bottom-space="true"
      outlined
      dense
      class="ui-field"
      :class="fieldClasses"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
      <template v-if="iconLeftComponent" #prepend>
        <component
          :is="iconLeftComponent"
          class="ui-field__icon ui-field__icon--left"
          :size="18"
          :stroke="2"
        />
      </template>
      <template v-if="iconRightComponent || props.suffix" #append>
        <span v-if="props.suffix" class="ui-field__suffix">{{ props.suffix }}</span>
        <component
          v-else-if="iconRightComponent"
          :is="iconRightComponent"
          class="ui-field__icon ui-field__icon--right"
          :size="18"
          :stroke="2"
        />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  defineAsyncComponent,
  type Component,
  type FunctionalComponent,
} from "vue";

type IconProp = string | Component | FunctionalComponent;
type FieldType = "input" | "select" | "quantity";
type SelectOption = { label: string; value: string | number } | string;

const props = withDefaults(
  defineProps<{
    modelValue?: string | number;
    type?: FieldType;
    placeholder?: string;
    iconLeft?: IconProp;
    iconRight?: IconProp;
    disabled?: boolean;
    error?: boolean;
    // Select specific
    options?: SelectOption[];
    // Quantity specific
    suffix?: string;
  }>(),
  {
    modelValue: "",
    type: "input",
    placeholder: "placeholder",
    disabled: false,
    error: false,
    options: () => [],
    suffix: "",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
}>();

const localValue = computed({
  get: () => props.modelValue,
  set: (value: string | number) => emit("update:modelValue", value),
});

const isFocused = ref(false);

// Convertit "mail" en "IconMail", "arrow-left" en "IconArrowLeft"
function toIconName(name: string): string {
  return (
    "Icon" +
    name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")
  );
}

// Résout l'icône : soit un composant passé directement, soit un string à charger
function resolveIcon(icon?: IconProp) {
  if (!icon) return null;

  // Si c'est déjà un composant, le retourner directement
  if (typeof icon !== "string") {
    return icon;
  }

  // Sinon, charger dynamiquement depuis @tabler/icons-vue
  const iconName = toIconName(icon);
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((module) => {
      const icons = module as unknown as Record<string, Component>;
      const resolvedIcon = icons[iconName];
      if (!resolvedIcon) {
        console.warn(
          `[UiField] Icon "${iconName}" not found in @tabler/icons-vue`
        );
        return { render: () => null };
      }
      return resolvedIcon;
    })
  );
}

const iconLeftComponent = computed(() => resolveIcon(props.iconLeft));
const iconRightComponent = computed(() => resolveIcon(props.iconRight));
const selectChevronIcon = computed(() => resolveIcon("chevron-down"));
const errorIcon = computed(() => resolveIcon("alert-circle"));

const isFilled = computed(() => !!localValue.value);

const fieldClasses = computed(() => ({
  "ui-field--focused": isFocused.value,
  "ui-field--error": props.error,
  "ui-field--disabled": props.disabled,
  "ui-field--filled": isFilled.value,
  [`ui-field--${props.type}`]: true,
}));
</script>

<style scoped>
.ui-field-wrapper {
  width: 100%;
  max-width: 250px;
}

/* ================= BASE ================= */
.ui-field :deep(.q-field__control) {
  background-color: var(--surface-field) !important;
  border: var(--alias-border-width-sm) solid var(--border-default);
  border-radius: var(--alias-border-radius-lg);
  padding: var(--brand-scale-8) var(--brand-scale-12);
  min-height: auto;
  height: auto;
  transition: all 0.2s ease;
}

.ui-field :deep(.q-field__control::before),
.ui-field :deep(.q-field__control::after) {
  border: none !important;
}

.ui-field :deep(.q-field__native) {
  padding: 0;
  color: var(--text-placeholder);
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--body-line-height);
  min-height: auto;
}

.ui-field :deep(.q-field__native::placeholder) {
  color: var(--text-placeholder);
  opacity: 1;
}

.ui-field :deep(.q-field__marginal) {
  height: auto;
  padding: 0;
}

.ui-field :deep(.q-field__prepend) {
  padding-right: var(--gap-icon-text);
}

.ui-field :deep(.q-field__append) {
  padding-left: var(--gap-icon-text);
}

/* ================= ICONS ================= */
.ui-field__icon {
  flex-shrink: 0;
  color: var(--icon-body);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

/* ================= SUFFIX (pour quantity) ================= */
.ui-field__suffix {
  color: var(--text-placeholder);
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-regular);
  user-select: none;
}

.ui-field--filled .ui-field__suffix {
  color: var(--text-body);
}

.ui-field--error .ui-field__suffix {
  color: var(--text-error);
}

.ui-field--disabled .ui-field__suffix {
  color: var(--text-disable);
}

/* ================= SELECT SPECIFIC ================= */
.ui-field--select :deep(.q-field__control) {
  min-height: auto !important;
  height: auto !important;
}

.ui-field--select :deep(.q-field__native) {
  padding: 0;
  min-height: auto !important;
}

.ui-field--select :deep(.q-field__native > span) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ui-field--select :deep(.q-field__append) {
  padding-left: var(--gap-icon-text);
  padding-right: 0;
  gap: 8px;
}

.ui-field--select :deep(.q-field__control-container) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

/* Chevron du select - masquer l'icône Material par défaut */
.ui-field--select :deep(.q-select__dropdown-icon) {
  display: none !important;
}

/* Style du chevron custom */
.ui-field__icon--chevron {
  transition: transform 0.2s ease, color 0.2s ease;
}

.ui-field--select.ui-field--focused .ui-field__icon--chevron {
  transform: rotate(180deg);
}

.ui-field--select:hover:not(.ui-field--disabled):not(.ui-field--focused):not(.ui-field--error) .ui-field__icon--chevron {
  color: var(--icon-action-hover);
}

.ui-field--select.ui-field--error .ui-field__icon--chevron {
  color: var(--icon-error);
}

.ui-field--select.ui-field--disabled .ui-field__icon--chevron {
  color: var(--icon-disable);
}

/* Icône error dans le select */
.ui-field__icon--error {
  color: var(--icon-error);
}

/* ================= FILLED STATE ================= */
.ui-field--filled :deep(.q-field__native) {
  color: var(--text-body);
  font-weight: var(--font-weight-medium);
}

/* ================= HOVER STATE (normal - pas error) ================= */
.ui-field:hover:not(.ui-field--disabled):not(.ui-field--focused):not(.ui-field--error) :deep(.q-field__control) {
  background-color: var(--surface-default) !important;
}

.ui-field:hover:not(.ui-field--disabled):not(.ui-field--focused):not(.ui-field--error) :deep(.q-field__native) {
  color: var(--text-action-hover);
}

.ui-field:hover:not(.ui-field--disabled):not(.ui-field--focused):not(.ui-field--error) :deep(.q-field__native::placeholder) {
  color: var(--text-action-hover);
}

.ui-field:hover:not(.ui-field--disabled):not(.ui-field--focused):not(.ui-field--error) .ui-field__icon {
  color: var(--icon-action-hover);
}

/* Animation bounce sur le contenu au hover */
.ui-field:hover:not(.ui-field--disabled):not(.ui-field--focused) :deep(.q-field__control-container) {
  animation: field-bounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes field-bounce {
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

/* ================= FOCUS STATE ================= */
.ui-field--focused :deep(.q-field__control) {
  background-color: var(--surface-field) !important;
  border-color: var(--border-action) !important;
}

.ui-field--focused :deep(.q-field__native) {
  color: var(--text-placeholder);
}

.ui-field--focused :deep(.q-field__native::placeholder) {
  color: var(--text-placeholder);
}

.ui-field--focused.ui-field--filled :deep(.q-field__native) {
  color: var(--text-body);
}

.ui-field--focused .ui-field__icon {
  color: var(--icon-body);
}

/* ================= ERROR STATE ================= */
.ui-field--error :deep(.q-field__control) {
  background-color: var(--surface-field) !important;
  border-color: var(--border-error) !important;
}

.ui-field--error :deep(.q-field__native) {
  color: var(--text-error);
}

.ui-field--error :deep(.q-field__native::placeholder) {
  color: var(--text-error);
}

.ui-field--error.ui-field--filled :deep(.q-field__native) {
  color: var(--text-error);
}

.ui-field--error .ui-field__icon {
  color: var(--icon-error);
}

/* Error hover : tout devient rouge */

.ui-field--error:hover:not(.ui-field--disabled) :deep(.q-field__native) {
  color: var(--text-error) !important;
}

.ui-field--error:hover:not(.ui-field--disabled) :deep(.q-field__native::placeholder) {
  color: var(--text-error) !important;
}

.ui-field--error:hover:not(.ui-field--disabled) .ui-field__icon {
  color: var(--icon-error) !important;
}

/* ================= DISABLED STATE ================= */
.ui-field--disabled :deep(.q-field__control) {
  background-color: var(--surface-disable) !important;
  border-color: var(--border-disabled) !important;
}

.ui-field--disabled :deep(.q-field__native) {
  color: var(--text-disable) !important;
}

.ui-field--disabled :deep(.q-field__native::placeholder) {
  color: var(--text-disable);
}

.ui-field--disabled .ui-field__icon {
  color: var(--icon-disable);
}

/* Supprime les styles Quasar par défaut pour error */
.ui-field :deep(.q-field--error .q-field__control) {
  border-color: inherit;
}

.ui-field :deep(.q-field__bottom) {
  display: none !important;
}

/* Masque le message d'erreur Quasar (texte "error") */
.ui-field :deep(.q-field__messages) {
  display: none !important;
}

.ui-field :deep(.q-field__append .q-icon.text-negative) {
  display: none !important;
}

/* Masque l'icône d'erreur par défaut de Quasar */
.ui-field :deep(.q-icon.text-negative.notranslate.material-icons) {
  display: none !important;
}

</style>
