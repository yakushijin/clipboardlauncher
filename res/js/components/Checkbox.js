import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

export const DefaultCheckbox = ({ name, value, onChange }) => {
  return (
    <FormControl>
      <FormControlLabel
        control={
          <Checkbox checked={value} onChange={onChange} color="primary" />
        }
        label={name}
        labelPlacement="start"
      />
    </FormControl>
  );
};
