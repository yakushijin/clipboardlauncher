import { nedbFindOne, nedbInsert, nedbUpdate } from "../dao/Transaction";

import { ipcMain, BrowserWindow, screen } from "electron";
import path from "path";

export class BaseTest {
  constructor(x, y, autoClose, id, InMemoryDb, db, apiList) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.autoClose = autoClose;
    this.dispOpen = id + "DispOpen";
    this.InMemoryDb = InMemoryDb;
    this.db = db;
    this.apiList = apiList;
    this.commonApiList = {
      getDispSize: id + "getDispSize",
      windowClose: id + "windowClose",
    };
  }

  window() {
    //ウィンドウが開いている場合は新たに開かない
    const DispStatus = nedbFindOne(this.InMemoryDb, {
      _id: this.dispOpen,
    });
    if (!DispStatus.value) {
      var mouthPoint = screen.getCursorScreenPoint();
      const mainWindow = new BrowserWindow({
        width: this.x,
        height: this.y,
        x: mouthPoint.x - 40,
        y: mouthPoint.y - 20,
        alwaysOnTop: true,
        transparent: true,
        frame: false,
        webPreferences: {
          preload: path.join(__dirname, "preload.js"),
        },
        // show: false, // アプリ起動時にウィンドウを表示しない
        // skipTaskbar: true, // タスクバーに表示しない
      });
      mainWindow.loadFile("public/" + this.id + ".html", ["test"]);
      nedbUpdate(this.InMemoryDb, { _id: this.dispOpen }, { value: true });

      this.mainWindow = mainWindow;

      return mainWindow;
    }
  }

  commonApi() {
    ipcMain.handle(this.commonApiList.getDispSize, (event, someArgument) => {
      return { x: this.x, y: this.y, autoClose: this.autoClose };
    });

    //クリップボード一覧閉じるボタン押下時の処理
    ipcMain.handle(this.commonApiList.windowClose, async (event) => {
      this.mainWindow.close();
      this.dispClose();
    });
  }

  dispClose() {
    Object.keys(this.apiList).forEach((key) =>
      ipcMain.removeHandler(this.apiList[key])
    );
    Object.keys(this.commonApiList).forEach((key) =>
      ipcMain.removeHandler(this.commonApiList[key])
    );
    // ipcMain.removeHandler("getDispSize");
    // ipcMain.removeHandler("clipboardWindowClose");
    nedbUpdate(this.InMemoryDb, { _id: this.dispOpen }, { value: false });
  }
}
