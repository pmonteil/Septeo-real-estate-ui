<template>
  <div class="ui-label">
    <span class="ui-label__text">
      {{ props.label }}
      <span v-if="props.required" class="ui-label__required">*</span>
    </span>
    <slot name="icon">
      <component
        v-if="iconComponent"
        :is="iconComponent"
        class="ui-label__icon"
        :size="18"
        :stroke="2"
      />
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
const iconComponent = computed(() => {
  if (!props.icon) return null;

  // Si c'est déjà un composant, le retourner directement
  if (typeof props.icon !== "string") {
    return props.icon;
  }

  // Sinon, charger dynamiquement depuis @tabler/icons-vue
  const iconName = toIconName(props.icon);
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

.ui-label__icon {
  flex-shrink: 0;
  color: var(--icon-action);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ui-label__icon:hover {
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
</style>
