import React from "react";
import styled from "styled-components";

export const HeaderArea = styled.div`
  display: flex;
  margin-top: 2px;
  border-top: 2px solid #d8dcdc;
  border-bottom: 2px solid #333;

  background-image: -webkit-linear-gradient(
    135deg,
    #ccc 0%,
    #868888 20%,
    #d8dcdc 34%,
    white 53%,
    #ccc 100%
  );
  background-image: linear-gradient(
    -45deg,
    #ccc 0%,
    #868888 20%,
    #d8dcdc 34%,
    white 53%,
    #ccc 100%
  );
`;

export const TitleArea = styled.div`
  cursor: move;
  -webkit-app-region: drag;
  width: 80%;
  margin-left: 10px;
  font-size: 20px;
  font-weight: bold;
`;

export const IconArea = styled.div`
  margin: 2px;
  width: 20%;
  text-align: right;
`;
