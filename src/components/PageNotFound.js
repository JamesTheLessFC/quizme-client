import { Paper, Typography, Button, Divider, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowBack, Warning } from "@material-ui/icons";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  headingContainer: {
    display: "flex",
    alignItems: "center",
    color: theme.palette.error.dark,
  },
  icon: {
    fontSize: "3.75rem",
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

function PageNotFound({ history }) {
  const classes = useStyles();

  const handleBackClick = () => {
    history.goBack();
  };

  return (
    <Grid container>
      <Grid item xs={12} lg={9}>
        <Paper className={classes.root}>
          <div className={classes.headingContainer}>
            <Warning className={classes.icon} />
            <Typography variant="h2">404</Typography>
          </div>
          <Divider />
          <br />
          <Typography>
            Oops! The requested URL was not found on this server.
          </Typography>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBackClick}
            variant="contained"
            className={classes.button}
            color="primary"
          >
            Go Back
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default PageNotFound;
