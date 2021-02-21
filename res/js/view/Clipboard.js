import React, { useState } from "react";
import { SimpleList } from "../components/List";
import { DefaultButton } from "../components/Button";
import { initDataGet, dataSet } from "../common/ProcessInterface";

const ListSetTest = [1, 2, 3, "aaa"];

export const Clipboard = () => {
  const [data, setData] = useState([]);
  console.log(data);

  if (data.length == 0) {
    initDataGet(setData);
  }
  // initDataGet(setData);

  return (
    <div>
      <SimpleList listData={data} />
      <DefaultButton name="クリア" />
    </div>
  );
};
