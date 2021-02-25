import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { BaseTextBox } from "./TextBox";

export function BaseModal({ OpenIcon, column, index, list, setData }) {
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
    var array = list.concat();
    array.push({ dispName: dispName, pathString: pathString });
    console.log(array);
    setData(array);
    ipcRenderer.invoke("updateShortcut", array).then((result) => {
      handleClose();
    });
  };

  const UpdateData = () => {
    var array = list.concat();
    array[index] = { dispName: dispName, pathString: pathString };
    setData(array);
    ipcRenderer.invoke("updateShortcut", array).then((result) => {
      handleClose();
    });
  };

  return (
    <div>
      <OpenIcon onClick={handleClickOpen} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"変更"}</DialogTitle>
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
          <Button onClick={AddData} color="primary">
            更新
          </Button>
          <Button onClick={UpdateData} color="primary">
            削除
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            キャンセル
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
