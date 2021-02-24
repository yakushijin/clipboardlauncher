import React from "react";

import CancelIcon from "@material-ui/icons/Cancel";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import { makeStyles } from "@material-ui/core/styles";

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
