import React, { useState } from "react";
import { TemplateList } from "../components/List";
import { initDataGet, dataSet } from "../common/ProcessInterface";
import { HeaderArea, TitleArea, IconArea } from "../components/Header";
import { DataEditIcon, DispCloseIcon, DataAddIcon } from "../components/Icon";
import styled from "styled-components";
import { TemplateModal } from "../components/Modal";
import { FeatureApi, CommonApi } from "../const/TemplateConst";

const FlexBox = styled.div`
  color: #444;
  display: flex;
`;

const ListBack = styled.div`
  width: 30%;
  height: 100%;
`;

const TextBack = styled.div`
  width: 70%;
  height: 90vh;
  padding: 10px;
  white-space: pre-wrap;
  border-left: solid 2px #000;
`;

const AddButtonArea = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const close = () => {
  ipcRenderer.invoke(CommonApi.windowClose);
};

export const TemplateView = () => {
  const [data, setData] = useState([]);
  const [ContentsData, setContentsData] = useState("");

  initDataGet(CommonApi.getDbData, data, setData);

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
          <TemplateList
            listData={data}
            setData={setData}
            contentsData={ContentsData}
            setContentsData={setContentsData}
          />
        </ListBack>
        <TextBack>{ContentsData}</TextBack>
        <AddButtonArea>
          <TemplateModal
            newFlag={true}
            column={""}
            index={""}
            list={data}
            setData={setData}
            contentsData={ContentsData}
            setContentsData={setContentsData}
          />
        </AddButtonArea>
      </FlexBox>
    </React.Fragment>
  );
};
