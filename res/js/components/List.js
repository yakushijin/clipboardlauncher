import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import styled from "styled-components";
import { FeatureApi, CommonApi } from "../const/ClipboardConst";

import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import { TemplateModal } from "./Modal";
import { CopyIcon } from "./Icon";

const ListScrollArea = styled.div`
  height: 90vh;
  display: block;
  overflow-y: auto;
  overflow-x: hidden;
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

const useStyles = makeStyles(() => ({
  root: {
    padding: 2,
  },
}));

export const SimpleList = ({ listData }) => {
  const classes = useStyles();
  return (
    <ListScrollArea>
      <List component="nav" aria-label="secondary mailbox folders">
        {listData.map((column, index) => (
          <React.Fragment>
            <ListItem
              className={classes.root}
              button
              key={index}
              onClick={() => clipboardSet(index)}
            >
              {column}
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </ListScrollArea>
  );
};

function clipboardSet(index) {
  ipcRenderer
    .invoke(FeatureApi.clipboardSet, index)
    .then(ipcRenderer.invoke(CommonApi.windowClose));
}

export const TemplateList = ({
  listData,
  setData,
  contentsData,
  setContentsData,
}) => {
  return (
    <ListScrollArea>
      <List component="nav" aria-label="secondary mailbox folders">
        {listData.map((column, index) => (
          <React.Fragment>
            <ListItem
              key={index}
              button
              onClick={() => templateGet(column.listId, setContentsData)}
            >
              {column.listName}
              <ListItemSecondaryAction>
                <IconButton size="small" edge="start" color="primary">
                  <TemplateModal
                    newFlag={false}
                    column={column}
                    index={index}
                    list={listData}
                    setData={setData}
                    contentsData={contentsData}
                    setContentsData={setContentsData}
                  />
                </IconButton>
                <IconButton size="small" edge="start" color="primary">
                  <CopyIcon
                    onClick={() => templateCopy(column.listId)}
                  ></CopyIcon>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </ListScrollArea>
  );
};

function templateGet(id, setContentsData) {
  ipcRenderer.invoke("templateGet", id).then((result) => {
    setContentsData(result);
  });
}

function templateCopy(id) {
  ipcRenderer.invoke("templateGet", id).then((result) => {
    navigator.clipboard.writeText(result);
  });
}
