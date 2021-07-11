import { CommonApiNames } from "./CommonConst";

export const FeatureName = "template";

export const FeatureApi = {
  gettemplateClipboard: "gettemplateClipboard",
  templateGet: "templateGet",
  updateTemplate: "updateTemplate",
};

export const CommonApi = {
  getDbData: FeatureName + CommonApiNames.getDbData,
  getDispSize: FeatureName + CommonApiNames.getDispSize,
  windowClose: FeatureName + CommonApiNames.windowClose,
};
