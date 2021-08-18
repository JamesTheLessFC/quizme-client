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
  Icon,
} from "@material-ui/core";
import { ContactSupport, LockOutlined } from "@material-ui/icons";
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
  customError: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: 10,
  },
  brandContainer: {
    display: "flex",
    marginBottom: theme.spacing(1),
    color: theme.palette.text.hint,
    alignItems: "center",
  },
  brandName: {
    fontWeight: theme.typography.fontWeightBold,
  },
  progress: {
    position: "absolute",
  },
});

function Login({ classes }) {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const userData = {
      email: email,
      password: password,
    };
    axios
      .post(
        "https://us-central1-quizme-cf318.cloudfunctions.net/api/login",
        userData
      )
      .then((response) => {
        localStorage.setItem("AuthToken", `Bearer ${response.data.token}`);
        setLoading(false);
        history.push("/quizzes");
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
              Log In
            </Typography>
          </center>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              helperText={errors.email}
              error={errors.email ? true : false}
              onChange={handleEmailChange}
              value={email}
            ></TextField>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              autoComplete="current-password"
              type="password"
              helperText={errors.password}
              error={errors.password ? true : false}
              onChange={handlePasswordChange}
              value={password}
            ></TextField>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading || !email || !password}
              className={classes.submit}
            >
              Sign in
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
            <Grid container>
              <Grid item>
                <Link href="signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            {errors.general && (
              <Typography className={classes.customError} variant="body2">
                {errors.general}
              </Typography>
            )}
          </form>
          <center className={classes.brandContainer}>
            <Icon>
              <ContactSupport />
            </Icon>
            <Typography variant="h6" noWrap className={classes.brandName}>
              QuizMe
            </Typography>
          </center>
        </Paper>
      </Container>
    </Container>
  );
}

export default withStyles(styles)(Login);
