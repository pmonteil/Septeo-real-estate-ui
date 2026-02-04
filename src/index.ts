// Design tokens CSS - à importer dans l'app consommatrice
import "./styles/design-tokens.css";

// Components
export { default as UiButton } from "./components/UiButton.vue";
export { default as UiLabel } from "./components/UiLabel.vue";
export { default as UiInput } from "./components/UiInput.vue";
export { default as UiInputSuffix } from "./components/UiInputSuffix.vue";
export {
  default as UiSelect,
  type SelectOption,
} from "./components/UiSelect.vue";
export { default as UiCheckbox } from "./components/UiCheckbox.vue";
export { default as UiRadio } from "./components/UiRadio.vue";
export { default as UiTextarea } from "./components/UiTextarea.vue";
export { default as UiSwitch } from "./components/UiSwitch.vue";
export { default as UiLink } from "./components/UiLink.vue";
export { default as UiBreadcrumb } from "./components/UiBreadcrumb.vue";
export { default as UiAvatar } from "./components/UiAvatar.vue";
export { default as UiTag } from "./components/UiTag.vue";
export { default as UiBadge } from "./components/UiBadge.vue";
export { default as UiSnackbar } from "./components/UiSnackbar.vue";
export { default as UiPill } from "./components/UiPill.vue";
export { default as UiTable } from "./components/UiTable.vue";
export { default as UiTableCell } from "./components/UiTableCell.vue";
export { default as UiTab } from "./components/UiTab.vue";
export { default as UiTabDark } from "./components/UiTabDark.vue";
export { default as UiMenuOffice } from "./components/UiMenuOffice.vue";
export { default as UiTopbarOffice } from "./components/UiTopbarOffice.vue";
export { default as UiToggle } from "./components/UiToggle.vue";
export { default as UiPopup } from "./components/UiPopup.vue";
export { default as UiPopupIcon } from "./components/UiPopupIcon.vue";

// Re-export Vue utilities for icons
export { markRaw } from "vue";
