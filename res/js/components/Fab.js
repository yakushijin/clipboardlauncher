import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export const BaseFab = ({ onClick }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Fab size="small" color="primary" aria-label="add">
        <AddIcon onClick={onClick} />
      </Fab>
    </div>
  );
};
