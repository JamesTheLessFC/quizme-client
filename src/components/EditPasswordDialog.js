import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import axios from "axios";
import {
  showSnackbarMessage,
  setSnackbarMessageContent,
  setSnackbarMessageSeverity,
} from "../features/snackbar/snackbarMessageSlice";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Cancel, Save } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  title: {
    backgroundColor: theme.palette.primary.main,
    background: theme.palette.primary.gradient,
    color: "white",
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  passwordTextField: {
    "& .MuiInputBase-root": {
      backgroundColor: "aliceblue",
    },
  },
}));

function EditPasswordDialog({ showDialog, hideDialog }) {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    setPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setErrors({});
  }, [showDialog]);

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmNewPasswordChange = (event) => {
    setConfirmNewPassword(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const validateData = () => {
    let inputErrors = {};
    if (newPassword !== confirmNewPassword)
      inputErrors.confirmNewPassword = "Passwords must match";
    if (newPassword.length < 6) inputErrors.newPassword = "Weak password";
    return {
      valid: Object.keys(inputErrors).length === 0,
      inputErrors,
    };
  };

  const updatePassword = (newPassword, confirmNewPassword, password) => {
    setSubmitting(true);
    const { valid, inputErrors } = validateData();
    if (!valid) {
      setSubmitting(false);
      setErrors(inputErrors);
      return;
    }
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .put(
        "https://us-central1-quizme-cf318.cloudfunctions.net/api/user/password",
        { newPassword, confirmNewPassword, password }
      )
      .then(() => {
        setSubmitting(false);
        hideDialog();
        dispatch(
          setSnackbarMessageContent("User password updated successfully!")
        );
        dispatch(setSnackbarMessageSeverity("success"));
        dispatch(showSnackbarMessage());
      })
      .catch((err) => {
        setSubmitting(false);
        if (err.response && err.response.status === 400) {
          setErrors(err.response.data);
        } else if (
          err.response &&
          err.response.data.error === "auth/wrong-password"
        ) {
          setErrors({ password: "Incorrect password" });
        } else if (
          err.response &&
          err.response.data.error === "auth/weak-password"
        ) {
          setErrors({ newPassword: "Weak password" });
        } else {
          hideDialog();
          dispatch(
            setSnackbarMessageContent(
              "Oops! Something went wrong. Try refreshing the page and/or logging back in before attempting to change your password."
            )
          );
          dispatch(setSnackbarMessageSeverity("error"));
          dispatch(showSnackbarMessage());
        }
      });
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    updatePassword(newPassword, confirmNewPassword, password);
  };

  return (
    <Dialog open={showDialog} onClose={hideDialog}>
      <DialogTitle className={classes.title}>Change Password</DialogTitle>
      <DialogContent>
        <br />
        <DialogContentText>
          To change the password registered to your account, enter your new
          password along with your current password. Then click the 'Save'
          button.
        </DialogContentText>
        <form noValidate autoComplete="off" id="password-form">
          <TextField
            autoFocus
            label="New Password"
            type="password"
            fullWidth
            onChange={handleNewPasswordChange}
            value={newPassword}
            className={classes.textField}
            required
            error={errors.newPassword ? true : false}
            helperText={errors.newPassword}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            onChange={handleConfirmNewPasswordChange}
            value={confirmNewPassword}
            className={classes.textField}
            required
            error={errors.confirmNewPassword ? true : false}
            helperText={errors.confirmNewPassword}
          />
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            margin="dense"
            variant="outlined"
            onChange={handlePasswordChange}
            required
            error={errors.password ? true : false}
            helperText={errors.password}
            className={classes.passwordTextField}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSaveClick}
          color="primary"
          startIcon={submitting ? "" : <Save />}
          type="submit"
          form="password-form"
          disabled={
            !newPassword || !confirmNewPassword || !password || submitting
          }
        >
          {submitting ? <CircularProgress size={20} /> : "Save"}
        </Button>
        <Button
          onClick={hideDialog}
          color="primary"
          autoFocus
          startIcon={<Cancel />}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditPasswordDialog;
