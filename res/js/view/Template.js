import React, { useState } from "react";
import { TemplateList } from "../components/List";
import { initDataGet, dataSet } from "../common/ProcessInterface";
import { HeaderArea, TitleArea, IconArea } from "../components/Header";
import { DataEditIcon, DispCloseIcon, DataAddIcon } from "../components/Icon";
import styled from "styled-components";
import { BaseModal } from "../components/Modal";

const FlexBox = styled.div`
  color: #444;
  display: flex;
  box-shadow: 0 0 8px gray;
`;

const ListBack = styled.div`
  width: 30%;
  height: 100%;
`;

const TextBack = styled.div`
  width: 70%;
  height: 90vh;
  border-left: solid 2px #000;
`;

const AddButtonArea = styled.div`
  text-align: right;
`;

export const Template = () => {
  const [data, setData] = useState([]);

  if (data.length == 0) {
    ipcRenderer.invoke("gettemplateClipboard").then((result) => {
      setData(result);
    });
  }

  return (
    <React.Fragment>
      <HeaderArea>
        <TitleArea>定型文</TitleArea>
        <IconArea>
          <DispCloseIcon onClick={close} />
        </IconArea>
      </HeaderArea>
      <FlexBox>
        <ListBack>
          <TemplateList listData={data} />
          <AddButtonArea>
            <BaseModal
              newFlag={true}
              column={""}
              index={""}
              list={data}
              setData={setData}
            />
          </AddButtonArea>
        </ListBack>
        <TextBack></TextBack>
      </FlexBox>
    </React.Fragment>
  );
};

export function templateWindowClose() {
  const GetDispSizeType = "gettemplateDispSize";
  const CloseDispType = "templateWindowClose";

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
