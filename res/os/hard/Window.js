import { nedbFindOne, nedbInsert, nedbUpdate } from "../dao/Transaction";
import { ipcMain, BrowserWindow, screen } from "electron";
import path from "path";

export class Window {
  constructor(windowSize, autoClose, id, InMemoryDb, db, apiList) {
    this.id = id;
    this.x = windowSize.x;
    this.y = windowSize.y;
    this.autoClose = autoClose;
    this.dispOpen = id + "DispOpen";
    this.InMemoryDb = InMemoryDb;
    this.db = db;
    this.apiList = apiList;
    this.commonApiList = {
      getDbData: id + "getDbData",
      getDispSize: id + "getDispSize",
      windowClose: id + "windowClose",
    };
  }

  open() {
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
    }
  }

  commonApiSet() {
    //初回データ取得
    ipcMain.handle(
      this.commonApiList.getDbData,
      async (event, someArgument) => {
        var latestClipboardList = await nedbFindOne(this.db, { _id: this.id });
        return latestClipboardList.value;
      }
    );

    //ウィンドウ情報の取得
    ipcMain.handle(this.commonApiList.getDispSize, (event, someArgument) => {
      return { x: this.x, y: this.y, autoClose: this.autoClose };
    });

    //ウィンドウを閉じる
    ipcMain.handle(this.commonApiList.windowClose, async (event) => {
      this.mainWindow.close();
      Object.keys(this.apiList).forEach((key) =>
        ipcMain.removeHandler(this.apiList[key])
      );
      Object.keys(this.commonApiList).forEach((key) =>
        ipcMain.removeHandler(this.commonApiList[key])
      );
      nedbUpdate(this.InMemoryDb, { _id: this.dispOpen }, { value: false });
    });
  }
}
