import React from "react";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "8px 8px 8px #ccc",
    // height: "50px",
  },
}));

export const BasicChip = ({ data }) => {
  const classes = useStyles();
  return (
    <Chip
      className={classes.root}
      label={data}
      onClick={() => {
        return false;
      }}
    />
  );
};
