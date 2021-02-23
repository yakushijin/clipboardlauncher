import React, { useState } from "react";
import { SimpleList } from "../components/List";
import { DefaultButton } from "../components/Button";
import { initDataGet, dataSet } from "../common/ProcessInterface";

const allDelete = () => {
  ipcRenderer.invoke("clipboardAllDelete");
};

export const Clipboard = () => {
  window.addEventListener("mousemove", ClipboardWindowClose);

  const [data, setData] = useState([]);
  console.log(data);

  if (data.length == 0) {
    initDataGet(setData);
  }

  return (
    <div>
      <SimpleList listData={data} />
      <DefaultButton name="クリア" onClick={allDelete} />
    </div>
  );
};

const ClipboardWindowClose = (event) => {
  console.log(event.clientX, event.clientY);
  // console.log(event);
  if (
    event.clientX < 6 ||
    event.clientY < 6 ||
    event.clientX > 792 ||
    event.clientY > 392
  ) {
    console.log(2);
    ipcRenderer.invoke("clipboardWindowClose");
  }
};
