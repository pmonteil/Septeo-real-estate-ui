<template>
  <button
    type="button"
    class="ui-ai-search-prompt"
    :class="rootClasses"
    data-component="ui-ai-search-prompt"
    @click="onClick"
  >
    <span class="ui-ai-search-prompt__gradient" aria-hidden="true">
      <component
        :is="sparklesIcon"
        class="ui-ai-search-prompt__sparkles"
        :size="sparkleSize"
        :stroke="2"
      />
    </span>

    <span class="ui-ai-search-prompt__label">
      <span class="ui-ai-search-prompt__placeholder">{{ props.placeholder }}</span>
      <span class="ui-ai-search-prompt__caret" aria-hidden="true">|</span>
    </span>

    <kbd
      v-if="props.variant === 'topbar'"
      class="ui-ai-search-prompt__kbd"
      aria-hidden="true"
    >
      {{ props.shortcutLabel }}
    </kbd>

    <component
      v-else
      :is="microphoneIcon"
      class="ui-ai-search-prompt__mic"
      :size="18"
      :stroke="2"
      aria-hidden="true"
    />
  </button>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from "vue";

type Variant = "topbar" | "dashboard";

const props = withDefaults(
  defineProps<{
    /** Topbar (compact + raccourci) ou Dashboard (large + micro) */
    variant?: Variant;
    placeholder?: string;
    /** Libellé du raccourci (ex. ⌘K ou Ctrl+K selon l’OS) */
    shortcutLabel?: string;
    /** Force l’apparence « survol » Figma (démos / stories) */
    simulateHover?: boolean;
    disabled?: boolean;
  }>(),
  {
    variant: "topbar",
    placeholder: "Rechercher ou demander à mIA...",
    shortcutLabel: "⌘K",
    simulateHover: false,
    disabled: false,
  }
);

const emit = defineEmits<{
  (e: "click", evt: MouseEvent): void;
}>();

function resolveIcon(name: string) {
  const iconName =
    "Icon" +
    name
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join("");
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((module) => {
      const icons = module as unknown as Record<string, Component>;
      return icons[iconName] || { render: () => null };
    })
  );
}

const sparklesIcon = resolveIcon("sparkles");
const microphoneIcon = resolveIcon("microphone");

const sparkleSize = computed(() => (props.variant === "topbar" ? 10 : 12));

const rootClasses = computed(() => [
  `ui-ai-search-prompt--${props.variant}`,
  {
    "ui-ai-search-prompt--hover": props.simulateHover,
    "ui-ai-search-prompt--disabled": props.disabled,
  },
]);

function onClick(evt: MouseEvent) {
  if (props.disabled) {
    evt.preventDefault();
    return;
  }
  emit("click", evt);
}
</script>

<style scoped>
.ui-ai-search-prompt {
  --ui-ai-search-prompt-ai-border: linear-gradient(
    90deg,
    var(--ai-0) 0%,
    var(--ai-25) 25%,
    var(--ai-50) 50%,
    var(--ai-75) 75%,
    var(--ai-100) 100%
  );

  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  margin: 0;
  font-family: var(--font-family-body, "Inter", system-ui, sans-serif);
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
  text-align: left;
  cursor: pointer;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  background-color: var(--surface-field);
  background-image: none;
  background-origin: border-box;
  background-clip: border-box;
  color: var(--text-body-secondary);
  transition:
    border-color 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease;
}

.ui-ai-search-prompt--topbar {
  gap: var(--spacing-md);
  min-height: 32px;
  padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-sm) var(--spacing-sm);
  min-width: 276px;
}

.ui-ai-search-prompt--dashboard {
  gap: var(--spacing-md);
  min-height: 42px;
  padding: var(--spacing-md) var(--spacing-2xl) var(--spacing-md) var(--spacing-lg);
  min-width: 506px;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.12);
}

/* Bordure = dégradé AI (même angle que la pastille) : remplissage + bord en deux calques */
.ui-ai-search-prompt:hover:not(:disabled),
.ui-ai-search-prompt:focus-visible:not(:disabled),
.ui-ai-search-prompt--hover:not(:disabled) {
  border-color: transparent;
  background-color: transparent;
  background-image:
    linear-gradient(var(--surface-field), var(--surface-field)),
    var(--ui-ai-search-prompt-ai-border);
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

.ui-ai-search-prompt:hover:not(:disabled) .ui-ai-search-prompt__placeholder,
.ui-ai-search-prompt:focus-visible:not(:disabled) .ui-ai-search-prompt__placeholder,
.ui-ai-search-prompt--hover:not(:disabled) .ui-ai-search-prompt__placeholder {
  display: none;
}

.ui-ai-search-prompt__caret {
  display: none;
  color: var(--text-headings);
}

.ui-ai-search-prompt:hover:not(:disabled) .ui-ai-search-prompt__caret,
.ui-ai-search-prompt:focus-visible:not(:disabled) .ui-ai-search-prompt__caret,
.ui-ai-search-prompt--hover:not(:disabled) .ui-ai-search-prompt__caret {
  display: inline;
}

.ui-ai-search-prompt:focus-visible {
  outline: 2px solid var(--alias-primary-200);
  outline-offset: 2px;
}

.ui-ai-search-prompt--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ui-ai-search-prompt__gradient {
  box-sizing: border-box;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm);
  border-radius: var(--radius-full);
  background-image: linear-gradient(
    90deg,
    var(--ai-0) 0%,
    var(--ai-25) 25%,
    var(--ai-50) 50%,
    var(--ai-75) 75%,
    var(--ai-100) 100%
  );
}

.ui-ai-search-prompt--topbar .ui-ai-search-prompt__gradient {
  width: 24px;
  height: 24px;
}

.ui-ai-search-prompt--dashboard .ui-ai-search-prompt__gradient {
  width: 26px;
  height: 26px;
}

.ui-ai-search-prompt__sparkles {
  flex-shrink: 0;
  color: var(--icon-on-action);
}

.ui-ai-search-prompt__label {
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ui-ai-search-prompt__kbd {
  flex-shrink: 0;
  box-sizing: border-box;
  margin: 0;
  padding: 2px var(--brand-scale-6);
  font-family: inherit;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
  color: var(--text-body-secondary);
  background-color: var(--surface-default);
  border: 0.5px solid var(--border-default);
  border-radius: var(--radius-sm);
}

.ui-ai-search-prompt__mic {
  flex-shrink: 0;
  color: var(--icon-secondary);
}
</style>
