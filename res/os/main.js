import { app } from "electron";
import { dbInit } from "./dao/Create";
import { trayInit } from "./hard/Tray";
import { keyboardSetting } from "./hard/Keyboard";
import { clipboardSurveillance } from "./hard/Clipboard";

app.whenReady().then(() => {
  try {
    const DbSet = dbInit();

    trayInit(DbSet);

    keyboardSetting(DbSet);

    clipboardSurveillance(DbSet.ClipboardDb);
  } catch (error) {
    console.error(error);
  }
});

app.on("window-all-closed", function () {
  // if (process.platform !== "darwin") app.quit();
});
