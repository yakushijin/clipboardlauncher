import React from "react";
import { SimpleList } from "../components/List";
import { DefaultButton } from "../components/Button";

const ListSetTest = [1, 2, 3, "aaa"];

export const Clipboard = () => {
  return (
    <div>
      <SimpleList listData={ListSetTest} />
      <DefaultButton name="クリア" />
    </div>
  );
};
