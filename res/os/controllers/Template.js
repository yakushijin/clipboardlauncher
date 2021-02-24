import { ipcMain } from "electron";
import { nedbFindOne, nedbInsert, nedbUpdate } from "../dao/Dao";
import { windowOpen } from "../common/Window";
const TemplateDispInfo = { x: 600, y: 600, autoClose: true };

export async function templateInit(InMemoryDb) {
  const DispStatus = await nedbFindOne(InMemoryDb, {
    _id: "templateDispOpen",
  });
  if (DispStatus.value) {
  } else {
    const mainWindow = windowOpen(
      TemplateDispInfo.x,
      TemplateDispInfo.y,
      "template"
    );
    templateStore(mainWindow, InMemoryDb);
    nedbUpdate(InMemoryDb, { _id: "templateDispOpen" }, { value: true });
  }
}

function templateStore(mainWindow, InMemoryDb) {}
