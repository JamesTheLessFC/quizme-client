import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Icon,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import {
  showSnackbarMessage,
  setSnackbarMessageContent,
  setSnackbarMessageSeverity,
} from "../features/snackbar/snackbarMessageSlice";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Cancel, Delete, Warning } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  title: {
    backgroundColor: theme.palette.primary.main,
    background: theme.palette.primary.gradient,
    color: "white",
  },
  deleteWarningContainer: {
    display: "flex",
    alignItems: "center",
    color: theme.palette.warning.dark,
  },
  warningIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.warning.main,
    display: "flex",
    alignItems: "center",
  },
  passwordTextField: {
    "& .MuiInputBase-root": {
      backgroundColor: "aliceblue",
    },
  },
}));

function DeleteAccountDialog({ showDialog, hideDialog, history }) {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    setPassword("");
    setPasswordError("");
  }, [showDialog]);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const deleteUser = (password) => {
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .delete("https://us-central1-quizme-cf318.cloudfunctions.net/api/user", {
        data: { password },
      })
      .then(() => {
        hideDialog();
        localStorage.removeItem("AuthToken");
        history.push("/login");
      })
      .catch((err) => {
        if (err.response && err.response.data.error === "auth/wrong-password") {
          setPasswordError("Incorrect password");
        } else {
          hideDialog();
          dispatch(
            setSnackbarMessageContent(
              "Oops! Something went wrong. Try refreshing the page and/or logging back in before attempting to delete your account."
            )
          );
          dispatch(setSnackbarMessageSeverity("error"));
          dispatch(showSnackbarMessage());
        }
      });
  };

  const handleDeleteClick = () => {
    deleteUser(password);
  };

  return (
    <Dialog open={showDialog} onClose={hideDialog}>
      <DialogTitle className={classes.title}>Delete Account</DialogTitle>
      <DialogContent>
        <br />
        <div className={classes.deleteWarningContainer}>
          <Icon className={classes.warningIcon}>
            <Warning />
          </Icon>
          <Typography className={classes.deleteDirections}>
            Once you've deleted your account, it can't be recovered. All of your
            quiz data will be lost. To proceed, enter your password below and
            then click the 'Delete' button.
          </Typography>
        </div>
        <br />
        <TextField
          autoFocus
          margin="dense"
          id="password"
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          onChange={handlePasswordChange}
          error={passwordError ? true : false}
          helperText={passwordError}
          required
          className={classes.passwordTextField}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleDeleteClick}
          color="primary"
          startIcon={<Delete />}
          disabled={!password}
        >
          Delete
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

export default DeleteAccountDialog;
