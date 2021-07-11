import {
  app,
  Menu,
  Tray,
  globalShortcut,
  BrowserWindow,
  screen,
} from "electron";
import path from "path";
// const path = require("path");
import { shortcutInit } from "../controllers/Shortcut";
import { templateInit } from "../controllers/Template";
import { clipboardInit, clipboardSurveillance } from "../controllers/Clipboard";

//タスクトレイ設定
export function trayInit() {
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
}

//キーボードショートカット設定
export function keyboardSetting(DbSet) {
  const ClipboardOpenButton = "CommandOrControl+Shift+Z";
  const ShortcutOpenButton = "CommandOrControl+Shift+X";
  const TemplateOpenButton = "CommandOrControl+Shift+C";

  globalShortcut.register(ClipboardOpenButton, () => {
    clipboardInit(DbSet.InMemoryDb, DbSet.ClipboardDb);
  });

  globalShortcut.register(ShortcutOpenButton, () => {
    shortcutInit(DbSet.InMemoryDb, DbSet.ShortcutDb);
  });

  globalShortcut.register(TemplateOpenButton, () => {
    templateInit(DbSet.InMemoryDb, DbSet.TemplateDb);
  });
}

//ウィンドウ表示設定
export function windowOpen(width, height, fileName) {
  var mouthPoint = screen.getCursorScreenPoint();
  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
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
  mainWindow.loadFile("public/" + fileName + ".html", ["test"]);
  // mainWindow.close();
  return mainWindow;
}
