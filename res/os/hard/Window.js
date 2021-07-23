import { nedbFindOne, nedbInsert, nedbUpdate } from "../dao/Transaction";
import { app, ipcMain, BrowserWindow, screen } from "electron";
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

  async openStateCheck() {
    const DispStatus = await nedbFindOne(this.InMemoryDb, {
      _id: this.dispOpen,
    });
    this.dispStatus = DispStatus.value;
    console.log(2, this.dispStatus);
  }

  async open() {
    //ウィンドウが開いている場合は新たに開かない

    if (this.dispStatus) {
      return;
    }
    console.log(1, this.dispStatus);

    // if (!this.dispStatus) {
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
    // }
  }

  async commonApiSet() {
    if (this.dispStatus) {
      return;
    }
    console.log(this.dispStatus);

    //ハンドラ初期化
    Object.keys(this.apiList).forEach((key) =>
      ipcMain.removeHandler(this.apiList[key])
    );
    Object.keys(this.commonApiList).forEach((key) =>
      ipcMain.removeHandler(this.commonApiList[key])
    );

    //初回データ取得
    ipcMain.handle(
      this.commonApiList.getDbData,
      async (event, someArgument) => {
        var dbData = await nedbFindOne(this.db, { _id: this.id });
        if (!dbData) {
          await nedbInsert(this.db, {
            _id: this.id,
            value: [],
          });
          return [];
        }

        return dbData.value;
      }
    );

    //ウィンドウ情報の取得
    ipcMain.handle(this.commonApiList.getDispSize, (event, someArgument) => {
      return { x: this.x, y: this.y, autoClose: this.autoClose };
    });

    //ウィンドウを閉じる
    ipcMain.handle(
      this.commonApiList.windowClose,
      async (event, someArgument) => {
        try {
          this.mainWindow.close();
          nedbUpdate(this.InMemoryDb, { _id: this.dispOpen }, { value: false });
        } catch (error) {
          // app.relaunch();
          app.exit();
        }
      }
    );
  }
}

export class AppSettingWindow {
  constructor(windowSize, id, InMemoryDb, db) {
    this.id = id;
    this.x = windowSize.x;
    this.y = windowSize.y;
    this.dispOpen = id + "DispOpen";
    this.InMemoryDb = InMemoryDb;
    this.db = db;
    this.commonApiList = {
      getDbData: id + "getDbData",
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
        var dbData = await nedbFindOne(this.db, { _id: this.id });
        if (!dbData) {
          await nedbInsert(this.db, {
            _id: this.id,
            value: [],
          });
          return [];
        }

        return dbData.value;
      }
    );

    //ウィンドウを閉じる
    ipcMain.handle(this.commonApiList.windowClose, async (event) => {
      app.relaunch();
      app.exit();
    });
  }
}
