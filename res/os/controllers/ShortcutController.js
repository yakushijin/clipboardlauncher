import { ipcMain } from "electron";
import { nedbFindOne, nedbInsert, nedbUpdate } from "../dao/Transaction";
import { openFileOrDirectory, openBrowser } from "../hard/FileSystem";
import { BaseTest } from "../hard/Window";

const ShortcutDispInfo = { x: 600, y: 600, autoClose: true };
const ShortcutApi = {
  updateShortcut: "updateShortcut",
  getShortcutClipboard: "getShortcutClipboard",
  shortcutOpenDirectory: "shortcutOpenDirectory",
};

export async function shortcutInit(InMemoryDb, db) {
  const base = new BaseTest(
    600,
    600,
    true,
    "shortcut",
    InMemoryDb,
    db,
    ShortcutApi
  );

  base.commonApi();
  shortcutStore(base.window(), InMemoryDb, db);
}

async function shortcutStore(mainWindow, InMemoryDb, db) {
  var initList = await nedbFindOne(db, { _id: "shortcut" });

  //nedbに何もない場合初期化
  if (!initList) {
    await nedbInsert(db, {
      _id: "shortcut",
      value: [{ dispName: "テスト", pathString: "/" }],
    });
  }

  //ショートカット初回画面表示時の処理
  ipcMain.handle(
    ShortcutApi.getShortcutClipboard,
    async (event, someArgument) => {
      var latestClipboardList = await nedbFindOne(db, { _id: "shortcut" });
      return latestClipboardList.value;
    }
  );

  //更新
  ipcMain.handle(ShortcutApi.updateShortcut, (event, data) => {
    db.update(
      { _id: "shortcut" },
      { $set: { value: data } },
      (error, newDoc) => {}
    );
    return "ok";
  });

  //閉じるボタン
  ipcMain.handle(ShortcutApi.shortcutOpenDirectory, async (event, data) => {
    await mainWindow.close();
    shortcutipcClose(InMemoryDb);
    if (data.type === "local") {
      openFileOrDirectory(data.path);
    } else if (data.type === "web") {
      openBrowser(data.path);
    }
  });
}
