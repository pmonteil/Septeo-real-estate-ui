<template>
  <nav
    class="ui-menu-office"
    :class="{ 'ui-menu-office--collapsed': collapsed }"
  >
    <!-- Container pour les lueurs avec overflow hidden -->
    <div class="ui-menu-office__glow-container">
      <div class="ui-menu-office__glow ui-menu-office__glow--blue"></div>
      <div class="ui-menu-office__glow ui-menu-office__glow--orange"></div>
      <div class="ui-menu-office__glow ui-menu-office__glow--turquoise"></div>
    </div>
    
    <div class="ui-menu-office__items">
      <template v-for="(item, index) in items" :key="item.value ?? index">
        <!-- Item avec sous-menu -->
        <div
          v-if="item.children && item.children.length > 0"
          class="ui-menu-office__item-group"
          :class="{ 'ui-menu-office__item-group--open': hoveredSubmenu === (item.value ?? index) }"
          @mouseenter="handleSubmenuHover(item.value ?? index, true)"
          @mouseleave="handleSubmenuHover(item.value ?? index, false)"
        >
          <button
            class="ui-menu-office__item ui-menu-office__item--has-children"
            :class="{
              'ui-menu-office__item--active': isItemOrChildActive(item),
              'ui-menu-office__item--disabled': item.disabled
            }"
            :disabled="item.disabled"
          >
            <component
              v-if="item.icon"
              :is="resolveIcon(item.icon)"
              class="ui-menu-office__icon"
              :size="18"
              :stroke="2"
            />
            <span class="ui-menu-office__label">{{ item.label }}</span>
            
            <!-- Badge -->
            <span v-if="item.badge && !collapsed" class="ui-menu-office__badge">
              {{ item.badge }}
            </span>
            <span v-else-if="item.badge && collapsed" class="ui-menu-office__badge-dot" />
            
            <!-- Chevron pour sous-menu (visible uniquement en mode déplié) -->
            <component
              v-if="!collapsed"
              :is="resolveIcon('tabler:chevron-right')"
              class="ui-menu-office__submenu-chevron"
              :size="14"
              :stroke="2"
            />
          </button>
          
          <!-- Flyout (même comportement pour déplié et plié) -->
          <Transition name="submenu-flyout">
            <div
              v-if="hoveredSubmenu === (item.value ?? index)"
              class="ui-menu-office__flyout"
              @mouseenter="handleSubmenuHover(item.value ?? index, true)"
              @mouseleave="handleSubmenuHover(item.value ?? index, false)"
            >
              <!-- Header seulement en mode plié -->
              <div v-if="collapsed" class="ui-menu-office__flyout-header">
                {{ item.label }}
              </div>
              <button
                v-for="(child, childIndex) in item.children"
                :key="child.value ?? childIndex"
                class="ui-menu-office__flyout-item"
                :class="{
                  'ui-menu-office__flyout-item--active': modelValue === (child.value ?? `${item.value}-${childIndex}`),
                  'ui-menu-office__flyout-item--disabled': child.disabled
                }"
                :disabled="child.disabled"
                @click="!child.disabled && selectItem(child.value ?? `${item.value}-${childIndex}`)"
              >
                <component
                  v-if="child.icon"
                  :is="resolveIcon(child.icon)"
                  class="ui-menu-office__flyout-icon"
                  :size="16"
                  :stroke="2"
                />
                <span>{{ child.label }}</span>
                <span v-if="child.badge" class="ui-menu-office__flyout-badge">
                  {{ child.badge }}
                </span>
              </button>
            </div>
          </Transition>
        </div>
        
        <!-- Item simple (sans sous-menu) -->
        <div
          v-else
          class="ui-menu-office__item-wrapper"
          @mouseenter="collapsed && handleTooltipHover(item.value ?? index, true)"
          @mouseleave="collapsed && handleTooltipHover(item.value ?? index, false)"
        >
          <button
            class="ui-menu-office__item"
            :class="{
              'ui-menu-office__item--active': modelValue === (item.value ?? index),
              'ui-menu-office__item--disabled': item.disabled
            }"
            :disabled="item.disabled"
            @click="!item.disabled && selectItem(item.value ?? index)"
          >
            <component
              v-if="item.icon"
              :is="resolveIcon(item.icon)"
              class="ui-menu-office__icon"
              :size="18"
              :stroke="2"
            />
            <span class="ui-menu-office__label">{{ item.label }}</span>
            
            <!-- Badge de notification -->
            <span v-if="item.badge && !collapsed" class="ui-menu-office__badge">
              {{ item.badge }}
            </span>
            <span v-else-if="item.badge && collapsed" class="ui-menu-office__badge-dot" />
          </button>
          
          <!-- Tooltip en mode plié -->
          <Transition name="tooltip">
            <div
              v-if="collapsed && hoveredTooltip === (item.value ?? index)"
              class="ui-menu-office__tooltip"
            >
              {{ item.label }}
            </div>
          </Transition>
        </div>
      </template>
    </div>

    <!-- Bouton toggle (position absolute sur le bord droit) -->
    <button
      v-if="showToggle"
      class="ui-menu-office__toggle"
      @click="$emit('toggle')"
    >
      <component
        :is="resolveIcon(collapsed ? 'tabler:chevron-right' : 'tabler:chevron-left')"
        class="ui-menu-office__toggle-icon"
        :size="14"
        :stroke="2"
      />
    </button>

    <!-- Footer : User -->
    <div class="ui-menu-office__footer">
      <!-- Section User -->
      <div
        v-if="user"
        class="ui-menu-office__user"
        :class="{ 'ui-menu-office__user--menu-open': userMenuOpen }"
        @click="toggleUserMenu"
      >
        <UiAvatar
          :initials="userInitials"
          :src="user.avatar"
          :type="user.avatar ? 'photo' : 'initials'"
          size="xs"
          class="ui-menu-office__user-avatar"
        />
        <div class="ui-menu-office__user-info">
          <span class="ui-menu-office__user-name">{{ user.name }}</span>
          <span v-if="user.role" class="ui-menu-office__user-role">{{ user.role }}</span>
        </div>
        <component
          :is="resolveIcon('tabler:chevron-up')"
          class="ui-menu-office__user-chevron"
          :class="{ 'ui-menu-office__user-chevron--open': userMenuOpen }"
          :size="16"
          :stroke="2"
        />

        <!-- Menu déroulant -->
        <Transition name="user-menu">
          <div
            v-if="userMenuOpen"
            class="ui-menu-office__user-menu"
            @click.stop
          >
            <button
              class="ui-menu-office__user-menu-item"
              @click="handleUserAction('profile')"
            >
              <component
                :is="resolveIcon('tabler:user-edit')"
                :size="16"
                :stroke="2"
              />
              <span>Modifier le profil</span>
            </button>
            <div class="ui-menu-office__user-menu-divider" />
            <button
              class="ui-menu-office__user-menu-item ui-menu-office__user-menu-item--danger"
              @click="handleUserAction('logout')"
            >
              <component
                :is="resolveIcon('tabler:logout')"
                :size="16"
                :stroke="2"
              />
              <span>Se déconnecter</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, computed, onMounted, onUnmounted, type Component } from 'vue';
