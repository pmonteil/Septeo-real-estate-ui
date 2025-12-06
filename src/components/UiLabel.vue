<template>
  <div class="ui-label">
    <span class="ui-label__text">
      {{ props.label }}
      <span v-if="props.required" class="ui-label__required">*</span>
    </span>
    <slot name="icon">
      <div v-if="iconComponent" class="ui-label__icon-wrapper">
      <component
        :is="iconComponent"
        class="ui-label__icon"
        :size="18"
        :stroke="2"
      />
        <q-tooltip
          v-if="props.tooltip"
          class="ui-label__tooltip"
          anchor="top middle"
          self="bottom middle"
          :offset="[0, 8]"
        >
          {{ props.tooltip }}
        </q-tooltip>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  type Component,
  type FunctionalComponent,
} from "vue";

type IconProp = string | Component | FunctionalComponent;

const props = withDefaults(
  defineProps<{
    label: string;
    icon?: IconProp;
    required?: boolean;
    tooltip?: string;
  }>(),
  {
    required: false,
  }
);

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
// Si un tooltip est fourni mais pas d'icône, afficher help-circle par défaut
const iconComponent = computed(() => {
  // Si icon est explicitement false, ne pas afficher d'icône
  if (props.icon === false) return null;
  
  // Déterminer l'icône à utiliser
  let iconToUse: IconProp | undefined = props.icon;
  
  // Si pas d'icône mais un tooltip, utiliser help-circle par défaut
  if (!iconToUse && props.tooltip) {
    iconToUse = "help-circle";
  }
  
  if (!iconToUse) return null;

  // Si c'est déjà un composant, le retourner directement
  if (typeof iconToUse !== "string") {
    return iconToUse;
  }

  // Sinon, charger dynamiquement depuis @tabler/icons-vue
  const iconName = toIconName(iconToUse);
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((module) => {
      const icons = module as unknown as Record<string, Component>;
      const icon = icons[iconName];
      if (!icon) {
        console.warn(
          `[UiLabel] Icon "${iconName}" not found in @tabler/icons-vue`
        );
        return { render: () => null };
      }
      return icon;
    })
  );
});
</script>

<style scoped>
.ui-label {
  display: flex;
  align-items: center;
  gap: var(--gap-icon-text);
}

.ui-label__text {
  font-family: var(--font-family-body);
  font-size: var(--body-font-size);
  font-weight: var(--font-weight-regular);
  line-height: var(--body-line-height);
  color: var(--text-body);
  white-space: nowrap;
}

.ui-label__required {
  color: var(--text-error);
  margin-left: 2px;
  font-size: 16px;
  font-weight: 700;
}

.ui-label__icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ui-label__icon {
  flex-shrink: 0;
  color: var(--icon-action);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ui-label__icon-wrapper:hover .ui-label__icon {
  animation: soft-bounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes soft-bounce {
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

/* Tooltip styling - fond noir */
.ui-label__tooltip {
  font-family: var(--font-family-body);
  font-size: var(--body-small-font-size);
  background-color: var(--alias-neutral-900);
  color: var(--alias-neutral-white);
  padding: 6px 10px;
  border-radius: var(--alias-border-radius-sm);
}
</style>
