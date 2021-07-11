import { ipcMain, clipboard } from "electron";
import { nedbFindOne, nedbInsert, nedbUpdate } from "../dao/Transaction";
import { BaseTest } from "./Base";

const ClipboardMaxCount = 20;
const ClipboardSurveillanceTime = 1000;
const ClipboardDispInfo = { x: 400, y: 800, autoClose: true };
const ClipboardApi = {
  getClipboard: "getClipboard",
  clipboardSet: "clipboardSet",
  clipboardAllDelete: "clipboardAllDelete",
};

//キーボードからの呼び出し処理
export async function clipboardInit(InMemoryDb, db) {
  const base = new BaseTest(
    400,
    800,
    true,
    "clipboard",
    InMemoryDb,
    db,
    ClipboardApi
  );

  base.commonApi();
  clipboardStore(base.window(), InMemoryDb, db);
}

//各イベント登録
function clipboardStore(mainWindow, InMemoryDb, db) {
  //クリップボード一覧初回画面表示時の処理
  ipcMain.handle(ClipboardApi.getClipboard, async (event, someArgument) => {
    var latestClipboardList = await nedbFindOne(db, { _id: "clipboard" });
    return latestClipboardList.value;
  });

  //クリップボード一覧クリック時の処理
  ipcMain.handle(ClipboardApi.clipboardSet, async (event, index) => {
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
  ipcMain.handle(ClipboardApi.clipboardAllDelete, async (event, data) => {
    db.update(
      { _id: "clipboard" },
      { $set: { value: [] } },
      (error, newDoc) => {}
    );
    mainWindow.close();
    ipcClose(InMemoryDb);
  });
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