import UiAvatar from './UiAvatar.vue';

export interface MenuItem {
  label: string;
  icon?: string;
  value?: string | number;
  badge?: number | string;
  disabled?: boolean;
  children?: MenuItem[];
}

export interface UserInfo {
  name: string;
  role?: string;
  avatar?: string;
}

interface Props {
  items: MenuItem[];
  modelValue?: string | number;
  collapsed?: boolean;
  showToggle?: boolean;
  user?: UserInfo;
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  showToggle: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'toggle'): void;
  (e: 'user-action', action: 'profile' | 'logout'): void;
}>();

// État du menu utilisateur
const userMenuOpen = ref(false);

// État du sous-menu survolé (pour flyout)
const hoveredSubmenu = ref<string | number | null>(null);
let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

// État du tooltip survolé (pour items simples en mode plié)
const hoveredTooltip = ref<string | number | null>(null);
let tooltipTimeout: ReturnType<typeof setTimeout> | null = null;

// Sélectionner un item
function selectItem(value: string | number) {
  emit('update:modelValue', value);
  hoveredSubmenu.value = null; // Fermer le flyout après sélection
}

// Gérer le hover sur un sous-menu
function handleSubmenuHover(value: string | number, isEntering: boolean) {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }
  
  if (isEntering) {
    hoveredSubmenu.value = value;
  } else {
    // Délai pour permettre de naviguer vers le flyout
    hoverTimeout = setTimeout(() => {
      hoveredSubmenu.value = null;
    }, 100);
  }
}

