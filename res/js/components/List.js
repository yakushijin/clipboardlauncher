import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import { TemplateModal } from "./Modal";

import styled from "styled-components";

const useStyles = makeStyles(() => ({
  root: {
    padding: 2,
  },
}));

export const SimpleList = ({ listData }) => {
  const classes = useStyles();
  return (
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
  );
};

function clipboardSet(index) {
  ipcRenderer.invoke("clipboardSet", index);
}

const ListArea = styled.div`
  display: flex;
`;

const ButtonArea = styled.div`
  display: flex;
`;

export const TemplateList = ({
  listData,
  setData,
  contentsData,
  setContentsData,
}) => {
  return (
    <List component="nav" aria-label="secondary mailbox folders">
      {listData.map((column, index) => (
        <React.Fragment>
          <ListArea>
            <ListItem
              key={index}
              onClick={() => templateGet(column.listId, setContentsData)}
            >
              {column.listName}
            </ListItem>
            <ButtonArea>
              <TemplateModal
                newFlag={false}
                column={column}
                index={index}
                list={listData}
                setData={setData}
                contentsData={contentsData}
                setContentsData={setContentsData}
              />
            </ButtonArea>
          </ListArea>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};

function templateGet(id, setContentsData) {
  ipcRenderer.invoke("templateGet", id).then((result) => {
    setContentsData(result);
  });
}
