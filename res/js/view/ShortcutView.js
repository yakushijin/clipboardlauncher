import React, { useState } from "react";

import { HeaderArea, TitleArea, IconArea } from "../components/Header";
import { DataEditIcon, DispCloseIcon, DataAddIcon } from "../components/Icon";
import styled from "styled-components";
import { BasicChip } from "../components/Chip";
import { BaseModal } from "../components/Modal";
import { initDataGet, dataSet } from "../common/ProcessInterface";
import { FeatureApi, CommonApi } from "../const/ShortcutConst";
import IconButton from "@material-ui/core/IconButton";

const close = () => {
  ipcRenderer.invoke(CommonApi.windowClose);
};

export const ShortcutView = () => {
  const [data, setData] = useState([]);

  initDataGet(CommonApi.getDbData, data, setData);

  return (
    <React.Fragment>
      <HeaderArea>
        <TitleArea>ショートカットリンク</TitleArea>
        <IconArea>
          <DispCloseIcon onClick={close} />
        </IconArea>
      </HeaderArea>
      {/* <ScrollableTabsButtonAuto />; */}
      <Item listData={data} setData={setData} />
      <AddButtonArea>
        <BaseModal
          newFlag={true}
          column={""}
          index={""}
          list={data}
          setData={setData}
        />
      </AddButtonArea>
    </React.Fragment>
  );
};

const Item = ({ listData, setData }) => {
  return (
    <React.Fragment>
      {listData.map((column, index) => (
        <ItemArea key={index}>
          <BasicChip
            data={
              <React.Fragment>
                <TypeIcon data={column.pathString} />
                <ItemUnit onClick={() => pathClick(column.pathString)}>
                  {column.dispName}
                </ItemUnit>
                <IconButton size="small" edge="end" color="primary">
                  <BaseModal
                    newFlag={false}
                    column={column}
                    index={index}
                    list={listData}
                    setData={setData}
                  />
                </IconButton>
              </React.Fragment>
            }
          />
        </ItemArea>
      ))}
    </React.Fragment>
  );
};

const AddButtonArea = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const ItemIcon = styled.div.attrs((props) => ({
  backgroundColor: props.iconColor,
}))`
  display: inline-block;
  border-radius: 50%;
  height: 16px;
  width: 16px;
  cursor: move;
  background: ${(props) => props.backgroundColor};
`;

const ItemArea = styled.div`
  cursor: move;
  display: inline-block;
  margin: 4px;
`;

const ItemUnit = styled.div`
  font-size: 20px;
  padding: 4px;
  margin: 4px;
  display: inline-block;
`;

function pathClick(data) {
  var dataSet = { path: data, type: PathTypeCheck(data) };
  ipcRenderer.invoke(FeatureApi.shortcutOpenDirectory, dataSet);
  ipcRenderer.invoke(CommonApi.windowClose);
}

const PathTypeCheck = (data) => {
  const string = data.slice(0, 4);
  var type;
  if (string === "http") {
    type = "web";
  } else if (string.slice(0, 1) === "/") {
    type = "local";
  } else {
    type = "no";
  }
  return type;
};

const TypeIcon = ({ data }) => {
  var iconColor;
  switch (PathTypeCheck(data)) {
    case "web":
      iconColor = "#448";
      break;
    case "local":
      iconColor = "#844";
      break;
    case "no":
      iconColor = "#222";
      break;
  }
  return <ItemIcon iconColor={iconColor} />;
};
