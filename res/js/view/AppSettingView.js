import React, { useState } from "react";

import { DefaultCheckbox } from "../components/Checkbox";
import { DefaultButton } from "../components/Button";

import { initDataGet } from "../common/ProcessInterface";
import { FeatureApi, CommonApi } from "../const/AppSettingConst";

import styled from "styled-components";

const SettingArea = styled.div`
  height: 70%;
  display: block;
`;

const ButtonArea = styled.div`
  text-align: center;
  height: 30%;
  display: block;
`;

export const AppSettingView = () => {
  const [data, setData] = useState([]);

  initDataGet(CommonApi.getDbData, data, setData);

  const setAutoWindowClose = (e) => {
    data[0].autoWindowClose = e.target.checked;
    const newData = data.slice();
    setData(newData);
  };

  const updateAutoWindowClose = () => {
    ipcRenderer
      .invoke(FeatureApi.updateAppSetting, data)
      .then(ipcRenderer.invoke(CommonApi.windowClose));
  };

  return (
    <React.Fragment>
      <SettingArea>
        {data.map((column) => (
          <DefaultCheckbox
            name="ウィンドウの自動クローズ"
            value={column.autoWindowClose}
            onChange={setAutoWindowClose}
          ></DefaultCheckbox>
        ))}
      </SettingArea>
      <ButtonArea>
        <DefaultButton
          onClick={updateAutoWindowClose}
          name={"更新"}
        ></DefaultButton>
      </ButtonArea>
    </React.Fragment>
  );
};
