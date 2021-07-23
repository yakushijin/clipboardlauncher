import { app, Menu, Tray } from "electron";

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
      label: "再起動",
      click: function () {
        app.relaunch();
        app.exit();
      },
    },
    {
      label: "終了",
      click: function () {
        app.exit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
}
