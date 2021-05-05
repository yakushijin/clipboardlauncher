import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { TextareaAutosize } from "@material-ui/core";

export const BaseTextBox = ({ name, value, onChange }) => {
  return (
    <form noValidate autoComplete="off">
      <TextField
        // id="outlined-basic"
        label={name}
        defaultValue={value}
        onBlur={onChange}
        variant="outlined"
      />
    </form>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    width: 500,
    height: 400,
  },
}));

export const BigTextBox = ({ name, value, onChange }) => {
  const classes = useStyles();

  return (
    <form noValidate autoComplete="off">
      <TextareaAutosize
        className={classes.root}
        rowsMin={10}
        label={name}
        defaultValue={value}
        onBlur={onChange}
      />
    </form>
  );
};
