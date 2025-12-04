import { createApp } from "vue";
import { Quasar } from "quasar";
import App from "./App.vue";

// Import Quasar css
import "quasar/dist/quasar.css";

// Import design tokens
import "../src/styles/design-tokens.css";

const app = createApp(App);
app.use(Quasar, {});
app.mount("#app");

