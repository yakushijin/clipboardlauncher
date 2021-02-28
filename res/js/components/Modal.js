import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DataEditIcon } from "./Icon";
import { BaseFab } from "./Fab";

import { BaseTextBox } from "./TextBox";

export function BaseModal({ newFlag, column, index, list, setData }) {
  const [open, setOpen] = React.useState(false);
  const [dispName, dispNameChange] = React.useState(column.dispName);
  const [pathString, pathStringChange] = React.useState(column.pathString);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const AddData = () => {
    list.push({ dispName: dispName, pathString: pathString });
    DataSet(list);
  };

  const UpdateData = () => {
    list[index] = { dispName: dispName, pathString: pathString };
    DataSet(list);
  };

  const DeleteData = () => {
    list.splice(index, 1);
    DataSet(list);
  };

  const DataSet = (list) => {
    var array = list.concat();
    setData(array);
    ipcRenderer.invoke("updateShortcut", array).then((result) => {
      handleClose();
    });
  };

  return (
    <div>
      {newFlag ? (
        <BaseFab onClick={handleClickOpen} />
      ) : (
        <DataEditIcon onClick={handleClickOpen} />
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{newFlag ? "新規作成" : "変更"}</DialogTitle>
        <DialogContent>
          <BaseTextBox
            name={"dispName"}
            value={dispName}
            onChange={(e) => dispNameChange(e.target.value)}
          />
          <BaseTextBox
            name={"pathString"}
            value={pathString}
            onChange={(e) => pathStringChange(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          {newFlag ? (
            <Button onClick={AddData}>作成</Button>
          ) : (
            <React.Fragment>
              <Button onClick={UpdateData}>更新</Button>
              <Button onClick={DeleteData}>削除</Button>
            </React.Fragment>
          )}
          <Button onClick={handleClose} color="primary" autoFocus>
            キャンセル
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
