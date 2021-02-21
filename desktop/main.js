const {
  app,
  globalShortcut,
  ipcMain,
  Menu,
  Tray,
  BrowserWindow,
  clipboard,
} = require("electron");
const path = require("path");

const Store = require("electron-store");
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

/*===============================
 アプリケーション起動直後の処理
 ===============================*/
app.whenReady().then(() => {
  const tray = new Tray(__dirname + "/icon/icon.png");
  var contextMenu = Menu.buildFromTemplate([
    {
      label: "表示",
      click: () => {
        createWindow();
      },
    },
    {
      label: "終了",
      click: function () {
        mainWindow.close();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);

  globalShortcut.register(ClipboardOpenButton, () => {
    windowOpen(800, 400, "clipboard");
    clipboardStore();
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
  if (process.platform !== "darwin") app.quit();
});

/*===============================
 ウィンドウオープン共通
 ===============================*/

function windowOpen(width, height, fileName) {
  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    // show: false, // アプリ起動時にウィンドウを表示しない
    skipTaskbar: true, // タスクバーに表示しない
  });
  mainWindow.loadFile("public/" + fileName + ".html", ["test"]);
}

/*===============================
 クリップボード関連
 ===============================*/

function clipboardStore() {
  ipcMain.handle("getClipboard", async (event, someArgument) => {
    const programs = ClipboardStore.get("clipboardString");
    return programs;
  });
}

//クリップボード監視（画面開いていなくても実行）
function clipboardSurveillance() {
  var clipboardList = ClipboardStore.get("clipboardString");
  if (typeof clipboardList === "undefined") {
    clipboardList = [];
  }

  setInterval(function () {
    var newString = clipboard.readText();

    if (clipboardList[clipboardList.length - 1] != newString) {
      clipboardList.push(newString);
      ClipboardStore.set("clipboardString", clipboardList);
    }
  }, 500);
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
