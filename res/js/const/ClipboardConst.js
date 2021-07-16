import { CommonApiNames } from "./CommonConst";

export const FeatureName = "clipboard";

export const FeatureApi = {
  getClipboard: "getClipboard",
  clipboardSet: "clipboardSet",
  clipboardAllDelete: "clipboardAllDelete",
};

export const CommonApi = {
  getDbData: FeatureName + CommonApiNames.getDbData,
  getDispSize: FeatureName + CommonApiNames.getDispSize,
  windowClose: FeatureName + CommonApiNames.windowClose,
};
