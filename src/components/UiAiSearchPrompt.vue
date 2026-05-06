<template>
  <button
    class="ui-ai-search-prompt"
    :class="[`ui-ai-search-prompt--${type.toLowerCase()}`]"
    type="button"
    @click="emit('click')"
  >
    <!-- Bouton IA avec gradient -->
    <span class="ui-ai-search-prompt__ai-btn">
      <component
        :is="iconSparkles"
        class="ui-ai-search-prompt__sparkle"
        :size="type === 'Dashboard' ? 12 : 10"
        :stroke="2"
      />
    </span>

    <!-- Texte placeholder -->
    <span class="ui-ai-search-prompt__placeholder">{{ placeholder }}</span>

    <!-- Badge raccourci clavier (Topbar uniquement) -->
    <span v-if="type === 'Topbar'" class="ui-ai-search-prompt__shortcut">
      {{ shortcutKey }}
    </span>

    <!-- Icône microphone (Dashboard uniquement) -->
    <span v-if="type === 'Dashboard'" class="ui-ai-search-prompt__mic">
      <component :is="iconMicrophone" :size="18" :stroke="1.5" />
    </span>
  </button>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";

type Type = "Topbar" | "Dashboard";

const props = withDefaults(
  defineProps<{
    /** Contexte d'affichage : dans la TopBar (compact) ou en Dashboard (élargi) */
    type?: Type;
    /** Texte affiché dans le champ */
    placeholder?: string;
    /** Raccourci clavier affiché (Topbar uniquement) */
    shortcutKey?: string;
  }>(),
  {
    type: "Topbar",
    placeholder: "Rechercher ou demander à mIA...",
    shortcutKey: "⌘K",
  },
);

const emit = defineEmits<{
  /** Déclenché au clic — pour ouvrir l'overlay de recherche IA */
  (e: "click"): void;
}>();

const iconSparkles = defineAsyncComponent(() =>
  import("@tabler/icons-vue").then((m) => m.IconSparkles),
);

const iconMicrophone = defineAsyncComponent(() =>
  import("@tabler/icons-vue").then((m) => m.IconMicrophone),
);
</script>

<style scoped>
/* ─── Base ─────────────────────────────────── */
.ui-ai-search-prompt {
  display: inline-flex;
  align-items: center;
  background-color: var(--surface-field);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  cursor: pointer;
  padding-top: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  text-align: left;
  outline: none;
  transition: color 0.15s ease;
}

/* Bordure en dégradé IA au survol (double couche + clip) */
.ui-ai-search-prompt:hover {
  background-color: transparent;
  border-color: transparent;
  background-image:
    linear-gradient(var(--surface-field), var(--surface-field)),
    linear-gradient(
      90deg,
      var(--ai-0) 0%,
      var(--ai-25) 25%,
      var(--ai-50) 50%,
      var(--ai-75) 75%,
      var(--ai-100) 100%
    );
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

.ui-ai-search-prompt:focus-visible:not(:hover) {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 2px var(--border-light-action);
}

.ui-ai-search-prompt:focus-visible:hover {
  box-shadow: 0 0 0 2px var(--border-light-action);
}

/* ─── Variants ──────────────────────────────── */
.ui-ai-search-prompt--topbar {
  gap: 8px;
  height: 32px;
  padding-left: var(--spacing-sm);
  padding-right: var(--spacing-lg);
  width: 276px;
}

.ui-ai-search-prompt--dashboard {
  gap: var(--spacing-md);
  padding-left: var(--spacing-lg);
  padding-right: var(--spacing-2xl);
  width: 506px;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.12);
}

/* ─── Bouton IA (gradient) ───────────────────── */
.ui-ai-search-prompt__ai-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  flex-shrink: 0;
  padding: 4px;
  background-image: linear-gradient(
    90deg,
    var(--ai-0) 0%,
    var(--ai-25) 25%,
    var(--ai-50) 50%,
    var(--ai-75) 75%,
    var(--ai-100) 100%
  );
  color: white;
}

.ui-ai-search-prompt--topbar .ui-ai-search-prompt__ai-btn {
  width: 24px;
  height: 24px;
}

.ui-ai-search-prompt--dashboard .ui-ai-search-prompt__ai-btn {
  width: 26px;
  height: 26px;
}

/* ─── Icône sparkle ──────────────────────────── */
.ui-ai-search-prompt__sparkle {
  flex-shrink: 0;
}

/* ─── Placeholder ────────────────────────────── */
.ui-ai-search-prompt__placeholder {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-family-body);
  font-size: var(--body-small-font-size);
  font-weight: var(--font-weight-regular);
  line-height: normal;
  color: var(--text-body-secondary);
  transition: color 0.15s ease;
}

.ui-ai-search-prompt:hover .ui-ai-search-prompt__placeholder {
  color: var(--text-headings);
}

/* ─── Badge raccourci ────────────────────────── */
.ui-ai-search-prompt__shortcut {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-default);
  border: 0.5px solid var(--border-default);
  border-radius: 4px;
  padding: 2px 6px;
  font-family: var(--font-family-body);
  font-size: var(--body-small-font-size);
  font-weight: var(--font-weight-regular);
  line-height: normal;
  color: var(--text-body-secondary);
  white-space: nowrap;
}

/* ─── Microphone ─────────────────────────────── */
.ui-ai-search-prompt__mic {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: var(--icon-secondary);
}
</style>
