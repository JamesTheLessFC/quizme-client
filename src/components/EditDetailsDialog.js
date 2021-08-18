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
import { makeStyles } from "@material-ui/core/styles";
import { Cancel, Save } from "@material-ui/icons";
import axios from "axios";
import {
  showSnackbarMessage,
  setSnackbarMessageContent,
  setSnackbarMessageSeverity,
} from "../features/snackbar/snackbarMessageSlice";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  title: {
    backgroundColor: theme.palette.primary.main,
    background: theme.palette.primary.gradient,
    color: "white",
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
}));

function EditDetailsDialog({ showDialog, hideDialog }) {
  const classes = useStyles();
  const user = useSelector(selectUser);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setCountry(user.country);
    setErrors({});
  }, [user, showDialog]);

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const isEmpty = (string) => {
    if (string.trim() === "") return true;
    else return false;
  };

  const validateData = () => {
    let inputErrors = {};
    if (isEmpty(firstName)) inputErrors.firstName = "Must not be empty";
    if (isEmpty(lastName)) inputErrors.lastName = "Must not be empty";
    if (isEmpty(country)) inputErrors.country = "Must not be empty";
    return {
      valid: Object.keys(inputErrors).length === 0,
      inputErrors,
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const { valid, inputErrors } = validateData();
    if (!valid) {
      setErrors(inputErrors);
      setSubmitting(false);
      return;
    }
    const userDetails = {
      firstName: firstName,
      lastName: lastName,
      country: country,
    };
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .put(
        "https://us-central1-quizme-cf318.cloudfunctions.net/api/user",
        userDetails
      )
      .then(() => {
        setSubmitting(false);
        window.location.reload();
        dispatch(setSnackbarMessageContent("User data updated successfully!"));
        dispatch(setSnackbarMessageSeverity("success"));
        dispatch(showSnackbarMessage());
      })
      .catch((err) => {
        setSubmitting(false);
        if (err.response && err.response.status === 400) {
          setErrors(err.response.data);
        } else {
          hideDialog();
          dispatch(setSnackbarMessageContent("Oops! Something went wrong."));
          dispatch(setSnackbarMessageSeverity("error"));
          dispatch(showSnackbarMessage());
        }
      });
  };

  return (
    <Dialog open={showDialog} onClose={hideDialog}>
      <DialogTitle className={classes.title}>Edit User Details</DialogTitle>
      <DialogContent>
        <br />
        <DialogContentText>
          To change your user details, edit the fields below. Then click the
          'Save' button.
        </DialogContentText>
        <br />
        <form noValidate autoComplete="off" id="details-form">
          <TextField
            className={classes.textField}
            value={firstName}
            label="First Name"
            onChange={handleFirstNameChange}
            fullWidth
            required
            error={errors.firstName ? true : false}
            helperText={errors.firstName}
          />
          <TextField
            className={classes.textField}
            value={lastName}
            label="Last Name"
            onChange={handleLastNameChange}
            fullWidth
            required
            error={errors.lastName ? true : false}
            helperText={errors.lastName}
          />
          <TextField
            className={classes.textField}
            value={country}
            label="Country"
            onChange={handleCountryChange}
            fullWidth
            required
            error={errors.country ? true : false}
            helperText={errors.country}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit}
          color="primary"
          startIcon={submitting ? "" : <Save />}
          type="submit"
          form="details-form"
          disabled={submitting}
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

export default EditDetailsDialog;
