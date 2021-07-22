import React from "react";
import Button from "@material-ui/core/Button";

export const DefaultButton = ({ onClick, name }) => {
  return (
    <Button variant="contained" color="primary" size="small" onClick={onClick}>
      {name}
    </Button>
  );
};

export const ImportantButton = ({ onClick, name }) => {
  return (
    <Button
      variant="contained"
      color="secondary"
      size="small"
      onClick={onClick}
    >
      {name}
    </Button>
  );
};

export const NotButton = ({ onClick, name }) => {
  return (
    <Button variant="contained" size="small" onClick={onClick}>
      {name}
    </Button>
  );
};
