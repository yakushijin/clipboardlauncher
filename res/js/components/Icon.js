import React from "react";

import CancelIcon from "@material-ui/icons/Cancel";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import FileCopyIcon from "@material-ui/icons/FileCopy";

const useStyles = makeStyles({
  root: {
    cursor: "pointer",
    margin: "0 2px",
  },
});

export const ClearListIcon = ({ onClick }) => {
  const classes = useStyles();
  return (
    <ClearAllIcon
      className={classes.root}
      fontSize="default"
      onClick={onClick}
    ></ClearAllIcon>
  );
};

export const DispCloseIcon = ({ onClick }) => {
  const classes = useStyles();
  return (
    <CancelIcon
      className={classes.root}
      fontSize="default"
      onClick={onClick}
    ></CancelIcon>
  );
};

export const DataEditIcon = ({ onClick }) => {
  const classes = useStyles();
  return (
    <EditIcon
      className={classes.root}
      fontSize="small"
      onClick={onClick}
    ></EditIcon>
  );
};

export const DataAddIcon = ({ onClick }) => {
  const classes = useStyles();
  return (
    <AddIcon
      className={classes.root}
      fontSize="small"
      onClick={onClick}
    ></AddIcon>
  );
};

export const CopyIcon = ({ onClick }) => {
  const classes = useStyles();
  return (
    <FileCopyIcon
      className={classes.root}
      fontSize="small"
      onClick={onClick}
    ></FileCopyIcon>
  );
};
