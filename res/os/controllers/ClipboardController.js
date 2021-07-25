import { ipcMain, clipboard } from "electron";
import { nedbFindOne, nedbInsert, nedbUpdate } from "../dao/Transaction";
import { Window } from "../hard/Window";

const FeatureName = "clipboard";

const FeatureApi = {
  clipboardSet: "clipboardSet",
  clipboardAllDelete: "clipboardAllDelete",
};

const WindowSize = {
  x: 400,
  y: 800,
};

//キーボードからの呼び出し処理
export async function clipboardInit(InMemoryDb, db) {
  const window = new Window(
    WindowSize,
    FeatureName,
    InMemoryDb,
    db,
    FeatureApi
  );

  //各イベント登録
  const featureApiSet = () => {
    //クリップボード一覧クリック時の処理
    ipcMain.handle(FeatureApi.clipboardSet, async (event, index) => {
      var latestClipboardList = await nedbFindOne(db, { _id: FeatureName });
      var newClipboardData = latestClipboardList.value[index];
      latestClipboardList.value.splice(index, 1);
      await nedbUpdate(
        db,
        { _id: FeatureName },
        { value: latestClipboardList.value }
      );
      clipboard.writeText(newClipboardData);
    });

    //クリップボード一覧クリアボタン押下時の処理
    ipcMain.handle(FeatureApi.clipboardAllDelete, async (event, data) => {
      db.update(
        { _id: FeatureName },
        { $set: { value: [] } },
        (error, newDoc) => {}
      );
    });
  };

  window.open(featureApiSet);
}
