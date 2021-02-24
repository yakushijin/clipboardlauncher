import { app } from "electron";
import { dbInit } from "./dao/Create";
import { trayInit, keyboardSetting } from "./common/Window";
import { clipboardSurveillance } from "./controllers/Clipboard";

app.whenReady().then(() => {
  const DbSet = dbInit();

  trayInit();

  keyboardSetting(DbSet);

  clipboardSurveillance(DbSet.ClipboardDb);
});

app.on("window-all-closed", function () {
  // if (process.platform !== "darwin") app.quit();
});
