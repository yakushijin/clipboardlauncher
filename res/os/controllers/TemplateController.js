import { ipcMain } from "electron";
import { nedbFindOne, nedbInsert, nedbUpdate } from "../dao/Transaction";
import { Window } from "../hard/Window";

const FeatureName = "template";

const FeatureApi = {
  templateGet: "templateGet",
  updateTemplate: "updateTemplate",
};

const WindowSize = {
  x: 1000,
  y: 600,
};

const WindowAutoClose = true;

export async function templateInit(InMemoryDb, db) {
  const window = new Window(
    WindowSize,
    WindowAutoClose,
    FeatureName,
    InMemoryDb,
    db,
    FeatureApi
  );
  window.commonApiSet();
  featureApiSet(db);
  window.open();
}

async function featureApiSet(db) {
  ipcMain.handle(FeatureApi.templateGet, async (event, id) => {
    var latestClipboardList = await nedbFindOne(db, { _id: id });
    return latestClipboardList.value;
  });

  //更新
  ipcMain.handle(FeatureApi.updateTemplate, (event, data) => {
    db.update(
      { _id: FeatureName },
      { $set: { value: data.list } },
      (error, newDoc) => {}
    );
    nedbInsert(db, data.contents);

    return "ok";
  });
}
