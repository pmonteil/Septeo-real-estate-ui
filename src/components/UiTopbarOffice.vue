<template>
  <header class="ui-topbar-office">
    <!-- Container pour les lueurs avec overflow hidden -->
    <div class="ui-topbar-office__glow-container">
      <div class="ui-topbar-office__glow ui-topbar-office__glow--blue"></div>
      <div class="ui-topbar-office__glow ui-topbar-office__glow--orange"></div>
      <div class="ui-topbar-office__glow ui-topbar-office__glow--turquoise"></div>
    </div>

    <!-- Fil d'Ariane (Breadcrumb) -->
    <nav class="ui-topbar-office__breadcrumb" aria-label="Fil d'Ariane">
      <template v-for="(item, index) in breadcrumb" :key="index">
        <button
          v-if="index < breadcrumb.length - 1"
          class="ui-topbar-office__breadcrumb-item ui-topbar-office__breadcrumb-item--link"
          @click="$emit('navigate', item, index)"
        >
          {{ item.label }}
        </button>
        <span
          v-else
          class="ui-topbar-office__breadcrumb-item ui-topbar-office__breadcrumb-item--current"
        >
          {{ item.label }}
        </span>
        <component
          v-if="index < breadcrumb.length - 1"
          :is="resolveIcon('tabler:chevron-right')"
          class="ui-topbar-office__breadcrumb-separator"
          :size="14"
          :stroke="2"
        />
      </template>
    </nav>

    <!-- Actions à droite -->
    <div class="ui-topbar-office__actions">
      <slot name="actions">
        <button
          class="ui-topbar-office__notification"
          :class="{ 'ui-topbar-office__notification--has-badge': notificationCount > 0 }"
          @click="$emit('notification-click')"
        >
          <component
            :is="resolveIcon('tabler:bell')"
            class="ui-topbar-office__notification-icon"
            :size="18"
            :stroke="2"
          />
          <span
            v-if="notificationCount > 0"
            class="ui-topbar-office__notification-badge"
          >
            {{ notificationCount > 99 ? '99+' : notificationCount }}
          </span>
        </button>
      </slot>
    </div>
  </header>
</template>

<script setup lang="ts">
import { defineAsyncComponent, type Component } from 'vue';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  value?: string | number;
}

interface Props {
  breadcrumb: BreadcrumbItem[];
  notificationCount?: number;
}

withDefaults(defineProps<Props>(), {
  notificationCount: 0,
});

defineEmits<{
  (e: 'navigate', item: BreadcrumbItem, index: number): void;
  (e: 'notification-click'): void;
}>();

const iconCache = new Map<string, Component>();

function resolveIcon(iconName: string): Component {
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName)!;
  }

  const name = iconName.replace('tabler:', '');
  const pascalCase = name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  const componentName = `Icon${pascalCase}`;

  const asyncComponent = defineAsyncComponent(() =>
    import('@tabler/icons-vue').then((module) => {
      const comp = (module as Record<string, Component>)[componentName];
      if (!comp) {
        console.warn(`Icon "${componentName}" not found in @tabler/icons-vue`);
        return module.IconHelp;
      }
      return comp;
    })
  );

  iconCache.set(iconName, asyncComponent);
  return asyncComponent;
}
</script>

<style scoped>
.ui-topbar-office {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #2E3862;
  padding: 0 var(--brand-scale-16, 16px);
  height: 44px;
  min-height: 44px;
  width: 100%;
}

/* Container des lueurs */
.ui-topbar-office__glow-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

/* Lueurs animées */
.ui-topbar-office__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.4;
  pointer-events: none;
  z-index: 0;
}

.ui-topbar-office__glow--blue {
  width: 100px;
  height: 100px;
  background: #7096FF;
  top: -50%;
  left: 10%;
  animation: topbar-glow-float-blue 12s ease-in-out infinite;
}

.ui-topbar-office__glow--orange {
  width: 120px;
  height: 120px;
  background: #FF9072;
  top: -60%;
  right: -5%;
  opacity: 0.32;
  animation: topbar-glow-float-orange 15s ease-in-out infinite;
}

.ui-topbar-office__glow--turquoise {
  width: 80px;
  height: 80px;
  background: #65D5C5;
  top: -40%;
  left: 50%;
  opacity: 0.25;
  animation: topbar-glow-float-turquoise 18s ease-in-out infinite;
}

@keyframes topbar-glow-float-blue {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: translate(30px, 10px) scale(1.1);
    opacity: 0.5;
  }
}

@keyframes topbar-glow-float-orange {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.32;
  }
  50% {
    transform: translate(-40px, 5px) scale(1.15);
    opacity: 0.42;
  }
}

@keyframes topbar-glow-float-turquoise {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.25;
  }
  50% {
    transform: translate(-20px, 8px) scale(1.05);
    opacity: 0.3;
  }
}

/* Breadcrumb */
.ui-topbar-office__breadcrumb {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--brand-scale-4, 4px);
  z-index: 1;
}

.ui-topbar-office__breadcrumb-item {
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: var(--body-small-font-size, 13px);
  font-weight: var(--font-weight-medium, 500);
  line-height: 1;
  background: transparent;
  border: none;
  padding: 0;
  cursor: default;
}

.ui-topbar-office__breadcrumb-item--link {
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: color 0.15s ease;
}

.ui-topbar-office__breadcrumb-item--link:hover {
  color: rgba(255, 255, 255, 0.9);
}

.ui-topbar-office__breadcrumb-item--current {
  color: rgba(255, 255, 255, 0.95);
}

.ui-topbar-office__breadcrumb-separator {
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
}

/* Actions */
.ui-topbar-office__actions {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--brand-scale-8, 8px);
  z-index: 1;
}

/* Notification */
.ui-topbar-office__notification {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: var(--alias-border-radius-md, 6px);
  cursor: pointer;
  transition: background 0.15s ease;
}

.ui-topbar-office__notification:hover {
  background: rgba(255, 255, 255, 0.15);
}

.ui-topbar-office__notification-icon {
  color: rgba(255, 255, 255, 0.85);
}

.ui-topbar-office__notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: #FF6136;
  border-radius: 100px;
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: 10px;
  font-weight: var(--font-weight-semi-bold, 600);
  color: white;
  line-height: 1;
}
</style>

