import { clipboard } from "electron";
import { nedbFindOne, nedbInsert, nedbUpdate } from "../dao/Transaction";

const ClipboardMaxCount = 20;
const ClipboardSurveillanceTime = 1000;

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
