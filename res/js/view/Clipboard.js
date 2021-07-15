import React, { useState } from "react";
import { SimpleList } from "../components/List";
import { HeaderArea, TitleArea, IconArea } from "../components/Header";
import { ClearListIcon, DispCloseIcon } from "../components/Icon";
import { initDataGet, dataSet } from "../common/ProcessInterface";
import { FeatureApi, CommonApi } from "../const/ClipboardConst";

import styled from "styled-components";

const ListArea = styled.div`
  height: 90vh;
  display: block;
  overflow: auto;
  margin: 4px;
  /* background: #fff; */

  /* スクロールの幅の設定 */
  ::-webkit-scrollbar {
    width: 4px;
    background: #1959a8;
  }

  /* スクロールの背景の設定 */
  ::-webkit-scrollbar-track {
    box-shadow: 0 0 4px #aaa inset;
    background: #ccc;
  }

  /* スクロールのつまみ部分の設定 */
  ::-webkit-scrollbar-thumb {
    background: #000;
  }
`;

const allDelete = () => {
  ipcRenderer.invoke(FeatureApi.clipboardAllDelete);
  ipcRenderer.invoke(CommonApi.windowClose);
};

const close = () => {
  ipcRenderer.invoke(CommonApi.windowClose);
};

export const Clipboard = () => {
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
      <ListArea>
        <SimpleList listData={data} />
      </ListArea>
    </React.Fragment>
  );
};
