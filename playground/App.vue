<template>
  <div class="playground">
    <h1>UiButton Test</h1>

    <section>
      <h2>Variants (avec strings)</h2>
      <div class="row">
        <UiButton label="Primary" icon="send" />
        <UiButton label="Secondary" icon="settings" variant="secondary" />
        <UiButton label="Ghost" icon="edit" variant="ghost" />
        <UiButton label="Danger" icon="trash" variant="danger" />
      </div>
    </section>

    <section>
      <h2>Sizes</h2>
      <div class="row">
        <UiButton label="Size SM" icon="plus" size="sm" />
        <UiButton label="Size MD" icon="plus" size="md" />
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
        <UiButton icon="plus" />
        <UiButton icon="plus" variant="secondary" />
        <UiButton icon="plus" variant="ghost" />
      </div>
    </section>

    <section>
      <h2>États</h2>
      <div class="row">
        <UiButton label="Normal" icon="check" />
        <UiButton label="Disabled" icon="check" disabled />
        <UiButton label="Loading" icon="check" loading />
      </div>
    </section>

    <section>
      <h2>Autres icônes (strings)</h2>
      <div class="row">
        <UiButton label="Mail" icon="mail" />
        <UiButton label="Search" icon="search" />
        <UiButton label="Download" icon="download" />
        <UiButton label="Arrow Left" icon="arrow-left" />
        <UiButton label="Star" icon="star" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import UiButton from "../src/components/UiButton.vue";
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

