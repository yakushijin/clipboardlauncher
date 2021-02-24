import React from "react";
import { HeaderArea, TitleArea, IconArea } from "../components/Header";
import { ClearListIcon, DispCloseIcon } from "../components/Icon";
import { ScrollableTabsButtonAuto } from "../components/Tab";

const close = () => {
  ipcRenderer.invoke("shortcutWindowClose");
};

export const Shortcut = () => {
  return (
    <React.Fragment>
      <HeaderArea>
        <TitleArea>ショートカットリンク</TitleArea>
        <IconArea>
          <DispCloseIcon onClick={close} />
        </IconArea>
      </HeaderArea>
      <ScrollableTabsButtonAuto />;
    </React.Fragment>
  );
};

export function shortcutWindowClose() {
  const GetDispSizeType = "getshortcutDispSize";
  const CloseDispType = "shortcutWindowClose";

  ipcRenderer.invoke(GetDispSizeType).then((result) => {
    window.addEventListener("mousemove", (event) => {
      if (result.autoClose) {
        if (
          event.clientX < 20 ||
          event.clientY < 20 ||
          event.clientX > result.x - 20 ||
          event.clientY > result.y - 20
        ) {
          ipcRenderer.invoke(CloseDispType);
        }
      }
    });
  });
}
