import { nedbFindOne, nedbInsert, nedbUpdate } from "../dao/Transaction";
import { app, ipcMain, BrowserWindow, screen } from "electron";
import path from "path";

export class Window {
  constructor(windowSize, id, InMemoryDb, db, apiList) {
    this.id = id;
    this.x = windowSize.x;
    this.y = windowSize.y;
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

  async open(featureApiSet) {
    const DispStatus = await nedbFindOne(this.InMemoryDb, {
      _id: this.dispOpen,
    });

    const appSettingData = await nedbFindOne(this.InMemoryDb, {
      _id: "appSettingData",
    });
    this.autoClose = appSettingData.value[0].autoWindowClose;

    //ウィンドウが開いている場合は新たに開かない
    if (DispStatus.value) {
      return;
    }

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
          mainWindow.close();
          nedbUpdate(this.InMemoryDb, { _id: this.dispOpen }, { value: false });
        } catch (error) {
          console.log(error);
        }
      }
    );

    //各画面ごとの独自API
    featureApiSet();
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

  async open(featureApiSet) {
    //ウィンドウが開いている場合は新たに開かない
    const DispStatus = await nedbFindOne(this.InMemoryDb, {
      _id: this.dispOpen,
    });
    if (DispStatus.value) {
      return;
    }

    const mainWindow = new BrowserWindow({
      width: this.x,
      height: this.y,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });
    mainWindow.loadFile("public/" + this.id + ".html", ["test"]);
    nedbUpdate(this.InMemoryDb, { _id: this.dispOpen }, { value: true });

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

    //ウィンドウを閉じる（再起動）
    mainWindow.on("closed", function () {
      app.relaunch();
      app.exit();
    });

    //ウィンドウを閉じる（ウィンドウを閉じるのみ）
    ipcMain.handle(
      this.commonApiList.windowClose,
      async (event, someArgument) => {
        try {
          app.quit();
        } catch (error) {
          console.log(error);
        }
      }
    );

    //各画面ごとの独自API
    featureApiSet();
  }
}
