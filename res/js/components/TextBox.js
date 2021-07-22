import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { TextareaAutosize } from "@material-ui/core";

const BaseTextBoxStyles = makeStyles(() => ({
  root: {
    marginBottom: 10,
  },
}));

export const BaseTextBox = ({ name, value, onChange, maxLength }) => {
  const classes = BaseTextBoxStyles();
  const inputRef = React.useRef(null);
  const [inputError, setInputError] = React.useState(false);
  const handleChange = () => {
    if (inputRef.current) {
      const ref = inputRef.current;
      if (!ref.validity.valid) {
        setInputError(true);
      } else {
        setInputError(false);
      }
    }
  };

  return (
    <form nclassName={classes.root}>
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
        helperText={inputRef?.current?.validationMessage}
        onChange={handleChange}
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
