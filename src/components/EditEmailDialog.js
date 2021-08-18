import React, { useState, useEffect } from "react";
import { selectUser } from "../features/user/userSlice";
import { useSelector } from "react-redux";
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
  emailField: {
    marginBottom: theme.spacing(2),
  },
  passwordTextField: {
    "& .MuiInputBase-root": {
      backgroundColor: "aliceblue",
    },
  },
}));

function EditEmailDialog({ showDialog, hideDialog }) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    setEmail(user.email);
    setPassword("");
    setErrors({});
  }, [user, showDialog]);

  const handleEmailChange = (event) => {
    if (errors.email) setErrors({});
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    if (errors.password) setErrors({});
    setPassword(event.target.value);
  };

  const isEmail = (email) => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegex)) return true;
    else return false;
  };

  const updateEmail = (email, password) => {
    setSubmitting(true);
    if (!isEmail(email)) {
      setErrors({ email: "Must be a valid email address" });
      setSubmitting(false);
      return;
    }
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .put(
        "https://us-central1-quizme-cf318.cloudfunctions.net/api/user/email",
        { email, password }
      )
      .then(() => {
        setSubmitting(false);
        window.location.reload();
        dispatch(setSnackbarMessageContent("User email updated successfully!"));
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
          err.response.data.error === "auth/invalid-email"
        ) {
          setErrors({ email: "Must be a valid email address" });
        } else if (
          err.response &&
          err.response.data.error === "auth/email-already-in-use"
        ) {
          setErrors({ email: "This email address is already in use" });
        } else {
          hideDialog();
          dispatch(
            setSnackbarMessageContent(
              "Oops! Something went wrong. Try refreshing the page and/or logging back in before attempting to update your email."
            )
          );
          dispatch(setSnackbarMessageSeverity("error"));
          dispatch(showSnackbarMessage());
        }
      });
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    updateEmail(email, password);
  };

  return (
    <Dialog open={showDialog} onClose={hideDialog}>
      <DialogTitle className={classes.title}>Update Email</DialogTitle>
      <DialogContent>
        <br />
        <DialogContentText>
          To change the email address registered to your account, edit the email
          field below and enter your password. Then click the 'Save' button.
        </DialogContentText>
        <br />
        <form noValidate id="email-form" autoComplete="off">
          <TextField
            autoFocus
            label="Email"
            type="email"
            fullWidth
            onChange={handleEmailChange}
            value={email}
            className={classes.emailField}
            required
            error={errors.email ? true : false}
            helperText={errors.email}
          />
          <TextField
            label="Password"
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
          form="email-form"
          disabled={!email || !password || submitting}
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

export default EditEmailDialog;
