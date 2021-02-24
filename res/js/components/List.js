import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";

export const SimpleList = ({ listData }) => {
  return (
    <List component="nav" aria-label="secondary mailbox folders">
      {listData.map((column, index) => (
        <React.Fragment>
          <ListItem button key={index} onClick={() => clipboardSet(index)}>
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
