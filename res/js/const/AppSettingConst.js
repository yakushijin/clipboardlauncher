import { CommonApiNames } from "./CommonConst";

export const FeatureName = "appSetting";

export const FeatureApi = {
  updateAppSetting: "updateAppSetting",
};

export const CommonApi = {
  getDbData: FeatureName + CommonApiNames.getDbData,
  windowClose: FeatureName + CommonApiNames.windowClose,
};
