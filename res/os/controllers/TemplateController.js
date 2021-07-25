import { ipcMain } from "electron";
import {
  nedbFindOne,
  nedbInsert,
  nedbUpdate,
  nedbDelete,
} from "../dao/Transaction";
import { Window } from "../hard/Window";

const FeatureName = "template";

const FeatureApi = {
  templateGet: "templateGet",
  postTemplate: "postTemplate",
  putTemplate: "putTemplate",
  deleteTemplate: "deleteTemplate",
};

const WindowSize = {
  x: 1000,
  y: 600,
};

export async function templateInit(InMemoryDb, db) {
  const window = new Window(
    WindowSize,
    FeatureName,
    InMemoryDb,
    db,
    FeatureApi
  );

  const featureApiSet = () => {
    ipcMain.handle(FeatureApi.templateGet, async (event, id) => {
      var latestClipboardList = await nedbFindOne(db, { _id: id });
      return latestClipboardList.value;
    });

    //作成
    ipcMain.handle(FeatureApi.postTemplate, (event, data) => {
      nedbUpdate(db, { _id: FeatureName }, { value: data.list });
      nedbInsert(db, data.contents);

      return "ok";
    });

    //更新
    ipcMain.handle(FeatureApi.putTemplate, (event, data) => {
      nedbUpdate(db, { _id: FeatureName }, { value: data.list });
      nedbUpdate(db, { _id: data.contents.id }, { value: data.contents.value });

      return "ok";
    });

    //削除
    ipcMain.handle(FeatureApi.deleteTemplate, (event, data) => {
      nedbUpdate(db, { _id: FeatureName }, { value: data.list });
      nedbDelete(db, { _id: data.contents.id });

      return "ok";
    });
  };

  window.open(featureApiSet);
}
