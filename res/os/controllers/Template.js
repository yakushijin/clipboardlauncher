import { ipcMain } from "electron";
import { nedbFindOne, nedbInsert, nedbUpdate } from "../dao/Transaction";
import { windowOpen } from "../common/Window";
const TemplateDispInfo = { x: 600, y: 600, autoClose: true };

export async function templateInit(InMemoryDb, db) {
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
    templateStore(mainWindow, InMemoryDb, db);
    nedbUpdate(InMemoryDb, { _id: "templateDispOpen" }, { value: true });
  }
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

  //画面情報取得
  ipcMain.handle("gettemplateDispSize", (event, someArgument) => {
    return TemplateDispInfo;
  });

  //ショートカット初回画面表示時の処理
  ipcMain.handle("gettemplateClipboard", async (event, someArgument) => {
    var latestClipboardList = await nedbFindOne(db, { _id: "template" });
    return latestClipboardList.value;
  });

  //ショートカット初回画面表示時の処理
  ipcMain.handle("templateGet", async (event, id) => {
    var latestClipboardList = await nedbFindOne(db, { _id: id });
    return latestClipboardList.value;
  });

  //閉じるボタン
  ipcMain.handle("templateWindowClose", async (event) => {
    mainWindow.close();
    templateClose(InMemoryDb);
  });
}

function templateClose(InMemoryDb) {
  ipcMain.removeHandler("gettemplateDispSize");
  ipcMain.removeHandler("gettemplateClipboard");
  ipcMain.removeHandler("templateGet");
  ipcMain.removeHandler("templateWindowClose");
  nedbUpdate(InMemoryDb, { _id: "templateDispOpen" }, { value: false });
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
