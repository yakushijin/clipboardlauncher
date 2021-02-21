import React, { useState } from "react";
import { SimpleList } from "../components/List";
import { initDataGet, dataSet } from "../common/ProcessInterface";

import styled from "styled-components";

const FlexBox = styled.div`
  color: #444;
  background: #fff;
  display: flex;
  box-shadow: 0 0 8px gray;
`;

const ListBack = styled.div`
  width: 30%;
`;

const TextBack = styled.div`
  width: 70%;
`;

const ListSetTest = [1, 2, 3, "aaa"];

export const Template = () => {
  const [data, setData] = useState({});
  if (!Object.keys(data).length) {
    initDataGet(setData);
  }

  // dataSet();

  console.log(data);

  return (
    <FlexBox>
      <ListBack>
        <SimpleList listData={ListSetTest} />
      </ListBack>
      <TextBack></TextBack>
    </FlexBox>
  );
};
