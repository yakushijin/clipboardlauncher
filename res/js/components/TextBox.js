import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { TextareaAutosize } from "@material-ui/core";

import { validationCheck } from "../common/Validation";

const BaseTextBoxStyles = makeStyles(() => ({
  root: {
    marginBottom: 10,
  },
}));

export const BaseTextBox = ({
  name,
  value,
  onChange,
  maxLength,
  inputError,
  setInputError,
  inputRef,
}) => {
  const classes = BaseTextBoxStyles();

  return (
    <form className={classes.root}>
      <TextField
        className={classes.root}
        label={name}
        defaultValue={value}
        onBlur={onChange}
        variant="outlined"
        error={inputError}
        required
        inputProps={{
          maxLength: maxLength,
        }}
        inputRef={inputRef}
        helperText={inputError ? inputRef?.current?.validationMessage : ""}
        onChange={() => validationCheck(inputRef, setInputError)}
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
