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
const ClipboardNotDeleteIndex = -1;

/*===============================
 アプリケーション起動直後の処理
 ===============================*/
app.whenReady().then(() => {
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

  globalShortcut.register(ClipboardOpenButton, () => {
    const mainWindow = windowOpen(800, 400, "clipboard");
    clipboardStore(mainWindow);
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
    x: mouthPoint.x,
    y: mouthPoint.y,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    // show: false, // アプリ起動時にウィンドウを表示しない
    skipTaskbar: true, // タスクバーに表示しない
  });
  mainWindow.loadFile("public/" + fileName + ".html", ["test"]);
  // mainWindow.close();
  return mainWindow;
}

/*===============================
 クリップボード関連
 ===============================*/

function clipboardStore(mainWindow) {
  ipcMain.handle("getClipboard", async (event, someArgument) => {
    // const programs = ClipboardStore.get("clipboardString");
    var searchResult1 = await dbget(db, { _id: "clipboard" });

    return searchResult1.test;
  });

  ipcMain.handle("clipboardSet", async (event, data) => {
    ClipboardStore.set("deleteIndex", data.index);
    clipboard.writeText(data.value);
    mainWindow.close();
    ipcClose();
  });

  ipcMain.handle("clipboardAllDelete", async (event, data) => {
    // ClipboardStore.set("allDeleteFlag", true);
    db.update(
      { _id: "clipboard" },
      { $set: { test: [] } },
      (error, newDoc) => {}
    );

    mainWindow.close();
    ipcClose();
  });
}

function dbget(db, query) {
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

function ipcClose() {
  ipcMain.removeHandler("getClipboard");
  ipcMain.removeHandler("clipboardSet");
  ipcMain.removeHandler("clipboardAllDelete");
}

//クリップボード監視（画面開いていなくても実行）
async function clipboardSurveillance() {
  var clipboardList = ClipboardStore.get("clipboardString");
  if (typeof clipboardList === "undefined") {
    clipboardList = [];
    ClipboardStore.set("deleteIndex", -1);
  }

  var searchResult1 = await dbget(db, { _id: "clipboard" });
  // console.log(searchResult1);

  var clipboardList;
  if (searchResult1) {
    clipboardList = searchResult1.test;
  } else {
    db.insert(
      { _id: "clipboard", test: [clipboard.readText()] },
      (error, newDoc) => {}
    );
    clipboardList = [clipboard.readText()];
  }

  db.insert(
    { _id: "currentClipboard", value: clipboard.readText() },
    (error, newDoc) => {}
  );
  clipboardList = [clipboard.readText()];
  // db.findOne({ _id: "clipboard" }, (error, docs) => {
  //   if (docs) {
  //     clipboardList = docs.test;
  //   } else {
  //     db.insert(
  //       { _id: "clipboard", test: [clipboard.readText()] },
  //       (error, newDoc) => {}
  //     );
  //   }
  // });
  // console.log(clipboardList);

  setInterval(async function () {
    var newString = clipboard.readText();
    var searchResult2 = await dbget(db, { _id: "currentClipboard" });

    if (searchResult2.value != newString) {
      console.log(newString);
      console.log(searchResult2.value);
      //新しいクリップボードをリストに追加する
      var searchResult1 = await dbget(db);
      searchResult1.test.unshift(newString);
      db.update(
        { _id: "clipboard" },
        { $set: { test: searchResult1.test } },
        // { test: clipboardList },
        (error, newDoc) => {}
      );
      db.update(
        { _id: "currentClipboard" },
        { $set: { value: newString } },
        // { test: clipboardList },
        (error, newDoc) => {}
      );
    }

    // if (clipboardList[0] != newString) {
    //   //リスト内の項目をクリックして閉じられてた場合リストから削除する
    //   var deleteIndex = ClipboardStore.get("deleteIndex");
    //   if (deleteIndex != ClipboardNotDeleteIndex) {
    //     clipboardList.splice(deleteIndex, 1);
    //     ClipboardStore.set("deleteIndex", ClipboardNotDeleteIndex);
    //   }

    //   //リストの上限数を超えている場合その分削除する
    //   if (clipboardList.length > ClipboardMaxCount) {
    //     var deleteArray = clipboardList.length - ClipboardMaxCount;
    //     clipboardList.splice(0, deleteArray);
    //   }

    //   var allDeleteFlag = ClipboardStore.get("allDeleteFlag");
    //   if (allDeleteFlag) {
    //     // クリアボタンを押して閉じられてた場合新しいクリップボードのみ追加する
    //     // ClipboardStore.set("clipboardString", []);
    //     ClipboardStore.set("clipboardString", [newString]);
    //     ClipboardStore.set("allDeleteFlag", false);
    //   } else {
    //     //新しいクリップボードをリストに追加する
    //     clipboardList.unshift(newString);
    //     ClipboardStore.set("clipboardString", clipboardList);
    //   }
    // }
  }, 1000);
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
