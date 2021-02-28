import fs from "fs";
import { dialog, shell } from "electron";

export function openFileOrDirectory(path) {
  shell.openPath(path);
}

export function openBrowser(path) {
  shell.openExternal(path);
}
