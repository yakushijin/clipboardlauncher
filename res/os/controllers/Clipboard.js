import { ipcMain, clipboard } from "electron";
import { nedbFindOne, nedbInsert, nedbUpdate } from "../dao/Transaction";
import { windowOpen } from "../common/Window";

const ClipboardMaxCount = 20;
const ClipboardSurveillanceTime = 1000;
const ClipboardDispInfo = { x: 400, y: 800, autoClose: true };
const ClipboardApi = {
  getDispSize: "getDispSize",
  getClipboard: "getClipboard",
  clipboardSet: "clipboardSet",
  clipboardAllDelete: "clipboardAllDelete",
  clipboardWindowClose: "clipboardWindowClose",
};

//キーボードからの呼び出し処理
export async function clipboardInit(InMemoryDb, db) {
  //ウィンドウが開いている場合は新たに開かない
  const DispStatus = await nedbFindOne(InMemoryDb, {
    _id: "clipboardDispOpen",
  });
  if (!DispStatus.value) {
    const mainWindow = windowOpen(
      ClipboardDispInfo.x,
      ClipboardDispInfo.y,
      "clipboard"
    );
    clipboardStore(mainWindow, InMemoryDb, db);
    nedbUpdate(InMemoryDb, { _id: "clipboardDispOpen" }, { value: true });
  }
}

//各イベント登録
function clipboardStore(mainWindow, InMemoryDb, db) {
  //画面情報取得
  ipcMain.handle(ClipboardApi.getDispSize, (event, someArgument) => {
    return ClipboardDispInfo;
  });

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

  //クリップボード一覧閉じるボタン押下時の処理
  ipcMain.handle(ClipboardApi.clipboardWindowClose, async (event) => {
    mainWindow.close();
    ipcClose(InMemoryDb);
  });
}

//共通終了処理
function ipcClose(InMemoryDb) {
  Object.keys(ClipboardApi).forEach((key) =>
    ipcMain.removeHandler(ClipboardApi[key])
  );
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
