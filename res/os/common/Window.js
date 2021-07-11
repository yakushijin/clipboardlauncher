import { app, Menu, Tray, globalShortcut } from "electron";
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
