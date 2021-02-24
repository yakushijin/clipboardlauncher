import { ipcMain } from "electron";
import { nedbFindOne, nedbInsert, nedbUpdate } from "../dao/Transaction";
import { windowOpen } from "../common/Window";
const ShortcutDispInfo = { x: 600, y: 600, autoClose: true };

export async function shortcutInit(InMemoryDb) {
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
    shortcutStore(mainWindow, InMemoryDb);
    nedbUpdate(InMemoryDb, { _id: "shortcutDispOpen" }, { value: true });
  }
}

function shortcutStore(mainWindow, InMemoryDb) {
  console.log(1);
  //画面情報取得
  ipcMain.handle("getshortcutDispSize", (event, someArgument) => {
    return { x: 600, y: 600, autoClose: true };
  });

  //閉じるボタン
  ipcMain.handle("shortcutWindowClose", async (event) => {
    mainWindow.close();
    shortcutipcClose(InMemoryDb);
  });
}

function shortcutipcClose(InMemoryDb) {
  ipcMain.removeHandler("getshortcutDispSize");
  ipcMain.removeHandler("shortcutWindowClose");
  nedbUpdate(InMemoryDb, { _id: "shortcutDispOpen" }, { value: false });
}
