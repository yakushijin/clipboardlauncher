import { CommonApiNames } from "./CommonConst";

export const FeatureName = "template";

export const FeatureApi = {
  gettemplateClipboard: "gettemplateClipboard",
  templateGet: "templateGet",
  postTemplate: "postTemplate",
  putTemplate: "putTemplate",
  deleteTemplate: "deleteTemplate",
};

export const CommonApi = {
  getDbData: FeatureName + CommonApiNames.getDbData,
  getDispSize: FeatureName + CommonApiNames.getDispSize,
  windowClose: FeatureName + CommonApiNames.windowClose,
};
