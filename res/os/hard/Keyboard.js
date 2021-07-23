import { globalShortcut } from "electron";
import { shortcutInit } from "../controllers/ShortcutController";
import { templateInit } from "../controllers/TemplateController";
import { clipboardInit } from "../controllers/ClipboardController";

//キーボードショートカット設定
export function keyboardSetting(DbSet) {
  const ClipboardOpenButton = "CommandOrControl+Alt+Z";
  const ShortcutOpenButton = "CommandOrControl+Alt+X";
  const TemplateOpenButton = "CommandOrControl+Alt+C";

  globalShortcut.register(ClipboardOpenButton, () => {
    clipboardInit(DbSet.InMemoryDb, DbSet.ClipboardDb);
  });

  globalShortcut.register(ShortcutOpenButton, () => {
    shortcutInit(DbSet.InMemoryDb, DbSet.ShortcutDb);
  });

  globalShortcut.register(TemplateOpenButton, () => {
    templateInit(DbSet.InMemoryDb, DbSet.TemplateDb);
  });
}
