import React, { useState } from "react";
import { SimpleList } from "../components/List";
import { HeaderArea, TitleArea, IconArea } from "../components/Header";
import { ClearListIcon, DispCloseIcon } from "../components/Icon";
import { initDataGet, dataSet } from "../common/ProcessInterface";
import { FeatureApi, CommonApi } from "../const/ClipboardConst";

const allDelete = () => {
  ipcRenderer.invoke(FeatureApi.clipboardAllDelete);
  ipcRenderer.invoke(CommonApi.windowClose);
};

const close = () => {
  ipcRenderer.invoke(CommonApi.windowClose);
};

export const ClipboardView = () => {
  const [data, setData] = useState([]);

  initDataGet(CommonApi.getDbData, data, setData);

  return (
    <React.Fragment>
      <HeaderArea>
        <TitleArea>クリップボード履歴</TitleArea>
        <IconArea>
          <ClearListIcon onClick={allDelete} />
          <DispCloseIcon onClick={close} />
        </IconArea>
      </HeaderArea>
      <SimpleList listData={data} />
    </React.Fragment>
  );
};
