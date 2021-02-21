// Modules to control application life and create native browser window
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

function clipboardWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 200,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    // show: false, // アプリ起動時にウィンドウを表示しない
    skipTaskbar: true, // タスクバーに表示しない
  });

  // and load the index.html of the app.
  mainWindow.loadFile("public/clipboard.html", ["test"]);

  ipcMain.handle("getClipboard", async (event, someArgument) => {
    const programs = ClipboardStore.get("clipboardString");
    return programs;
  });
}

function shortcutWindow() {
  ShortcutStore.set("programs", { id: 1, name: "TEST" });
  const programs = ShortcutStore.get("programs");
  console.log(programs);
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    // show: false, // アプリ起動時にウィンドウを表示しない
    skipTaskbar: true, // タスクバーに表示しない
  });

  // and load the index.html of the app.
  mainWindow.loadFile("public/shortcut.html", ["test"]);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

function templateWindow() {
  TemplateStore.set("programs", [{ id: 1, name: "TEST" }]);
  const programs = TemplateStore.get("programs");
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 400,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
    // show: false, // アプリ起動時にウィンドウを表示しない
    skipTaskbar: true, // タスクバーに表示しない
  });

  // and load the index.html of the app.
  mainWindow.loadFile("public/template.html", ["test"]);

  ipcMain.handle("some-name", async (event, someArgument) => {
    // const result = await someArgument;
    return programs;
  });

  ipcMain.handle("set", async (event, someArgument) => {
    console.log(3);
    TemplateStore.set("programs", { id: 2, name: "TEST2" });
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
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
  // createWindow();

  // app.on("activate", function () {
  //   if (BrowserWindow.getAllWindows().length === 0) createWindow();
  // });

  const ret = globalShortcut.register("CommandOrControl+X", () => {
    clipboardWindow();
  });

  const ret2 = globalShortcut.register("CommandOrControl+C", () => {
    shortcutWindow();
  });

  const ret3 = globalShortcut.register("CommandOrControl+Z", () => {
    templateWindow();
  });

  if (!ret) {
    console.log("registration failed");
  }

  clipboardSurveillance();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

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
