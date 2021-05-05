import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

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

export const TemplateList = ({ listData, setContentsData }) => {
  return (
    <List component="nav" aria-label="secondary mailbox folders">
      {listData.map((column, index) => (
        <React.Fragment>
          <ListItem
            key={index}
            onClick={() => templateGet(column.listId, setContentsData)}
          >
            {column.listName}
          </ListItem>
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
