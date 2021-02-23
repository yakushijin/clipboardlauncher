import React, { useState } from "react";
import { SimpleList } from "../components/List";
import { DefaultButton } from "../components/Button";
import { initDataGet, dataSet } from "../common/ProcessInterface";

const allDelete = () => {
  ipcRenderer.invoke("clipboardAllDelete");
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
    </div>
  );
};
