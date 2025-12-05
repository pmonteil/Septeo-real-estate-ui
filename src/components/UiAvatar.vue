<template>
  <div
    class="ui-avatar"
    :class="rootClasses"
    :style="rootStyles"
  >
    <!-- Inner content wrapper (for gradient border technique) -->
    <div class="ui-avatar__inner">
      <!-- Photo type -->
      <img
        v-if="props.type === 'photo' && props.src"
        :src="props.src"
        :alt="props.alt || props.initials"
        class="ui-avatar__image"
      />

      <!-- Initials type -->
      <span v-else class="ui-avatar__initials">
        {{ displayInitials }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type AvatarSize = "xs" | "default" | "xl";
type AvatarType = "initials" | "photo" | "colored";
type AvatarColor = "neutral" | "red" | "blue" | "green" | "orange" | "purple";

const props = withDefaults(
  defineProps<{
    initials?: string;
    src?: string;
    alt?: string;
    size?: AvatarSize;
    type?: AvatarType;
    color?: AvatarColor;
  }>(),
  {
    initials: "PM",
    size: "default",
    type: "initials",
    color: "neutral",
  }
);

// Compute display initials (max 2 characters)
const displayInitials = computed(() => {
  return props.initials.substring(0, 2).toUpperCase();
});

// Root classes
const rootClasses = computed(() => [
  `ui-avatar--${props.size}`,
  `ui-avatar--${props.type}`,
  props.type === "colored" ? `ui-avatar--color-${props.color}` : "",
  props.type === "initials" ? "ui-avatar--initials-type" : "",
]);

// Root styles for colored backgrounds
const rootStyles = computed(() => {
  if (props.type === "colored") {
    return {};
  }
  return {};
});
</script>

<style scoped>
/* Modelo Gradient: #66d5c5 -> #7096ff -> #ff8c6d */
.ui-avatar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Inner wrapper for gradient border technique */
.ui-avatar__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 100px;
  overflow: hidden;
}

/* ==========================================
 * SIZES
 * ========================================== */

.ui-avatar--xs {
  width: 28px;
  height: 28px;
  padding: 1px; /* Border width */
}

.ui-avatar--default {
  width: 48px;
  height: 48px;
  padding: 2px; /* Border width */
}

.ui-avatar--xl {
  width: 64px;
  height: 64px;
  padding: 3px; /* Border width */
}

/* ==========================================
 * TYPE: INITIALS (with Modelo Gradient border)
 * ========================================== */

.ui-avatar--initials-type {
  /* Modelo Gradient as background (will show as border) */
  background: linear-gradient(
    180deg,
    #66d5c5 0%,
    #7096ff 50%,
    #ff8c6d 100%
  );
}

.ui-avatar--initials-type .ui-avatar__inner {
  background-color: var(--alias-primary-900);
}

.ui-avatar--initials-type .ui-avatar__initials {
  color: var(--text-on-action);
}

/* Hover state for initials */
.ui-avatar--initials-type:hover .ui-avatar__inner {
  background-color: var(--surface-default);
}

.ui-avatar--initials-type:hover .ui-avatar__initials {
  color: var(--text-headings);
}

/* ==========================================
 * TYPE: PHOTO
 * ========================================== */

.ui-avatar--photo {
  background-color: var(--border-white);
}

.ui-avatar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 100px;
}

/* ==========================================
 * TYPE: COLORED
 * ========================================== */

.ui-avatar--colored {
  background-color: var(--border-white);
}

.ui-avatar--colored .ui-avatar__initials {
  color: var(--text-headings);
}

/* Red */
.ui-avatar--color-red .ui-avatar__inner {
  background-color: var(--alias-error-300);
}

.ui-avatar--color-red:hover .ui-avatar__inner {
  background-color: var(--alias-error-400);
}

/* Blue */
.ui-avatar--color-blue .ui-avatar__inner {
  background-color: var(--alias-primary-300);
}

.ui-avatar--color-blue:hover .ui-avatar__inner {
  background-color: var(--alias-primary-400);
}

/* Green */
.ui-avatar--color-green .ui-avatar__inner {
  background-color: var(--alias-success-300);
}

.ui-avatar--color-green:hover .ui-avatar__inner {
  background-color: var(--alias-success-default);
}

/* Orange */
.ui-avatar--color-orange .ui-avatar__inner {
  background-color: var(--alias-accent-300);
}

.ui-avatar--color-orange:hover .ui-avatar__inner {
  background-color: var(--alias-accent-default);
}

/* Purple */
.ui-avatar--color-purple .ui-avatar__inner {
  background-color: var(--alias-ai-200);
}

.ui-avatar--color-purple:hover .ui-avatar__inner {
  background-color: var(--alias-ai-300);
}

/* Neutral (for colored type) */
.ui-avatar--color-neutral .ui-avatar__inner {
  background-color: var(--alias-neutral-300);
}

.ui-avatar--color-neutral:hover .ui-avatar__inner {
  background-color: var(--alias-neutral-default);
}

/* ==========================================
 * INITIALS TEXT
 * ========================================== */

.ui-avatar__initials {
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-semi-bold);
  text-align: center;
  line-height: 1;
  user-select: none;
}

/* Font sizes per avatar size */
.ui-avatar--xs .ui-avatar__initials {
  font-size: 8px;
}

.ui-avatar--default .ui-avatar__initials {
  font-size: var(--body-font-size);
}

.ui-avatar--xl .ui-avatar__initials {
  font-size: var(--h2-font-size);
}

/* ==========================================
 * HOVER ANIMATION
 * ========================================== */

.ui-avatar:hover {
  transform: scale(1.05);
}

.ui-avatar:active {
  transform: scale(0.95);
}
</style>

