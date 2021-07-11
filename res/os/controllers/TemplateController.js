import { ipcMain } from "electron";
import { nedbFindOne, nedbInsert, nedbUpdate } from "../dao/Transaction";
import { Window } from "../hard/Window";

const FeatureName = "template";

const FeatureApi = {
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
  var initList = await nedbFindOne(db, { _id: FeatureName });

  const Date = dateGet();

  //nedbに何もない場合初期化
  if (!initList) {
    await nedbInsert(db, {
      _id: FeatureName,
      value: [
        { listId: "t" + Date, listName: "aaa" },
        { listId: "t2" + Date, listName: "bbb" },
        { listId: "t3" + Date, listName: "ccc" },
      ],
    });
    await nedbInsert(db, {
      _id: "t" + Date,
      value: "contents",
    });
    await nedbInsert(db, {
      _id: "t2" + Date,
      value: "あああああ",
    });
    await nedbInsert(db, {
      _id: "t3" + Date,
      value: "！？",
    });
  }

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

function dateGet() {
  var date = new Date();
  return (
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2) +
    date.getMilliseconds()
  );
}
