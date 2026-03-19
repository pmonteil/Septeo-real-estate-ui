<template>
  <div class="tokens-page">
    <h1>Design Tokens — Couleurs</h1>

    <!-- BRAND -->
    <section>
      <h2>Brand</h2>
      <p class="tokens-page__desc">Couleurs de base, valeurs brutes.</p>
      <div v-for="group in brandGroups" :key="group.name" class="color-group">
        <h3>{{ group.name }}</h3>
        <div class="color-grid">
          <div
            v-for="token in group.tokens"
            :key="token.var"
            class="color-swatch"
          >
            <div
              class="color-swatch__preview"
              :style="{ backgroundColor: `var(${token.var})` }"
            />
            <span class="color-swatch__name">{{ token.label }}</span>
            <code class="color-swatch__var">{{ token.var }}</code>
            <span class="color-swatch__hex">{{ token.hex }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ALIAS -->
    <section>
      <h2>Alias</h2>
      <p class="tokens-page__desc">
        Références sémantiques. Chaque alias pointe vers un brand token.
      </p>
      <div v-for="group in aliasGroups" :key="group.name" class="color-group">
        <h3>{{ group.name }}</h3>
        <div class="color-grid">
          <div
            v-for="token in group.tokens"
            :key="token.var"
            class="color-swatch"
          >
            <div
              class="color-swatch__preview"
              :style="{ backgroundColor: `var(${token.var})` }"
            />
            <span class="color-swatch__name">{{ token.label }}</span>
            <code class="color-swatch__var">{{ token.var }}</code>
            <span class="color-swatch__hex">{{ token.ref }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- MAPPED -->
    <section>
      <h2>Mapped</h2>
      <p class="tokens-page__desc">
        Tokens contextuels utilisés directement dans les composants.
      </p>
      <div v-for="group in mappedGroups" :key="group.name" class="color-group">
        <h3>{{ group.name }}</h3>
        <div class="color-grid">
          <div
            v-for="token in group.tokens"
            :key="token.var"
            class="color-swatch"
          >
            <div
              class="color-swatch__preview"
              :style="{ backgroundColor: `var(${token.var})` }"
            />
            <span class="color-swatch__name">{{ token.label }}</span>
            <code class="color-swatch__var">{{ token.var }}</code>
            <span class="color-swatch__hex">{{ token.ref }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface Token {
  var: string;
  label: string;
  hex?: string;
  ref?: string;
}

interface TokenGroup {
  name: string;
  tokens: Token[];
}

function buildScale(
  prefix: string,
  name: string,
  steps: { key: string; hex: string }[]
): TokenGroup {
  return {
    name,
    tokens: steps.map((s) => ({
      var: `--${prefix}-${s.key}`,
      label: s.key,
      hex: s.hex,
    })),
  };
}

const brandGroups: TokenGroup[] = [
  buildScale("brand-grey", "Grey", [
    { key: "10", hex: "#fcfcfd" },
    { key: "50", hex: "#f5f7f9" },
    { key: "75", hex: "#eef0f5" },
    { key: "100", hex: "#dde2eb" },
    { key: "200", hex: "#c5cddd" },
    { key: "300", hex: "#aeb9cf" },
    { key: "400", hex: "#96a4c1" },
    { key: "500", hex: "#7e8fb3" },
    { key: "600", hex: "#6a7896" },
    { key: "700", hex: "#57617a" },
    { key: "800", hex: "#434b5d" },
    { key: "900", hex: "#303441" },
    { key: "950", hex: "#262932" },
  ]),
  buildScale("brand-blue", "Blue", [
    { key: "10", hex: "#fafcff" },
    { key: "50", hex: "#eef4ff" },
    { key: "100", hex: "#dce4fd" },
    { key: "200", hex: "#b9c7fb" },
    { key: "300", hex: "#96acf9" },
    { key: "400", hex: "#7491f7" },
    { key: "500", hex: "#3d64ed" },
    { key: "600", hex: "#3456d0" },
    { key: "700", hex: "#324cab" },
    { key: "800", hex: "#304287" },
    { key: "900", hex: "#2e3862" },
    { key: "950", hex: "#1d2443" },
  ]),
  buildScale("brand-orange", "Orange", [
    { key: "10", hex: "#fffbfa" },
    { key: "50", hex: "#fff2ed" },
    { key: "100", hex: "#ffdfd4" },
    { key: "200", hex: "#ffbea8" },
    { key: "300", hex: "#ff9271" },
    { key: "400", hex: "#ff6136" },
    { key: "500", hex: "#fa420f" },
    { key: "600", hex: "#dd370e" },
    { key: "700", hex: "#c62e08" },
    { key: "800", hex: "#9d2b0f" },
    { key: "900", hex: "#7e2210" },
    { key: "950", hex: "#4a170c" },
  ]),
  buildScale("brand-green", "Green", [
    { key: "10", hex: "#fbfefd" },
    { key: "50", hex: "#f2fbf9" },
    { key: "100", hex: "#d2f5ee" },
    { key: "200", hex: "#a6e9de" },
    { key: "300", hex: "#64d3c5" },
    { key: "400", hex: "#44bdb2" },
    { key: "500", hex: "#2ba198" },
    { key: "600", hex: "#20817c" },
    { key: "700", hex: "#1d6864" },
    { key: "800", hex: "#1c5352" },
    { key: "900", hex: "#1b4644" },
    { key: "950", hex: "#0f2928" },
  ]),
  buildScale("brand-red", "Red", [
    { key: "10", hex: "#fffafa" },
    { key: "50", hex: "#fff0f0" },
    { key: "100", hex: "#ffe2e4" },
    { key: "200", hex: "#ffcace" },
    { key: "300", hex: "#ff9fa6" },
    { key: "400", hex: "#ff6977" },
    { key: "500", hex: "#ff485e" },
    { key: "600", hex: "#ed1136" },
    { key: "700", hex: "#c8082d" },
    { key: "800", hex: "#a8092d" },
    { key: "900", hex: "#8f0c2d" },
    { key: "950", hex: "#570c1f" },
  ]),
  buildScale("brand-yellow", "Yellow", [
    { key: "10", hex: "#fffefa" },
    { key: "50", hex: "#fffaed" },
    { key: "100", hex: "#fff4d5" },
    { key: "200", hex: "#ffe5a9" },
    { key: "300", hex: "#fed173" },
    { key: "400", hex: "#fdb23a" },
    { key: "500", hex: "#fb9814" },
    { key: "600", hex: "#f5810b" },
    { key: "700", hex: "#c45e0a" },
    { key: "800", hex: "#9b4911" },
    { key: "900", hex: "#7d3d11" },
    { key: "950", hex: "#4d260c" },
  ]),
  buildScale("brand-purple", "Purple", [
    { key: "10", hex: "#fbfaff" },
    { key: "50", hex: "#f4f0ff" },
    { key: "100", hex: "#e8e2fe" },
    { key: "200", hex: "#e0d5ff" },
    { key: "300", hex: "#c8b4fe" },
    { key: "400", hex: "#a278fb" },
    { key: "500", hex: "#8e4ef9" },
    { key: "600", hex: "#802ced" },
    { key: "700", hex: "#691fc1" },
    { key: "800", hex: "#601daf" },
    { key: "900", hex: "#4d198a" },
    { key: "950", hex: "#2a0f4a" },
  ]),
  {
    name: "Foundation",
    tokens: [
      { var: "--brand-foundation-black", label: "black", hex: "#000000" },
      { var: "--brand-foundation-white", label: "white", hex: "#ffffff" },
    ],
  },
];

function aliasScale(
  prefix: string,
  name: string,
  brandPrefix: string,
  steps: { key: string; brandKey: string }[]
): TokenGroup {
  return {
    name,
    tokens: steps.map((s) => ({
      var: `--alias-${prefix}-${s.key}`,
      label: s.key,
      ref: `→ --brand-${brandPrefix}-${s.brandKey}`,
    })),
  };
}

const aliasGroups: TokenGroup[] = [
  aliasScale("primary", "Primary (blue)", "blue", [
    { key: "10", brandKey: "10" },
    { key: "50", brandKey: "50" },
    { key: "100", brandKey: "100" },
    { key: "200", brandKey: "200" },
    { key: "300", brandKey: "300" },
    { key: "400", brandKey: "400" },
    { key: "default", brandKey: "500" },
    { key: "600", brandKey: "600" },
    { key: "700", brandKey: "700" },
    { key: "800", brandKey: "800" },
    { key: "900", brandKey: "900" },
    { key: "950", brandKey: "950" },
  ]),
  aliasScale("accent", "Accent (orange)", "orange", [
    { key: "10", brandKey: "10" },
    { key: "50", brandKey: "50" },
    { key: "100", brandKey: "100" },
    { key: "200", brandKey: "200" },
    { key: "300", brandKey: "300" },
    { key: "default", brandKey: "400" },
    { key: "500", brandKey: "500" },
    { key: "600", brandKey: "600" },
    { key: "700", brandKey: "700" },
    { key: "800", brandKey: "800" },
    { key: "900", brandKey: "900" },
    { key: "950", brandKey: "950" },
  ]),
  aliasScale("error", "Error (red)", "red", [
    { key: "10", brandKey: "10" },
    { key: "50", brandKey: "50" },
    { key: "100", brandKey: "100" },
    { key: "200", brandKey: "200" },
    { key: "300", brandKey: "300" },
    { key: "400", brandKey: "400" },
    { key: "default", brandKey: "500" },
    { key: "600", brandKey: "600" },
    { key: "700", brandKey: "700" },
    { key: "800", brandKey: "800" },
    { key: "900", brandKey: "900" },
    { key: "950", brandKey: "950" },
  ]),
  aliasScale("success", "Success (green)", "green", [
    { key: "10", brandKey: "10" },
    { key: "50", brandKey: "50" },
    { key: "100", brandKey: "100" },
    { key: "200", brandKey: "200" },
    { key: "300", brandKey: "300" },
    { key: "default", brandKey: "400" },
    { key: "500", brandKey: "500" },
    { key: "600", brandKey: "600" },
    { key: "700", brandKey: "700" },
    { key: "800", brandKey: "800" },
    { key: "900", brandKey: "900" },
    { key: "950", brandKey: "950" },
  ]),
  aliasScale("neutral", "Neutral (grey)", "grey", [
    { key: "10", brandKey: "10" },
    { key: "50", brandKey: "50" },
    { key: "75", brandKey: "75" },
    { key: "100", brandKey: "100" },
    { key: "200", brandKey: "200" },
    { key: "300", brandKey: "300" },
    { key: "default", brandKey: "400" },
    { key: "500", brandKey: "500" },
    { key: "600", brandKey: "600" },
    { key: "700", brandKey: "700" },
    { key: "800", brandKey: "800" },
    { key: "900", brandKey: "900" },
    { key: "950", brandKey: "950" },
  ]),
  aliasScale("warning", "Warning (yellow)", "yellow", [
    { key: "10", brandKey: "10" },
    { key: "50", brandKey: "50" },
    { key: "100", brandKey: "100" },
    { key: "200", brandKey: "200" },
    { key: "300", brandKey: "300" },
    { key: "400", brandKey: "400" },
    { key: "default", brandKey: "500" },
    { key: "600", brandKey: "600" },
    { key: "700", brandKey: "700" },
    { key: "800", brandKey: "800" },
    { key: "900", brandKey: "900" },
    { key: "950", brandKey: "950" },
  ]),
  aliasScale("ai", "AI (purple)", "purple", [
    { key: "10", brandKey: "10" },
    { key: "50", brandKey: "50" },
    { key: "75", brandKey: "100" },
    { key: "100", brandKey: "200" },
    { key: "200", brandKey: "300" },
    { key: "300", brandKey: "400" },
    { key: "default", brandKey: "500" },
    { key: "500", brandKey: "600" },
    { key: "600", brandKey: "700" },
    { key: "700", brandKey: "800" },
    { key: "800", brandKey: "900" },
    { key: "900", brandKey: "950" },
  ]),
];

const mappedGroups: TokenGroup[] = [
  {
    name: "Text",
    tokens: [
      { var: "--text-headings", label: "headings", ref: "→ neutral-black" },
      { var: "--text-body", label: "body", ref: "→ neutral-900" },
      { var: "--text-body-secondary", label: "body-secondary", ref: "→ neutral-default" },
      { var: "--text-action", label: "action", ref: "→ primary-default" },
      { var: "--text-action-hover", label: "action-hover", ref: "→ primary-600" },
      { var: "--text-disable", label: "disable", ref: "→ neutral-default" },
      { var: "--text-on-action", label: "on-action", ref: "→ neutral-white" },
      { var: "--text-error", label: "error", ref: "→ error-default" },
      { var: "--text-success", label: "success", ref: "→ success-default" },
      { var: "--text-warning", label: "warning", ref: "→ warning-default" },
      { var: "--text-information", label: "information", ref: "→ primary-600" },
      { var: "--text-placeholder", label: "placeholder", ref: "→ neutral-600" },
      { var: "--text-accent", label: "accent", ref: "→ accent-default" },
    ],
  },
  {
    name: "Icon",
    tokens: [
      { var: "--icon-default", label: "default", ref: "→ neutral-900" },
      { var: "--icon-secondary", label: "secondary", ref: "→ neutral-500" },
      { var: "--icon-action", label: "action", ref: "→ primary-default" },
      { var: "--icon-action-hover", label: "action-hover", ref: "→ primary-600" },
      { var: "--icon-disable", label: "disable", ref: "→ neutral-default" },
      { var: "--icon-on-action", label: "on-action", ref: "→ neutral-white" },
      { var: "--icon-error", label: "error", ref: "→ error-default" },
      { var: "--icon-success", label: "success", ref: "→ success-default" },
      { var: "--icon-warning", label: "warning", ref: "→ warning-default" },
      { var: "--icon-accent", label: "accent", ref: "→ accent-default" },
      { var: "--icon-accent-hover", label: "accent-hover", ref: "→ accent-500" },
    ],
  },
  {
    name: "Surface",
    tokens: [
      { var: "--surface-page", label: "page", ref: "→ primary-900" },
      { var: "--surface-default", label: "default", ref: "→ neutral-white" },
      { var: "--surface-default-bis", label: "default-bis", ref: "→ neutral-75" },
      { var: "--surface-field", label: "field", ref: "→ neutral-10" },
      { var: "--surface-action", label: "action", ref: "→ primary-default" },
      { var: "--surface-action-hover", label: "action-hover", ref: "→ primary-600" },
      { var: "--surface-light-action", label: "light-action", ref: "→ primary-50" },
      { var: "--surface-light-action-hover", label: "light-action-hover", ref: "→ primary-100" },
      { var: "--surface-disable", label: "disable", ref: "→ neutral-75" },
      { var: "--surface-neutral-hover", label: "neutral-hover", ref: "→ neutral-75" },
      { var: "--surface-error", label: "error", ref: "→ error-50" },
      { var: "--surface-error-hover", label: "error-hover", ref: "→ error-100" },
      { var: "--surface-success", label: "success", ref: "→ success-50" },
      { var: "--surface-warning", label: "warning", ref: "→ warning-50" },
      { var: "--surface-information", label: "information", ref: "→ primary-50" },
      { var: "--surface-accent", label: "accent", ref: "→ accent-default" },
      { var: "--surface-accent-hover", label: "accent-hover", ref: "→ accent-500" },
      { var: "--surface-light-accent", label: "light-accent", ref: "→ accent-50" },
      { var: "--surface-active", label: "active", ref: "→ primary-400" },
      { var: "--surface-ai-light", label: "ai-light", ref: "→ ai-50" },
      { var: "--surface-dynamic", label: "dynamic", ref: "→ ai-50" },
    ],
  },
  {
    name: "Border",
    tokens: [
      { var: "--border-default", label: "default", ref: "→ neutral-100" },
      { var: "--border-default-light", label: "default-light", ref: "→ neutral-75" },
      { var: "--border-action", label: "action", ref: "→ primary-default" },
      { var: "--border-action-hover", label: "action-hover", ref: "→ primary-600" },
      { var: "--border-action-neutral", label: "action-neutral", ref: "→ grey-200" },
      { var: "--border-light-action", label: "light-action", ref: "→ primary-50" },
      { var: "--border-disabled", label: "disabled", ref: "→ neutral-75" },
      { var: "--border-focus", label: "focus", ref: "→ primary-default" },
      { var: "--border-error", label: "error", ref: "→ error-default" },
      { var: "--border-success", label: "success", ref: "→ success-100" },
      { var: "--border-warning", label: "warning", ref: "→ warning-100" },
      { var: "--border-information", label: "information", ref: "→ primary-100" },
      { var: "--border-action-accent", label: "action-accent", ref: "→ accent-default" },
      { var: "--border-action-ai", label: "action-ai", ref: "→ ai-default" },
      { var: "--border-dark", label: "dark", ref: "→ neutral-900" },
      { var: "--border-white", label: "white", ref: "→ neutral-white" },
      { var: "--border-dynamic", label: "dynamic", ref: "→ ai-100" },
    ],
  },
];
</script>

<style scoped>
.tokens-page {
  max-width: 1400px;
  margin: 0 auto;
}

.tokens-page__desc {
  font-size: 13px;
  color: var(--text-body-secondary, #96a4c1);
  margin: 0 0 16px;
}

.color-group {
  margin-bottom: 32px;
}

.color-group h3 {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-body, #303441);
  margin: 0 0 12px;
}

.color-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.color-swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 88px;
}

.color-swatch__preview {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.color-swatch__name {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-body, #303441);
  text-align: center;
}

.color-swatch__var {
  font-size: 9px;
  color: var(--text-body-secondary, #96a4c1);
  text-align: center;
  word-break: break-all;
  line-height: 1.2;
}

.color-swatch__hex {
  font-size: 10px;
  font-family: monospace;
  color: var(--text-body-secondary, #96a4c1);
  text-align: center;
  word-break: break-all;
  line-height: 1.2;
}
</style>
