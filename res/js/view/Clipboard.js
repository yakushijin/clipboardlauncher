import React, { useState } from "react";
import { SimpleList } from "../components/List";
import { DefaultButton } from "../components/Button";
import { initDataGet, dataSet } from "../common/ProcessInterface";

const allDelete = () => {
  ipcRenderer.invoke("clipboardAllDelete");
};

const close = () => {
  ipcRenderer.invoke("clipboardWindowClose");
};

export const Clipboard = () => {
  const [data, setData] = useState([]);
  console.log(data);

  if (data.length == 0) {
    initDataGet(setData);
  }

  return (
    <div>
      <SimpleList listData={data} />
      <DefaultButton name="クリア" onClick={allDelete} />
      <DefaultButton name="閉じる" onClick={close} />
    </div>
  );
};

export function clipboardWindowClose() {
  const GetDispSizeType = "getDispSize";
  const CloseDispType = "clipboardWindowClose";

  ipcRenderer.invoke(GetDispSizeType).then((result) => {
    window.addEventListener("mousemove", (event) => {
      if (result.autoClose) {
        if (
          event.clientX < 6 ||
          event.clientY < 6 ||
          event.clientX > result.x - 10 ||
          event.clientY > result.y - 10
        ) {
          ipcRenderer.invoke(CloseDispType);
        }
      }
    });
  });
}
