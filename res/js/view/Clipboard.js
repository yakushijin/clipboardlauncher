import React, { useState } from "react";
import { SimpleList } from "../components/List";
import { DefaultButton } from "../components/Button";
import { HeaderArea, TitleArea, IconArea } from "../components/Header";
import { ClearListIcon, DispCloseIcon } from "../components/Icon";
import { initDataGet, dataSet } from "../common/ProcessInterface";

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

const ButtonArea = styled.div`
  text-align: center;
`;

const allDelete = () => {
  ipcRenderer.invoke("clipboardAllDelete");
};

const close = () => {
  ipcRenderer.invoke("clipboardWindowClose");
};

export const Clipboard = () => {
  const [data, setData] = useState([]);
  console.log(data);

  if (data.length == 0) {
    initDataGet(setData);
  }

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

export function clipboardWindowClose() {
  const GetDispSizeType = "getDispSize";
  const CloseDispType = "clipboardWindowClose";

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
