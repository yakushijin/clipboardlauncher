import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DataEditIcon } from "./Icon";
import { BaseFab } from "./Fab";
import Grid from "@material-ui/core/Grid";
import { validationCheck } from "../common/Validation";

import { FeatureApi } from "../const/TemplateConst";

import { BaseTextBox, BigTextBox } from "./TextBox";
import { DefaultButton, ImportantButton, NotButton } from "./Button";

export function BaseModal({ newFlag, column, index, list, setData }) {
  const [open, setOpen] = React.useState(false);
  const [dispName, dispNameChange] = React.useState(column.dispName);
  const [pathString, pathStringChange] = React.useState(column.pathString);
  const [validationDispName, setValidationDispName] = React.useState(false);
  const [validationPathString, setValidationPathString] = React.useState(false);
  const inputRefDispName = React.useRef(null);
  const inputRefPathString = React.useRef(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const exeValidationCheck = () => {
    const getValidationDispName = validationCheck(
      inputRefDispName,
      setValidationDispName
    );
    const getValidationPathString = validationCheck(
      inputRefPathString,
      setValidationPathString
    );
    if (getValidationDispName && getValidationPathString) {
      return true;
    } else {
      return false;
    }
  };

  const AddData = () => {
    if (exeValidationCheck()) {
      list.push({ dispName: dispName, pathString: pathString });
      DataSet(list);
    }
  };

  const UpdateData = () => {
    if (exeValidationCheck()) {
      list[index] = { dispName: dispName, pathString: pathString };
      DataSet(list);
    }
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
            name={"リンク名"}
            value={dispName}
            onChange={(e) => dispNameChange(e.target.value)}
            maxLength={20}
            inputError={validationDispName}
            setInputError={setValidationDispName}
            inputRef={inputRefDispName}
          />
          <BaseTextBox
            name={"リンクパス"}
            value={pathString}
            onChange={(e) => pathStringChange(e.target.value)}
            maxLength={255}
            inputError={validationPathString}
            setInputError={setValidationPathString}
            inputRef={inputRefPathString}
          />

          <Grid container spacing={1}>
            {newFlag ? (
              <Grid item>
                <DefaultButton onClick={AddData} name={"作成"}></DefaultButton>
              </Grid>
            ) : (
              <React.Fragment>
                <Grid item>
                  <DefaultButton
                    onClick={UpdateData}
                    name={"更新"}
                  ></DefaultButton>
                </Grid>
                <Grid item>
                  <ImportantButton
                    onClick={DeleteData}
                    name={"削除"}
                  ></ImportantButton>
                </Grid>
              </React.Fragment>
            )}
            <Grid item>
              <NotButton onClick={handleClose} name={"キャンセル"}></NotButton>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function TemplateModal({
  newFlag,
  column,
  index,
  list,
  setData,
  contentsData,
  setContentsData,
}) {
  const [open, setOpen] = React.useState(false);
  const [listName, dispNameChange] = React.useState(column.listName);
  const [tmpContentsData, setTmpContentsData] = React.useState();
  const [validationTmpName, setValidationTmpName] = React.useState(false);
  const inputRef = React.useRef(null);

  const NewId = dateGet();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const AddData = () => {
    if (validationCheck(inputRef, setValidationTmpName)) {
      list.push({ listId: NewId, listName: listName });
      const contentsDataSet = { _id: NewId, value: tmpContentsData };
      DataSet(FeatureApi.postTemplate, contentsDataSet);
    }
  };

  const UpdateData = () => {
    if (validationCheck(inputRef, setValidationTmpName)) {
      list[index] = { listId: column.listId, listName: listName };
      const contentsDataSet = {
        id: column.listId,
        value: tmpContentsData,
      };
      DataSet(FeatureApi.putTemplate, contentsDataSet);
    }
  };

  const DeleteData = () => {
    list.splice(index, 1);
    const contentsDataSet = { id: column.listId };
    DataSet(FeatureApi.deleteTemplate, contentsDataSet);
  };

  const DataSet = (templateApi, contentsDataSet) => {
    var array = list.concat();
    setData(array);
    ipcRenderer
      .invoke(templateApi, { list: array, contents: contentsDataSet })
      .then((result) => {
        setContentsData(tmpContentsData);
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
            name={"定型文名"}
            value={column.listName}
            onChange={(e) => dispNameChange(e.target.value)}
            maxLength={20}
            inputError={validationTmpName}
            setInputError={setValidationTmpName}
            inputRef={inputRef}
          />
          <BigTextBox
            name={"定型文"}
            value={newFlag ? "" : contentsData}
            onChange={(e) => setTmpContentsData(e.target.value)}
          />
          <Grid container spacing={1}>
            {newFlag ? (
              <Grid item>
                <DefaultButton onClick={AddData} name={"作成"}></DefaultButton>
              </Grid>
            ) : (
              <React.Fragment>
                <Grid item>
                  <DefaultButton
                    onClick={UpdateData}
                    name={"更新"}
                  ></DefaultButton>
                </Grid>
                <Grid item>
                  <ImportantButton
                    onClick={DeleteData}
                    name={"削除"}
                  ></ImportantButton>
                </Grid>
              </React.Fragment>
            )}
            <Grid item>
              <NotButton onClick={handleClose} name={"キャンセル"}></NotButton>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function dateGet() {
  var date = new Date();
  return (
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2) +
    date.getMilliseconds()
  );
}
