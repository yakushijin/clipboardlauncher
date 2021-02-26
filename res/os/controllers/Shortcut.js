import { ipcMain } from "electron";
import { nedbFindOne, nedbInsert, nedbUpdate } from "../dao/Transaction";
import { windowOpen } from "../common/Window";
import { openFileOrDirectory, openBrowser } from "../common/FileSystem";
const ShortcutDispInfo = { x: 600, y: 600, autoClose: true };

export async function shortcutInit(InMemoryDb, db) {
  const DispStatus = await nedbFindOne(InMemoryDb, {
    _id: "shortcutDispOpen",
  });
  if (DispStatus.value) {
  } else {
    const mainWindow = windowOpen(
      ShortcutDispInfo.x,
      ShortcutDispInfo.y,
      "shortcut"
    );
    shortcutStore(mainWindow, InMemoryDb, db);
    nedbUpdate(InMemoryDb, { _id: "shortcutDispOpen" }, { value: true });
  }
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

  //画面情報取得
  ipcMain.handle("getshortcutDispSize", (event, someArgument) => {
    return { x: 600, y: 600, autoClose: true };
  });

  //ショートカット初回画面表示時の処理
  ipcMain.handle("getShortcutClipboard", async (event, someArgument) => {
    var latestClipboardList = await nedbFindOne(db, { _id: "shortcut" });
    return latestClipboardList.value;
  });

  //更新
  ipcMain.handle("updateShortcut", (event, data) => {
    db.update(
      { _id: "shortcut" },
      { $set: { value: data } },
      (error, newDoc) => {}
    );
    return "ok";
  });

  //閉じるボタン
  ipcMain.handle("shortcutOpenDirectory", async (event, data) => {
    await mainWindow.close();
    shortcutipcClose(InMemoryDb);
    if (data.type === "local") {
      openFileOrDirectory(data.path);
    } else if (data.type === "web") {
      openBrowser(data.path);
    }
  });

  //閉じるボタン
  ipcMain.handle("shortcutWindowClose", async (event) => {
    mainWindow.close();
    shortcutipcClose(InMemoryDb);
  });
}

function shortcutipcClose(InMemoryDb) {
  ipcMain.removeHandler("updateShortcut");
  ipcMain.removeHandler("getshortcutDispSize");
  ipcMain.removeHandler("getShortcutClipboard");
  ipcMain.removeHandler("shortcutOpenDirectory");
  ipcMain.removeHandler("shortcutWindowClose");
  nedbUpdate(InMemoryDb, { _id: "shortcutDispOpen" }, { value: false });
}