// Gérer le hover pour le tooltip (items simples en mode plié)
function handleTooltipHover(value: string | number, isEntering: boolean) {
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout);
    tooltipTimeout = null;
  }
  
  if (isEntering) {
    // Petit délai avant d'afficher le tooltip
    tooltipTimeout = setTimeout(() => {
      hoveredTooltip.value = value;
    }, 200);
  } else {
    hoveredTooltip.value = null;
  }
}

// Vérifier si l'item ou un de ses enfants est actif
function isItemOrChildActive(item: MenuItem): boolean {
  if (props.modelValue === item.value) return true;
  if (item.children) {
    return item.children.some(child => props.modelValue === child.value);
  }
  return false;
}

// Calcul des initiales
const userInitials = computed(() => {
  if (!props.user?.name) return '';
  const parts = props.user.name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
});

function toggleUserMenu() {
  userMenuOpen.value = !userMenuOpen.value;
}

function handleUserAction(action: 'profile' | 'logout') {
  emit('user-action', action);
  userMenuOpen.value = false;
}

// Fermer le menu au clic extérieur
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest('.ui-menu-office__user')) {
    userMenuOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  if (hoverTimeout) clearTimeout(hoverTimeout);
  if (tooltipTimeout) clearTimeout(tooltipTimeout);
});

// Résolution dynamique des icônes Tabler
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
.ui-menu-office {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #2E3862;
  padding: var(--brand-scale-16, 16px) var(--brand-scale-12, 12px);
  width: 206px;
  min-height: 100%;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ui-menu-office--collapsed {
  width: 60px;
}

/* Container des lueurs */
.ui-menu-office__glow-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  border-radius: inherit;
}

/* Lueurs animées */
.ui-menu-office__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.4;
  pointer-events: none;
  z-index: 0;
}

.ui-menu-office__glow--blue {
  width: 140px;
  height: 140px;
  background: #7096FF;
  top: 5%;
  left: -25%;
  animation: glow-float-blue 12s ease-in-out infinite;
}

.ui-menu-office__glow--orange {
  width: 150px;
  height: 150px;
  background: #FF9072;
  bottom: 10%;
  right: -40%;
  opacity: 0.32;
  animation: glow-float-orange 15s ease-in-out infinite;
}

.ui-menu-office__glow--turquoise {
  width: 100px;
  height: 100px;
  background: #65D5C5;
  top: 40%;
  left: 10%;
  opacity: 0.25;
  animation: glow-float-turquoise 18s ease-in-out infinite;
}

@keyframes glow-float-blue {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.4;
  }
  25% {
    transform: translate(40px, 60px) scale(1.15);
    opacity: 0.5;
  }
  50% {
    transform: translate(15px, 120px) scale(0.9);
    opacity: 0.35;
  }
  75% {
    transform: translate(-25px, 50px) scale(1.05);
    opacity: 0.45;
  }
}

@keyframes glow-float-orange {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.32;
  }
  33% {
    transform: translate(-50px, -80px) scale(1.15);
    opacity: 0.42;
  }
  66% {
    transform: translate(-25px, 40px) scale(0.95);
    opacity: 0.28;
  }
}

@keyframes glow-float-turquoise {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.25;
  }
  20% {
    transform: translate(25px, -40px) scale(1.1);
    opacity: 0.35;
  }
  40% {
    transform: translate(-15px, -80px) scale(0.85);
    opacity: 0.2;
  }
  60% {
    transform: translate(40px, 30px) scale(1.05);
    opacity: 0.3;
  }
  80% {
    transform: translate(-20px, 50px) scale(0.9);
    opacity: 0.25;
  }
}

.ui-menu-office__items {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--brand-scale-8, 8px);
  z-index: 1;
}

/* Item group (pour items avec sous-menu) */
.ui-menu-office__item-group {
  position: relative;
}

