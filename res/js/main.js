import React from "react";
import ReactDOM from "react-dom";

import { Clipboard, ClipboardWindowClose } from "./view/Clipboard";
import { Shortcut } from "./view/Shortcut";
import { Template } from "./view/Template";

function ClipboardEntry() {
  // window.addEventListener("mousemove", ClipboardWindowClose);
  return (
    <div>
      <Clipboard />
    </div>
  );
}

if (document.getElementById("clipboardApp")) {
  ReactDOM.render(<ClipboardEntry />, document.getElementById("clipboardApp"));
}

function ShortcutEntry() {
  return <Shortcut />;
}

if (document.getElementById("shortcutApp")) {
  ReactDOM.render(<ShortcutEntry />, document.getElementById("shortcutApp"));
}

function TemplateEntry() {
  return <Template />;
}

if (document.getElementById("templateApp")) {
  ReactDOM.render(<TemplateEntry />, document.getElementById("templateApp"));
}
