import { ipcMain } from "electron";
import { openFileOrDirectory, openBrowser } from "../hard/FileSystem";
import { Window } from "../hard/Window";

const FeatureName = "shortcut";

const FeatureApi = {
  updateShortcut: "updateShortcut",
  shortcutOpenDirectory: "shortcutOpenDirectory",
};

const WindowSize = {
  x: 600,
  y: 600,
};

export async function shortcutInit(InMemoryDb, db) {
  const window = new Window(
    WindowSize,
    FeatureName,
    InMemoryDb,
    db,
    FeatureApi
  );

  const featureApiSet = () => {
    //更新
    ipcMain.handle(FeatureApi.updateShortcut, (event, data) => {
      db.update(
        { _id: FeatureName },
        { $set: { value: data } },
        (error, newDoc) => {}
      );
      return "ok";
    });

    //リンククリック
    ipcMain.handle(FeatureApi.shortcutOpenDirectory, async (event, data) => {
      if (data.type === "local") {
        openFileOrDirectory(data.path);
      } else if (data.type === "web") {
        openBrowser(data.path);
      }
    });
  };

  window.open(featureApiSet);
}
