import { app } from "electron";
import { dbInit } from "./dao/Create";
import { trayInit } from "./hard/Tray";
import { keyboardSetting } from "./hard/Keyboard";
import { clipboardSurveillance } from "./controllers/ClipboardController";

app.whenReady().then(() => {
  const DbSet = dbInit();

  trayInit();

  keyboardSetting(DbSet);

  clipboardSurveillance(DbSet.ClipboardDb);
});

app.on("window-all-closed", function () {
  // if (process.platform !== "darwin") app.quit();
});
