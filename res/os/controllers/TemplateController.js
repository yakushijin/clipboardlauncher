import { ipcMain } from "electron";
import { nedbFindOne, nedbInsert, nedbUpdate } from "../dao/Transaction";
import { BaseTest } from "../hard/Window";

const TemplateDispInfo = { x: 1000, y: 600, autoClose: true };
const TemplateApi = {
  gettemplateClipboard: "gettemplateClipboard",
  templateGet: "templateGet",
  updateTemplate: "updateTemplate",
};

export async function templateInit(InMemoryDb, db) {
  const base = new BaseTest(
    1000,
    600,
    true,
    "template",
    InMemoryDb,
    db,
    TemplateApi
  );
  base.commonApi();
  templateStore(base.window(), InMemoryDb, db);
}

async function templateStore(mainWindow, InMemoryDb, db) {
  var initList = await nedbFindOne(db, { _id: "template" });

  const Date = dateGet();

  //nedbに何もない場合初期化
  if (!initList) {
    await nedbInsert(db, {
      _id: "template",
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

  //ショートカット初回画面表示時の処理
  ipcMain.handle(
    TemplateApi.gettemplateClipboard,
    async (event, someArgument) => {
      var latestClipboardList = await nedbFindOne(db, { _id: "template" });
      return latestClipboardList.value;
    }
  );

  //ショートカット初回画面表示時の処理
  ipcMain.handle(TemplateApi.templateGet, async (event, id) => {
    var latestClipboardList = await nedbFindOne(db, { _id: id });
    return latestClipboardList.value;
  });

  //更新
  ipcMain.handle(TemplateApi.updateTemplate, (event, data) => {
    db.update(
      { _id: "template" },
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
