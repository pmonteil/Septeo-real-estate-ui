<template>
  <div class="ui-section-title" :class="titleClasses">
    <div class="ui-section-title__main">
      <component
        v-if="props.hasIcon && iconComponent"
        :is="iconComponent"
        class="ui-section-title__icon"
        :size="iconSize"
        :stroke="2"
      />
      <div class="ui-section-title__text">
        <component :is="headingTag" class="ui-section-title__heading">
          {{ props.title }}
        </component>
        <p
          v-if="props.style === 'with-description' && props.description"
          class="ui-section-title__description"
        >
          {{ props.description }}
        </p>
      </div>
    </div>

    <div v-if="$slots.actions" class="ui-section-title__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  type Component,
  type FunctionalComponent,
} from "vue";

type HeadingType = "h1" | "h2" | "h3" | "h4";
type StyleType = "default" | "with-description";
type Size = "default" | "xs";
type IconProp = string | Component | FunctionalComponent;

const props = withDefaults(
  defineProps<{
    title: string;
    description?: string;
    type?: HeadingType;
    style?: StyleType;
    size?: Size;
    hasIcon?: boolean;
    icon?: IconProp;
  }>(),
  {
    type: "h1",
    style: "default",
    size: "default",
    hasIcon: false,
  }
);

function toIconName(name: string): string {
  return (
    "Icon" +
    name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")
  );
}

const iconComponent = computed(() => {
  if (!props.icon) return null;
  if (typeof props.icon !== "string") return props.icon;

  const iconName = toIconName(props.icon);
  return defineAsyncComponent(() =>
    import("@tabler/icons-vue").then((module) => {
      const icons = module as unknown as Record<string, Component>;
      return icons[iconName] || { render: () => null };
    })
  );
});

const headingTag = computed(() => props.type);

const iconSize = computed(() => {
  if (props.size === "xs") return 14;
  return props.type === "h1" || props.type === "h2" ? 20 : 18;
});

const titleClasses = computed(() => [
  `ui-section-title--${props.type}`,
  `ui-section-title--${props.size}`,
  `ui-section-title--${props.style}`,
]);
</script>

<style scoped>
.ui-section-title {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-xl);
  width: 100%;
}

.ui-section-title__main {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  flex: 1;
  min-width: 0;
}

.ui-section-title__icon {
  flex-shrink: 0;
  color: var(--icon-default);
  margin-top: 2px;
}

.ui-section-title__text {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 0;
}

.ui-section-title__heading {
  margin: 0;
  font-family: var(--font-family-headings);
  font-weight: var(--font-weight-semi-bold);
  color: var(--text-headings);
}

/* H1 */
.ui-section-title--h1.ui-section-title--default .ui-section-title__heading {
  font-size: var(--h1-font-size);
  line-height: var(--h1-line-height);
}
.ui-section-title--h1.ui-section-title--xs .ui-section-title__heading {
  font-size: var(--h1-small-font-size);
  line-height: var(--h1-small-line-height);
}

/* H2 */
.ui-section-title--h2.ui-section-title--default .ui-section-title__heading {
  font-size: var(--h2-font-size);
  line-height: var(--h2-line-height);
}
.ui-section-title--h2.ui-section-title--xs .ui-section-title__heading {
  font-size: var(--h2-small-font-size);
  line-height: var(--h2-small-line-height);
}

/* H3 */
.ui-section-title--h3.ui-section-title--default .ui-section-title__heading {
  font-size: var(--h3-font-size);
  line-height: var(--h3-line-height);
}
.ui-section-title--h3.ui-section-title--xs .ui-section-title__heading {
  font-size: var(--h3-small-font-size);
  line-height: var(--h3-small-line-height);
}

/* H4 */
.ui-section-title--h4.ui-section-title--default .ui-section-title__heading {
  font-size: var(--h4-font-size);
  line-height: var(--h4-line-height);
}
.ui-section-title--h4.ui-section-title--xs .ui-section-title__heading {
  font-size: var(--h4-small-font-size);
  line-height: var(--h4-small-line-height);
}

.ui-section-title__description {
  margin: 0;
  font-family: var(--font-family-body);
  color: var(--text-body-secondary);
}

.ui-section-title--default .ui-section-title__description {
  font-size: var(--body-small-font-size);
  line-height: var(--body-small-line-height);
}

.ui-section-title--xs .ui-section-title__description {
  font-size: var(--caption-font-size);
  line-height: var(--caption-line-height);
}

.ui-section-title__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-shrink: 0;
}
</style>
