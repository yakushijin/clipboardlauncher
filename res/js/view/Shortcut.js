import React, { useState } from "react";

import { HeaderArea, TitleArea, IconArea } from "../components/Header";
import { DataEditIcon, DispCloseIcon, DataAddIcon } from "../components/Icon";
import { ScrollableTabsButtonAuto } from "../components/Tab";
import styled from "styled-components";
import { BasicChip } from "../components/Chip";
import { BaseModal } from "../components/Modal";
import { BaseFab } from "../components/Fab";

const close = () => {
  ipcRenderer.invoke("shortcutWindowClose");
};

export const Shortcut = () => {
  const [data, setData] = useState([]);

  if (data.length == 0) {
    ipcRenderer.invoke("getShortcutClipboard").then((result) => {
      setData(result);
    });
  }

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

export function shortcutWindowClose() {
  const GetDispSizeType = "getshortcutDispSize";
  const CloseDispType = "shortcutWindowClose";

  ipcRenderer.invoke(GetDispSizeType).then((result) => {
    window.addEventListener("mousemove", (event) => {
      if (result.autoClose) {
        if (
          event.clientX < 20 ||
          event.clientY < 20 ||
          event.clientX > result.x - 20 ||
          event.clientY > result.y - 20
        ) {
          ipcRenderer.invoke(CloseDispType);
        }
      }
    });
  });
}

const Item = ({ listData, setData }) => {
  return (
    <React.Fragment>
      {listData.map((column, index) => (
        <ItemArea key={index}>
          <BasicChip
            data={
              <React.Fragment>
                <ItemUnit onClick={() => pathClick(column.pathString)}>
                  {column.dispName}
                </ItemUnit>
                <EditIconUnit>
                  <BaseModal
                    newFlag={false}
                    column={column}
                    index={index}
                    list={listData}
                    setData={setData}
                  />
                </EditIconUnit>
              </React.Fragment>
            }
          />
        </ItemArea>
      ))}
    </React.Fragment>
  );
};

const AddButtonArea = styled.div`
  text-align: right;
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

const EditIconUnit = styled.div`
  border-radius: 10%;
  background: #888;
  height: 24px;
  width: 24px;
  box-shadow: "8px 8px 8px #ccc";
  /* padding: 2px; */
  margin-top: 8px;
  display: inline-block;
`;

function pathClick(data) {
  ipcRenderer.invoke("shortcutOpenDirectory", data);
}
