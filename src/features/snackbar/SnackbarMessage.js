import React from "react";
import { Alert } from "@material-ui/lab";
import { Snackbar } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSnackbarMessage,
  hideSnackbarMessage,
} from "./snackbarMessageSlice";

function SnackbarMessage() {
  const snackbarMessage = useSelector(selectSnackbarMessage);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(hideSnackbarMessage());
  };

  return (
    <Snackbar
      open={snackbarMessage.open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity={snackbarMessage.severity}>
        {snackbarMessage.message}
      </Alert>
    </Snackbar>
  );
}

export default SnackbarMessage;
