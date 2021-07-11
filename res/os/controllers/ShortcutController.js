import { ipcMain } from "electron";
import { nedbFindOne, nedbInsert, nedbUpdate } from "../dao/Transaction";
import { openFileOrDirectory, openBrowser } from "../hard/FileSystem";
import { Window } from "../hard/Window";

const FeatureName = "shortcut";

const FeatureApi = {
  updateShortcut: "updateShortcut",
  getShortcutClipboard: "getShortcutClipboard",
  shortcutOpenDirectory: "shortcutOpenDirectory",
};

const WindowSize = {
  x: 600,
  y: 600,
};

const WindowAutoClose = true;

export async function shortcutInit(InMemoryDb, db) {
  const window = new Window(
    WindowSize,
    WindowAutoClose,
    FeatureName,
    InMemoryDb,
    db,
    FeatureApi
  );

  window.commonApiSet();
  featureApiSet(db);
  window.open();
}

async function featureApiSet(InMemoryDb, db) {
  var initList = await nedbFindOne(db, { _id: FeatureName });

  //nedbに何もない場合初期化
  if (!initList) {
    await nedbInsert(db, {
      _id: FeatureName,
      value: [{ dispName: "テスト", pathString: "/" }],
    });
  }

  //更新
  ipcMain.handle(FeatureApi.updateShortcut, (event, data) => {
    db.update(
      { _id: FeatureName },
      { $set: { value: data } },
      (error, newDoc) => {}
    );
    return "ok";
  });

  //閉じるボタン
  ipcMain.handle(FeatureApi.shortcutOpenDirectory, async (event, data) => {
    await mainWindow.close();
    shortcutipcClose(InMemoryDb);
    if (data.type === "local") {
      openFileOrDirectory(data.path);
    } else if (data.type === "web") {
      openBrowser(data.path);
    }
  });
}
