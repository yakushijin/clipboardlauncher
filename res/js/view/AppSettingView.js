import React, { useState } from "react";

import { DefaultCheckbox } from "../components/Checkbox";
import { DefaultButton } from "../components/Button";

import { initDataGet } from "../common/ProcessInterface";
import { FeatureApi, CommonApi } from "../const/AppSettingConst";

export const AppSettingView = () => {
  const [data, setData] = useState([]);

  initDataGet(CommonApi.getDbData, data, setData);

  const [checked, setChecked] = useState(
    data.length == 0 ? false : data.autoWindowClose
  );

  const updateAutoWindowClose = () => {
    data.autoWindowClose = checked;
    setData(data);
    ipcRenderer
      .invoke(FeatureApi.updateAppSetting, data)
      .then(ipcRenderer.invoke(CommonApi.windowClose));
  };

  return (
    <React.Fragment>
      {data.length == 0 ? (
        <div></div>
      ) : (
        <DefaultCheckbox
          name="ウィンドウの自動クローズ"
          value={checked}
          onChange={(e) => setChecked(e.target.checked)}
        ></DefaultCheckbox>
      )}
      <DefaultButton
        onClick={updateAutoWindowClose}
        name={"更新"}
      ></DefaultButton>
    </React.Fragment>
  );
};
