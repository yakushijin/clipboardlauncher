import { ipcMain, clipboard } from "electron";
import { nedbFindOne, nedbInsert, nedbUpdate } from "../dao/Transaction";
import { windowOpen } from "../common/Window";

const ClipboardMaxCount = 20;
const ClipboardSurveillanceTime = 1000;
const ClipboardDispInfo = { x: 400, y: 800, autoClose: true };

export async function clipboardInit(InMemoryDb, db) {
  const DispStatus = await nedbFindOne(InMemoryDb, {
    _id: "clipboardDispOpen",
  });
  console.log(DispStatus);
  if (DispStatus.value) {
    // nedbUpdate(InMemoryDb, { _id: "clipboardDispOpen" }, { value: false });
  } else {
    const mainWindow = windowOpen(
      ClipboardDispInfo.x,
      ClipboardDispInfo.y,
      "clipboard"
    );
    clipboardStore(mainWindow, InMemoryDb, db);
    nedbUpdate(InMemoryDb, { _id: "clipboardDispOpen" }, { value: true });
  }
}

function clipboardStore(mainWindow, InMemoryDb, db) {
  //画面情報取得
  ipcMain.handle("getDispSize", (event, someArgument) => {
    return { x: 400, y: 800, autoClose: true };
  });

  //クリップボード一覧初回画面表示時の処理
  ipcMain.handle("getClipboard", async (event, someArgument) => {
    var latestClipboardList = await nedbFindOne(db, { _id: "clipboard" });
    return latestClipboardList.value;
  });

  //クリップボード一覧クリック時の処理
  ipcMain.handle("clipboardSet", async (event, index) => {
    var latestClipboardList = await nedbFindOne(db, { _id: "clipboard" });
    var newClipboardData = latestClipboardList.value[index];
    latestClipboardList.value.splice(index, 1);
    await nedbUpdate(
      db,
      { _id: "clipboard" },
      { value: latestClipboardList.value }
    );
    clipboard.writeText(newClipboardData);
    mainWindow.close();
    ipcClose(InMemoryDb);
  });

  //クリップボード一覧クリアボタン押下時の処理
  ipcMain.handle("clipboardAllDelete", async (event, data) => {
    db.update(
      { _id: "clipboard" },
      { $set: { value: [] } },
      (error, newDoc) => {}
    );
    mainWindow.close();
    ipcClose(InMemoryDb);
  });

  //クリップボード一覧クリアボタン押下時の処理
  ipcMain.handle("clipboardWindowClose", async (event) => {
    mainWindow.close();
    ipcClose(InMemoryDb);
  });
}

function ipcClose(InMemoryDb) {
  ipcMain.removeHandler("getDispSize");
  ipcMain.removeHandler("getClipboard");
  ipcMain.removeHandler("clipboardSet");
  ipcMain.removeHandler("clipboardAllDelete");
  ipcMain.removeHandler("clipboardWindowClose");
  nedbUpdate(InMemoryDb, { _id: "clipboardDispOpen" }, { value: false });
}

//クリップボード監視（画面開いていなくても実行）
export async function clipboardSurveillance(db) {
  var currentClipboard = clipboard.readText();
  var initClipboardList = await nedbFindOne(db, { _id: "clipboard" });

  //nedbに何もない場合初期化
  if (!initClipboardList) {
    await nedbInsert(db, { _id: "clipboard", value: [currentClipboard] });
    await nedbInsert(db, { _id: "currentClipboard", value: currentClipboard });
  }

  //常駐プログラム処理
  setInterval(async () => {
    var newString = clipboard.readText();
    var currentClipboardList = await nedbFindOne(db, {
      _id: "currentClipboard",
    });

    //最新のクリップボードに変更が加わった場合後続処理を実行する
    if (currentClipboardList.value != newString) {
      console.log(newString);
      console.log(currentClipboardList.value);

      //最新のリストをdbから取得
      var newClipboardList = await nedbFindOne(db, { _id: "clipboard" });

      //リストの上限数を超えている場合その分削除する
      if (newClipboardList.value.length > ClipboardMaxCount) {
        const deleteArray = newClipboardList.value.length - ClipboardMaxCount;
        newClipboardList.value.splice(0, deleteArray);
      }

      //新しいクリップボードをリストに追加する
      newClipboardList.value.unshift(newString);
      await nedbUpdate(
        db,
        { _id: "clipboard" },
        { value: newClipboardList.value }
      );
      await nedbUpdate(db, { _id: "currentClipboard" }, { value: newString });
    }
  }, ClipboardSurveillanceTime);
}
