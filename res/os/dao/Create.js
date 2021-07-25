const Database = require("nedb");
import { nedbFindOne, nedbInsert } from "./Transaction";

const DbSaveFilePath = ".desktop-kouritsukakun/db/";

//DB初期設定処理
export function dbInit() {
  const DbSet = {
    InMemoryDb: inMemoryDbInit(),
    AppSettingDb: fileDbInit(DbSaveFilePath + "appSetting.db"),
    ClipboardDb: fileDbInit(DbSaveFilePath + "clipboard.db"),
    ShortcutDb: fileDbInit(DbSaveFilePath + "shortcut.db"),
    TemplateDb: fileDbInit(DbSaveFilePath + "template.db"),
  };

  appSettingInit(DbSet);

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

//設定ファイル初期化
async function appSettingInit(DbSet) {
  const DefaultSettingData = {
    autoWindowClose: true,
  };

  var dbData = await nedbFindOne(DbSet.AppSettingDb, { _id: "appSetting" });
  if (!dbData) {
    nedbInsert(DbSet.AppSettingDb, {
      _id: "appSetting",
      value: [DefaultSettingData],
    });
    nedbInsert(DbSet.InMemoryDb, {
      _id: "appSettingData",
      value: [DefaultSettingData],
    });
  } else {
    nedbInsert(DbSet.InMemoryDb, {
      _id: "appSettingData",
      value: dbData.value,
    });
  }
}
