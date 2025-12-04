<template>
  <div class="playground">
    <h1>UiButton Test</h1>

    <section>
      <h2>Variants</h2>
      <div class="row">
        <UiButton label="Primary" :icon="IconSend" />
        <UiButton label="Secondary" :icon="IconSettings" variant="secondary" />
        <UiButton label="Ghost" :icon="IconEdit" variant="ghost" />
        <UiButton label="Danger" :icon="IconTrash" variant="danger" />
      </div>
    </section>

    <section>
      <h2>Sizes</h2>
      <div class="row">
        <UiButton label="Size SM" :icon="IconPlus" size="sm" />
        <UiButton label="Size MD" :icon="IconPlus" size="md" />
      </div>
    </section>

    <section>
      <h2>Sans icône</h2>
      <div class="row">
        <UiButton label="Primary" />
        <UiButton label="Secondary" variant="secondary" />
        <UiButton label="Ghost" variant="ghost" />
      </div>
    </section>

    <section>
      <h2>Icône seule</h2>
      <div class="row">
        <UiButton :icon="IconPlus" />
        <UiButton :icon="IconPlus" variant="secondary" />
        <UiButton :icon="IconPlus" variant="ghost" />
      </div>
    </section>

    <section>
      <h2>États</h2>
      <div class="row">
        <UiButton label="Normal" :icon="IconCheck" />
        <UiButton label="Disabled" :icon="IconCheck" disabled />
        <UiButton label="Loading" :icon="IconCheck" loading />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import UiButton from "../src/components/UiButton.vue";
import {
  IconSend,
  IconSettings,
  IconEdit,
  IconTrash,
  IconPlus,
  IconCheck,
} from "@tabler/icons-vue";
</script>

<style>
body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #f5f5f5;
  margin: 0;
  padding: 20px;
}

.playground {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 32px;
}

h2 {
  color: #666;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}
</style>

