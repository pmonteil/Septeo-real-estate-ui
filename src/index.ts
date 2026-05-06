// Design tokens CSS - à importer dans l'app consommatrice
import "./styles/design-tokens.css";

// Core Components
export { default as UiButton } from "./components/UiButton.vue";
export { default as UiLabel } from "./components/UiLabel.vue";
export { default as UiInput } from "./components/UiInput.vue";
export { default as UiInputSuffix } from "./components/UiInputSuffix.vue";
export { default as UiSearchBar } from "./components/UiSearchBar.vue";
export {
  default as UiSelect,
  type SelectOption,
} from "./components/UiSelect.vue";
export { default as UiCheckbox } from "./components/UiCheckbox.vue";
export { default as UiRadio } from "./components/UiRadio.vue";
export { default as UiTextarea } from "./components/UiTextarea.vue";
export { default as UiSwitch } from "./components/UiSwitch.vue";
export { default as UiSlider } from "./components/UiSlider.vue";
export { default as UiLink } from "./components/UiLink.vue";
export { default as UiBreadcrumb } from "./components/UiBreadcrumb.vue";
export { default as UiAvatar } from "./components/UiAvatar.vue";
export { default as UiTag } from "./components/UiTag.vue";
export { default as UiBadge } from "./components/UiBadge.vue";
export { default as UiPill } from "./components/UiPill.vue";
export { default as UiAttribute } from "./components/UiAttribute.vue";
export { default as UiSnackbar } from "./components/UiSnackbar.vue";
export { default as UiToast } from "./components/UiToast.vue";
export { default as UiTooltip } from "./components/UiTooltip.vue";
export { default as UiProgressBar } from "./components/UiProgressBar.vue";
export { default as UiTable } from "./components/UiTable.vue";
export { default as UiTableCell } from "./components/UiTableCell.vue";
export { default as UiTab } from "./components/UiTab.vue";
export { default as UiTabDark } from "./components/UiTabDark.vue";
export { default as UiMenuOffice } from "./components/UiMenuOffice.vue";
export { default as UiTopbarOffice } from "./components/UiTopbarOffice.vue";
export { default as UiToggle } from "./components/UiToggle.vue";
export { default as UiPopup } from "./components/UiPopup.vue";
export { default as UiPopupIcon } from "./components/UiPopupIcon.vue";
export { default as UiModal } from "./components/UiModal.vue";
export { default as UiDynamicInput } from "./components/UiDynamicInput.vue";
export { default as UiFilter } from "./components/UiFilter.vue";
export { default as UiContainersHeader } from "./components/UiContainersHeader.vue";
export { default as UiAccordion } from "./components/UiAccordion.vue";
export {
  default as UiDropdown,
  type DropdownItem,
} from "./components/UiDropdown.vue";
export { default as UiPagination } from "./components/UiPagination.vue";
export { default as UiStepper } from "./components/UiStepper.vue";
export { default as UiCard } from "./components/UiCard.vue";
export { default as UiDivider } from "./components/UiDivider.vue";
export { default as UiAiSearchPrompt } from "./components/UiAiSearchPrompt.vue";

// Layout Components
export { default as UiPageHeader } from "./components/UiPageHeader.vue";
export { default as UiSection } from "./components/UiSection.vue";
export { default as UiSectionTitle } from "./components/UiSectionTitle.vue";
export { default as UiDrawer } from "./components/UiDrawer.vue";

// Re-export Vue utilities for icons
export { markRaw } from "vue";