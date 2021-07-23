import { app, Menu, Tray } from "electron";
import { appSettingInit } from "../controllers/AppSettingController";

//タスクトレイ設定
export function trayInit(DbSet) {
  const tray = new Tray(__dirname + "/icon/icon.png");
  var contextMenu = Menu.buildFromTemplate([
    {
      label: "設定",
      click: () => {
        appSettingInit(DbSet.InMemoryDb, DbSet.AppSettingDb);
      },
    },
    {
      label: "起動",
      submenu: [
        {
          label: "再起動",
          click: () => {
            app.relaunch();
            app.exit();
          },
        },
        {
          label: "終了",
          click: () => {
            app.exit();
          },
        },
      ],
    },
  ]);
  tray.setContextMenu(contextMenu);
}
