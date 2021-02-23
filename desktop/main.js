const {
  app,
  globalShortcut,
  ipcMain,
  Menu,
  Tray,
  BrowserWindow,
  screen,
  clipboard,
} = require("electron");
const path = require("path");

const Store = require("electron-store");
const Database = require("nedb");
const InMemoryDb = new Database();
InMemoryDb.loadDatabase((error) => {
  if (error !== null) {
    // console.error(error);
  }
});

const db = new Database({ filename: "example.db" });
db.loadDatabase((error) => {
  if (error !== null) {
    // console.error(error);
  }

  console.log("load database completed.");
});
const ClipboardStore = new Store({
  name: "clipboardData",
});
const ShortcutStore = new Store({
  name: "shortcutData",
});
const TemplateStore = new Store({
  name: "templateData",
});

const ClipboardOpenButton = "CommandOrControl+Shift+Z";
const ShortcutOpenButton = "CommandOrControl+Shift+X";
const TemplateOpenButton = "CommandOrControl+Shift+C";

const ClipboardMaxCount = 5;
const ClipboardSurveillanceTime = 1000;

/*===============================
 アプリケーション起動直後の処理
 ===============================*/
app.whenReady().then(() => {
  nedbInsert(InMemoryDb, { _id: "clipboardDispOpen", value: false });

  const tray = new Tray(__dirname + "/icon/icon.png");
  var contextMenu = Menu.buildFromTemplate([
    {
      label: "設定",
      click: () => {
        createWindow();
      },
    },
    {
      label: "終了",
      click: function () {
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);

  // clipboardExe();
  // globalShortcut.register(ClipboardOpenButton, () => {
  //   const mainWindow = windowOpen(800, 400, "clipboard");
  //   clipboardStore(mainWindow);
  // });
  globalShortcut.register(ClipboardOpenButton, async () => {
    const DispStatus = await nedbFindOne(InMemoryDb, {
      _id: "clipboardDispOpen",
    });
    console.log(DispStatus);
    if (DispStatus.value) {
      // nedbUpdate(InMemoryDb, { _id: "clipboardDispOpen" }, { value: false });
    } else {
      const mainWindow = windowOpen(800, 400, "clipboard");
      clipboardStore(mainWindow);
      nedbUpdate(InMemoryDb, { _id: "clipboardDispOpen" }, { value: true });
    }
  });

  globalShortcut.register(ShortcutOpenButton, () => {
    windowOpen(800, 400, "shortcut");
    shortcutStore();
  });

  globalShortcut.register(TemplateOpenButton, () => {
    windowOpen(800, 400, "template");
    templateStore();
  });

  clipboardSurveillance();
});

app.on("window-all-closed", function () {
  // if (process.platform !== "darwin") app.quit();
});

/*===============================
 ウィンドウオープン共通
 ===============================*/

function windowOpen(width, height, fileName) {
  var mouthPoint = screen.getCursorScreenPoint();
  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    x: mouthPoint.x - 10,
    y: mouthPoint.y - 10,
    alwaysOnTop: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    // show: false, // アプリ起動時にウィンドウを表示しない
    // skipTaskbar: true, // タスクバーに表示しない
  });
  mainWindow.loadFile("public/" + fileName + ".html", ["test"]);
  // mainWindow.close();
  return mainWindow;
}

/*===============================
 クリップボード関連
 ===============================*/

function clipboardStore(mainWindow) {
  var mouthPoint = screen.getCursorScreenPoint();
  console.log(mouthPoint);

  //クリップボード一覧初回画面表示時の処理
  ipcMain.handle("getClipboard", async (event, someArgument) => {
    var latestClipboardList = await nedbFindOne(db, { _id: "clipboard" });
    return latestClipboardList.value;
  });

  //クリップボード一覧クリック時の処理
  ipcMain.handle("clipboardSet", async (event, index) => {
    var latestClipboardList = await nedbFindOne(db, { _id: "clipboard" });
    var newClipboardData = latestClipboardList.value[index];
    latestClipboardList.value.splice(index, 1);
    await nedbUpdate(
      db,
      { _id: "clipboard" },
      { value: latestClipboardList.value }
    );
    clipboard.writeText(newClipboardData);
    mainWindow.close();
    ipcClose();
  });

  //クリップボード一覧クリアボタン押下時の処理
  ipcMain.handle("clipboardAllDelete", async (event, data) => {
    db.update(
      { _id: "clipboard" },
      { $set: { value: [] } },
      (error, newDoc) => {}
    );
    mainWindow.close();
    ipcClose();
  });

  //クリップボード一覧クリアボタン押下時の処理
  ipcMain.handle("clipboardWindowClose", async (event) => {
    mainWindow.close();
    ipcClose();
  });
}

function nedbFindOne(db, query) {
  return new Promise((resolve, reject) =>
    db.findOne(query, (err, documents) => {
      if (err) {
        reject(err);
      } else {
        resolve(documents);
      }
    })
  );
}

function nedbInsert(db, data) {
  return new Promise((resolve, reject) =>
    db.insert(data, (err, documents) => {
      if (err) {
        reject(err);
      } else {
        resolve(documents);
      }
    })
  );
}

function nedbUpdate(db, query, data) {
  return new Promise((resolve, reject) =>
    db.update(query, { $set: data }, (err, documents) => {
      if (err) {
        reject(err);
      } else {
        resolve(documents);
      }
    })
  );
}

function ipcClose() {
  ipcMain.removeHandler("getClipboard");
  ipcMain.removeHandler("clipboardSet");
  ipcMain.removeHandler("clipboardAllDelete");
  ipcMain.removeHandler("clipboardWindowClose");
  nedbUpdate(InMemoryDb, { _id: "clipboardDispOpen" }, { value: false });
}

//クリップボード監視（画面開いていなくても実行）
async function clipboardSurveillance() {
  var currentClipboard = clipboard.readText();
  var initClipboardList = await nedbFindOne(db, { _id: "clipboard" });

  //nedbに何もない場合初期化
  if (!initClipboardList) {
    await nedbInsert(db, { _id: "clipboard", value: [currentClipboard] });
    await nedbInsert(db, { _id: "currentClipboard", value: currentClipboard });
  }

  //常駐プログラム処理
  setInterval(async () => {
    var newString = clipboard.readText();
    var currentClipboardList = await nedbFindOne(db, {
      _id: "currentClipboard",
    });

    //最新のクリップボードに変更が加わった場合後続処理を実行する
    if (currentClipboardList.value != newString) {
      console.log(newString);
      console.log(currentClipboardList.value);

      //最新のリストをdbから取得
      var newClipboardList = await nedbFindOne(db, { _id: "clipboard" });

      //リストの上限数を超えている場合その分削除する
      if (newClipboardList.value.length > ClipboardMaxCount) {
        const deleteArray = newClipboardList.value.length - ClipboardMaxCount;
        newClipboardList.value.splice(0, deleteArray);
      }

      //新しいクリップボードをリストに追加する
      newClipboardList.value.unshift(newString);
      await nedbUpdate(
        db,
        { _id: "clipboard" },
        { value: newClipboardList.value }
      );
      await nedbUpdate(db, { _id: "currentClipboard" }, { value: newString });
    }
  }, ClipboardSurveillanceTime);
}

/*===============================
 ショートカット関連
 ===============================*/

function shortcutStore() {
  ShortcutStore.set("programs", { id: 1, name: "TEST" });
  const programs = ShortcutStore.get("programs");
}

/*===============================
 定型文関連
 ===============================*/

function templateStore() {
  TemplateStore.set("programs", [{ id: 1, name: "TEST" }]);
  const programs = TemplateStore.get("programs");

  ipcMain.handle("some-name", async (event, someArgument) => {
    // const result = await someArgument;
    return programs;
  });

  ipcMain.handle("set", async (event, someArgument) => {
    console.log(3);
    TemplateStore.set("programs", { id: 2, name: "TEST2" });
  });
}
