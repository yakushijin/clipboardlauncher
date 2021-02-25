import fs from "fs";
import { dialog, BrowserWindow } from "electron";

export function openDirectory(path) {
  dialog.showOpenDialog({
    defaultPath: path,
    properties: ["openFile", "openDirectory"],
  });
}
