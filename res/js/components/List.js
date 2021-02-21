import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

export const SimpleList = ({ listData }) => {
  return (
    <List component="nav" aria-label="secondary mailbox folders">
      {listData.map((column, index) => (
        <ListItem
          button
          key={index}
          onClick={() => clipboardSet(index, column)}
        >
          {column}
        </ListItem>
      ))}
    </List>
  );
};

function clipboardSet(index, column) {
  ipcRenderer.invoke("clipboardSet", { index: index, value: column });
}
