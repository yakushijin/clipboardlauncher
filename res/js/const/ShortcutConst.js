import { CommonApiNames } from "./CommonConst";

export const FeatureName = "shortcut";

export const FeatureApi = {
  updateShortcut: "updateShortcut",
  getShortcutClipboard: "getShortcutClipboard",
  shortcutOpenDirectory: "shortcutOpenDirectory",
};

export const CommonApi = {
  getDbData: FeatureName + CommonApiNames.getDbData,
  getDispSize: FeatureName + CommonApiNames.getDispSize,
  windowClose: FeatureName + CommonApiNames.windowClose,
};
