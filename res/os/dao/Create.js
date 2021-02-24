const Database = require("nedb");
import { nedbInsert } from "./Transaction";

export function dbInit() {
  const DbSet = {
    InMemoryDb: inMemoryDbInit(),
    ClipboardDb: fileDbInit("clipboard.db"),
    ShortcutDb: fileDbInit("shortcut.db"),
    TemplateDb: fileDbInit("template.db"),
  };

  nedbInsert(DbSet.InMemoryDb, { _id: "clipboardDispOpen", value: false });
  nedbInsert(DbSet.InMemoryDb, { _id: "shortcutDispOpen", value: false });
  nedbInsert(DbSet.InMemoryDb, { _id: "templateDispOpen", value: false });

  return DbSet;
}

function inMemoryDbInit() {
  const db = new Database();
  db.loadDatabase((error) => {
    if (error !== null) {
      console.error(error);
    }
  });
  return db;
}

function fileDbInit(fileName) {
  const db = new Database({ filename: fileName });
  db.loadDatabase((error) => {
    if (error !== null) {
      console.error(error);
    }
  });
  return db;
}
