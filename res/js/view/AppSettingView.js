import React, { useState } from "react";

import { HeaderArea, TitleArea, IconArea } from "../components/Header";
import { DataEditIcon, DispCloseIcon, DataAddIcon } from "../components/Icon";
import styled from "styled-components";
import { initDataGet, dataSet } from "../common/ProcessInterface";
import { FeatureApi, CommonApi } from "../const/AppSettingConst";

const close = () => {
  ipcRenderer.invoke(CommonApi.windowClose);
};

export const AppSettingView = () => {
  const [data, setData] = useState([]);

  initDataGet(CommonApi.getDbData, data, setData);

  return (
    <React.Fragment>
      <HeaderArea>
        <TitleArea>アプリケーション設定</TitleArea>
        <IconArea>
          <DispCloseIcon onClick={close} />
        </IconArea>
      </HeaderArea>
      <div>test</div>
    </React.Fragment>
  );
};