/* Item wrapper (pour items simples avec tooltip) */
.ui-menu-office__item-wrapper {
  position: relative;
}

.ui-menu-office__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--gap-icon-text, 4px);
  width: 100%;
  padding: var(--brand-scale-8, 8px);
  border-radius: var(--alias-border-radius-lg, 8px);
  background: transparent;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: var(--body-font-size, 14px);
  font-weight: var(--font-weight-medium, 500);
  line-height: var(--body-line-height, 20px);
  text-align: left;
  white-space: nowrap;
  overflow: visible;
  transition: 
    background 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    color 0.15s ease,
    opacity 0.15s ease;
}

.ui-menu-office--collapsed .ui-menu-office__item {
  width: 36px;
  height: 36px;
  justify-content: center;
  padding: 0;
}

.ui-menu-office__item:hover:not(.ui-menu-office__item--active):not(.ui-menu-office__item--disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.ui-menu-office__item--active {
  background: var(--gradient-menu-active);
  color: var(--alias-neutral-white, #ffffff);
  box-shadow: 0 2px 8px rgba(255, 97, 54, 0.25);
}

.ui-menu-office__item--active .ui-menu-office__icon {
  color: var(--alias-neutral-white, #ffffff);
}

.ui-menu-office__item--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ui-menu-office__icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  color: inherit;
}

.ui-menu-office__label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 1;
  transition: opacity 0.2s ease, width 0.3s ease;
}

.ui-menu-office--collapsed .ui-menu-office__label {
  opacity: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

/* Chevron pour sous-menu */
.ui-menu-office__submenu-chevron {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.5);
}

/* Badge de notification */
.ui-menu-office__badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background-color: var(--surface-accent, #ff6136);
  border-radius: 100px;
  font-size: var(--caption-font-size, 10px);
  font-weight: var(--font-weight-semi-bold, 600);
  color: var(--alias-neutral-white, #ffffff);
  line-height: 1;
  flex-shrink: 0;
}

.ui-menu-office__badge-dot {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  background-color: var(--surface-accent, #ff6136);
  border-radius: 100px;
  pointer-events: none;
}

/* Flyout (sous-menu popup) */
.ui-menu-office__flyout {
  position: absolute;
  left: calc(100% + 8px);
  top: 0;
  min-width: 180px;
  background: var(--alias-neutral-white, #ffffff);
  border-radius: var(--alias-border-radius-lg, 8px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 100;
}

.ui-menu-office__flyout-header {
  padding: var(--brand-scale-8, 8px) var(--brand-scale-12, 12px);
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: var(--body-small-font-size, 12px);
  font-weight: var(--font-weight-semi-bold, 600);
  color: var(--text-body-secondary, #96a4c1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border-default, #dde2eb);
}

.ui-menu-office__flyout-item {
  display: flex;
  align-items: center;
  gap: var(--brand-scale-8, 8px);
  width: 100%;
  padding: var(--brand-scale-10, 10px) var(--brand-scale-12, 12px);
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: var(--body-font-size, 14px);
  font-weight: var(--font-weight-regular, 400);
  color: var(--text-body, #303441);
  text-align: left;
  transition: background 0.15s ease;
}

.ui-menu-office__flyout-item:hover:not(.ui-menu-office__flyout-item--active):not(.ui-menu-office__flyout-item--disabled) {
  background: var(--surface-neutral-hover, #eef0f5);
}

.ui-menu-office__flyout-item--active {
  background: rgba(255, 97, 54, 0.1);
  color: #FF6136;
}

.ui-menu-office__flyout-item--active .ui-menu-office__flyout-icon {
  color: #FF6136;
}

.ui-menu-office__flyout-item--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ui-menu-office__flyout-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  color: inherit;
}

.ui-menu-office__flyout-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  margin-left: auto;
  background-color: var(--surface-accent, #ff6136);
  border-radius: 100px;
  font-size: var(--caption-font-size, 10px);
  font-weight: var(--font-weight-semi-bold, 600);
  color: var(--alias-neutral-white, #ffffff);
  line-height: 1;
}

/* Footer */
.ui-menu-office__footer {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--brand-scale-12, 12px);
  margin-top: auto;
  z-index: 1;
}

/* Bouton toggle - position absolute sur le bord droit */
.ui-menu-office__toggle {
  position: absolute;
  top: 24px;
  right: -12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: var(--surface-default, #ffffff);
  border: 1px solid var(--border-default, #dde2eb);
  border-radius: 50%;
  color: var(--icon-secondary, #7e8fb3);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  transition: 
    background 0.2s ease,
    color 0.15s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.ui-menu-office__toggle:hover {
  background: var(--surface-neutral-hover, #eef0f5);
  color: var(--icon-default, #303441);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: scale(1.05);
}

.ui-menu-office__toggle-icon {
  width: 14px;
  height: 14px;
}

/* Section User */
.ui-menu-office__user {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--brand-scale-8, 8px);
  padding: var(--brand-scale-8, 8px);
  border-radius: var(--alias-border-radius-lg, 8px);
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: background 0.2s ease;
}

.ui-menu-office__user:hover,
.ui-menu-office__user--menu-open {
  background: rgba(255, 255, 255, 0.1);
}

.ui-menu-office--collapsed .ui-menu-office__user {
  justify-content: center;
  padding: var(--brand-scale-4, 4px);
}

.ui-menu-office__user-avatar {
  flex-shrink: 0;
}

.ui-menu-office__user-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  transition: opacity 0.2s ease, width 0.3s ease;
}

.ui-menu-office--collapsed .ui-menu-office__user-info {
  opacity: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.ui-menu-office__user-name {
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: var(--body-font-size, 14px);
  font-weight: var(--font-weight-medium, 500);
  line-height: var(--body-line-height, 20px);
  color: var(--alias-neutral-white, #ffffff);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ui-menu-office__user-role {
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: var(--body-small-font-size, 12px);
  font-weight: var(--font-weight-regular, 400);
  line-height: var(--body-small-line-height, 18px);
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ui-menu-office__user-chevron {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.5);
  transition: transform 0.2s ease;
}

.ui-menu-office__user-chevron--open {
  transform: rotate(180deg);
}

.ui-menu-office--collapsed .ui-menu-office__user-chevron {
  display: none;
}

/* Menu déroulant utilisateur */
.ui-menu-office__user-menu {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--alias-neutral-white, #ffffff);
  border-radius: var(--alias-border-radius-lg, 8px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 100;
}

.ui-menu-office--collapsed .ui-menu-office__user-menu {
  left: auto;
  right: auto;
  min-width: 180px;
}

.ui-menu-office__user-menu-item {
  display: flex;
  align-items: center;
  gap: var(--brand-scale-8, 8px);
  width: 100%;
  padding: var(--brand-scale-12, 12px);
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: var(--body-font-size, 14px);
  font-weight: var(--font-weight-regular, 400);
  color: var(--text-body, #303441);
  text-align: left;
  transition: background 0.15s ease;
}

.ui-menu-office__user-menu-item:hover {
  background: var(--surface-neutral-hover, #eef0f5);
}

.ui-menu-office__user-menu-item--danger {
  color: var(--text-error, #ff485e);
}

.ui-menu-office__user-menu-item--danger:hover {
  background: var(--surface-error, #fff0f0);
}

.ui-menu-office__user-menu-divider {
  height: 1px;
  background: var(--border-default, #dde2eb);
  margin: var(--brand-scale-4, 4px) 0;
}

/* Animations */
.user-menu-enter-active,
.user-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.user-menu-enter-from,
.user-menu-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* Tooltip (pour items simples en mode plié) */
.ui-menu-office__tooltip {
  position: absolute;
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  padding: var(--brand-scale-6, 6px) var(--brand-scale-10, 10px);
  background: var(--alias-neutral-900, #303441);
  color: var(--alias-neutral-white, #ffffff);
  font-family: var(--font-family-body, 'Inter', sans-serif);
  font-size: var(--body-small-font-size, 12px);
  font-weight: var(--font-weight-medium, 500);
  white-space: nowrap;
  border-radius: var(--alias-border-radius-sm, 6px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 100;
  pointer-events: none;
}

/* Animation flyout */
.submenu-flyout-enter-active,
.submenu-flyout-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.submenu-flyout-enter-from,
.submenu-flyout-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

/* Animation tooltip */
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(-4px);
}
</style>
