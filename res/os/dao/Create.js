const Database = require("nedb");
import { nedbInsert } from "./Transaction";

//DB初期設定処理
export function dbInit() {
  const DbSet = {
    InMemoryDb: inMemoryDbInit(),
    AppSettingDb: fileDbInit("appSetting.db"),
    ClipboardDb: fileDbInit("clipboard.db"),
    ShortcutDb: fileDbInit("shortcut.db"),
    TemplateDb: fileDbInit("template.db"),
  };

  nedbInsert(DbSet.InMemoryDb, { _id: "appSettingDispOpen", value: false });
  nedbInsert(DbSet.InMemoryDb, { _id: "clipboardDispOpen", value: false });
  nedbInsert(DbSet.InMemoryDb, { _id: "shortcutDispOpen", value: false });
  nedbInsert(DbSet.InMemoryDb, { _id: "templateDispOpen", value: false });

  return DbSet;
}

//インメモリDBの作成
function inMemoryDbInit() {
  const db = new Database();
  db.loadDatabase((error) => {
    if (error !== null) {
      console.error(error);
    }
  });
  return db;
}

//各ファイルからデータを読み込む
function fileDbInit(fileName) {
  const db = new Database({ filename: fileName });
  db.loadDatabase((error) => {
    if (error !== null) {
      console.error(error);
    }
  });
  return db;
}
