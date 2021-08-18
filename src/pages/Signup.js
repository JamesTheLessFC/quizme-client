import React, { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Typography,
  Container,
  CircularProgress,
  Paper,
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useHistory } from "react-router-dom";
import backgroundImage from "../images/quizme-bg-blue.png";

const styles = (theme) => ({
  root: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundRepeat: "repeat",
    backgroundSize: "7rem",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    width: "100%",
    paddingTop: theme.spacing(8),
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    background: theme.palette.primary.gradient,
    width: "100%",
    padding: theme.spacing(2),
    color: theme.palette.primary.contrastText,
  },
  avatar: {
    backgroundColor: theme.palette.info.light,
    marginBottom: theme.spacing(1),
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    background: theme.palette.primary.dark,
    "&:hover": {
      background: theme.palette.primary.extraDark,
    },
  },
  progress: {
    position: "absolute",
  },
});

function Signup({ classes }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const newUserData = {
      firstName,
      lastName,
      country,
      username,
      email,
      password,
      confirmPassword,
    };
    axios
      .post(
        "https://us-central1-quizme-cf318.cloudfunctions.net/api/signup",
        newUserData
      )
      .then((response) => {
        localStorage.setItem("AuthToken", response.data.token);
        setLoading(false);
        history.push("/");
      })
      .catch((err) => {
        setErrors(err.response.data);
        setLoading(false);
      });
  };

  return (
    <Container component="main" maxWidth="xl" className={classes.root}>
      <CssBaseline />
      <Container maxWidth="xs">
        <Paper className={classes.paper}>
          <center className={classes.header}>
            <Avatar className={classes.avatar}>
              <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
          </center>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="firstName"
                  helperText={errors.firstName}
                  error={errors.firstName ? true : false}
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lastName"
                  helperText={errors.lastName}
                  error={errors.lastName ? true : false}
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="User Name"
                  name="username"
                  autoComplete="username"
                  helperText={errors.username}
                  error={errors.username ? true : false}
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="country"
                  label="Country"
                  name="country"
                  autoComplete="country"
                  helperText={errors.country}
                  error={errors.country ? true : false}
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  helperText={errors.email}
                  error={errors.email ? true : false}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  helperText={errors.password}
                  error={errors.password ? true : false}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="current-password"
                  value={confirmPassword}
                  error={errors.confirmPassword ? true : false}
                  helperText={errors.confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit}
              disabled={
                loading ||
                !email ||
                !password ||
                !firstName ||
                !lastName ||
                !country ||
                !username
              }
            >
              Sign Up
              {loading && (
                <CircularProgress size={30} className={classes.progess} />
              )}
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link href="login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Container>
  );
}

export default withStyles(styles)(Signup);
