import { Menu, Tray } from "electron";
import { appSettingInit } from "../controllers/AppSettingController";

var tray;

//タスクトレイ設定
export function trayInit(DbSet) {
  tray = new Tray(__dirname + "/icon/icon.png");
  var contextMenu = Menu.buildFromTemplate([
    {
      label: "設定",
      click: () => {
        appSettingInit(DbSet.InMemoryDb, DbSet.AppSettingDb);
      },
    },
    {
      label: "起動",
      submenu: [{ label: "終了", role: "quit" }],
    },
  ]);
  tray.setContextMenu(contextMenu);
}
