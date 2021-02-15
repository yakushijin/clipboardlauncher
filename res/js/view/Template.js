import React from "react";
import { SimpleList } from "../components/List";

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
  return (
    <FlexBox>
      <ListBack>
        <SimpleList listData={ListSetTest} />
      </ListBack>
      <TextBack>aaa</TextBack>
    </FlexBox>
  );
};
