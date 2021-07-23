import { ipcMain } from "electron";
import { AppSettingWindow } from "../hard/Window";

const FeatureName = "appSetting";

const FeatureApi = {
  updateAppSetting: "updateAppSetting",
};

const WindowSize = {
  x: 600,
  y: 600,
};

export async function appSettingInit(InMemoryDb, db) {
  const window = new AppSettingWindow(WindowSize, FeatureName, InMemoryDb, db);

  const featureApiSet = () => {
    //更新
    ipcMain.handle(FeatureApi.updateAppSetting, (event, data) => {
      db.update(
        { _id: FeatureName },
        { $set: { value: data } },
        (error, newDoc) => {}
      );
      return "ok";
    });
  };

  window.open(featureApiSet);
}
