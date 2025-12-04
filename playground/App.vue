<template>
  <div class="playground">
    <h1>Design System Components</h1>

    <!-- ===================== -->
    <!-- UILABEL               -->
    <!-- ===================== -->
    <section>
      <h2>UiLabel</h2>
      <div class="row">
        <UiLabel label="Label par défaut" />
        <UiLabel label="Label requis" required />
        <UiLabel label="Sans icône" :icon="false" />
        <UiLabel label="Icône custom" icon="help" />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIFIELD - INPUT       -->
    <!-- ===================== -->
    <section>
      <h2>UiField - Input</h2>
      <div class="column">
        <UiField type="input" placeholder="Default" icon-left="user" />
        <UiField type="input" placeholder="With value" v-model="fieldValue" icon-left="user" />
        <UiField type="input" placeholder="Error state" :error="true" icon-left="user" icon-right="alert-circle" />
        <UiField type="input" placeholder="Disabled" :disabled="true" icon-left="user" />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIFIELD - SELECT      -->
    <!-- ===================== -->
    <section>
      <h2>UiField - Select</h2>
      <div class="column">
        <UiField type="select" placeholder="Choisir une option" icon-left="list" :options="selectOptions" />
        <UiField type="select" placeholder="With value" v-model="selectValue" icon-left="list" :options="selectOptions" />
        <UiField type="select" placeholder="Error" :error="true" icon-left="list" :options="selectOptions" />
        <UiField type="select" placeholder="Disabled" :disabled="true" icon-left="list" :options="selectOptions" />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIFIELD - QUANTITY    -->
    <!-- ===================== -->
    <section>
      <h2>UiField - Quantity</h2>
      <div class="column">
        <UiField type="quantity" placeholder="Surface" icon-left="ruler" suffix="m²" />
        <UiField type="quantity" placeholder="Durée" icon-left="clock" suffix="min" />
        <UiField type="quantity" placeholder="Prix" icon-left="currency-euro" suffix="€" />
        <UiField type="quantity" placeholder="Error" :error="true" icon-left="ruler" suffix="m²" />
        <UiField type="quantity" placeholder="Disabled" :disabled="true" icon-left="ruler" suffix="m²" />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIBUTTON              -->
    <!-- ===================== -->

    <section>
      <h2>Variants</h2>
      <div class="row">
        <UiButton label="Primary" icon="send" />
        <UiButton label="Secondary" icon="settings" variant="secondary" />
        <UiButton label="Ghost" icon="edit" variant="ghost" />
        <UiButton label="Error" icon="trash" variant="error" />
        <UiButton label="Accent" icon="star" variant="accent" />
        <UiButton label="AI" icon="sparkles" variant="ai" />
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
import { ref } from "vue";
import UiButton from "../src/components/UiButton.vue";
import UiLabel from "../src/components/UiLabel.vue";
import UiField from "../src/components/UiField.vue";

const fieldValue = ref("filled value");
const selectValue = ref("option1");
const selectOptions = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];
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

.column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
</style>

