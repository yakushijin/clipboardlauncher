import { ipcMain } from "electron";
import { AppSettingWindow } from "../hard/Window";

const FeatureName = "appSetting";

const FeatureApi = {
  updateAppSetting: "updateAppSetting",
};

const WindowSize = {
  x: 400,
  y: 200,
};

export async function appSettingInit(InMemoryDb, db) {
  const appSettingWindow = new AppSettingWindow(
    WindowSize,
    FeatureName,
    InMemoryDb,
    db
  );

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

  appSettingWindow.open(featureApiSet);
}
