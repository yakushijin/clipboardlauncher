import React from "react";
import TextField from "@material-ui/core/TextField";

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
