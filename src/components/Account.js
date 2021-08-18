import React, { useState } from "react";
import { selectUser } from "../features/user/userSlice";
import { useSelector } from "react-redux";
import {
  Button,
  Divider,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Grid,
} from "@material-ui/core";
import dayjs from "dayjs";
import { Delete, Edit } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import DeleteAccountDialog from "./DeleteAccountDialog";
import EditDetailsDialog from "./EditDetailsDialog";
import EditUserImageDialog from "./EditUserImageDialog";
import EditEmailDialog from "./EditEmailDialog";
import EditPasswordDialog from "./EditPasswordDialog";

const useStyles = makeStyles((theme) => ({
  paper: {
    overflow: "hidden",
    marginBottom: theme.spacing(2),
    "&:last-child": {
      marginBottom: 0,
    },
  },
  heading: {
    backgroundColor: theme.palette.primary.main,
    background: theme.palette.primary.gradient,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2),
  },
  content: {
    padding: theme.spacing(2),
  },
  sectionHeadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing(2),
    "&:first-child": {
      marginTop: 0,
    },
  },
  sectionHeading: {
    color: theme.palette.primary.main,
  },
  divider: {
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.primary.light,
  },
  label: {
    color: theme.palette.primary.main,
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    margin: theme.spacing(2),
    marginLeft: 0,
  },
  buttonContainer: {
    textAlign: "right",
  },
  deleteButton: {
    marginTop: theme.spacing(2),
  },
}));

function Account({ history }) {
  const user = useSelector(selectUser);
  const classes = useStyles();
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [showEditDetailsDialog, setShowEditDetailsDialog] = useState(false);
  const [showEditUserImageDialog, setShowEditUserImageDialog] = useState(false);
  const [showEditEmailDialog, setShowEditEmailDialog] = useState(false);
  const [showEditPasswordDialog, setShowEditPasswordDialog] = useState(false);

  const handleEditDetailsClick = () => {
    setShowEditDetailsDialog(true);
  };

  const hideEditDetailsDialog = () => {
    setShowEditDetailsDialog(false);
  };

  const handleEditUserImageClick = () => {
    setShowEditUserImageDialog(true);
  };

  const hideEditUserImageDialog = () => {
    setShowEditUserImageDialog(false);
  };

  const handleEditEmailClick = () => {
    setShowEditEmailDialog(true);
  };

  const hideEditEmailDialog = () => {
    setShowEditEmailDialog(false);
  };

  const handleEditPasswordClick = () => {
    setShowEditPasswordDialog(true);
  };

  const hideEditPasswordDialog = () => {
    setShowEditPasswordDialog(false);
  };

  const handleDeleteAccountClick = () => {
    setShowDeleteAccountDialog(true);
  };

  const hideDeleteAccountDialog = () => {
    setShowDeleteAccountDialog(false);
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12} lg={9}>
          <Paper className={classes.paper}>
            <Typography variant="h5" className={classes.heading}>
              My Account
            </Typography>
            <div className={classes.content}>
              <div className={classes.sectionHeadingContainer}>
                <Typography variant="h5" className={classes.sectionHeading}>
                  User Image
                </Typography>
                <IconButton color="primary" onClick={handleEditUserImageClick}>
                  <Edit />
                </IconButton>
              </div>
              <Divider className={classes.divider} />
              <Avatar className={classes.avatar} src={user.imageUrl} />
              <div className={classes.sectionHeadingContainer}>
                <Typography variant="h5" className={classes.sectionHeading}>
                  User Details
                </Typography>
                <IconButton color="primary" onClick={handleEditDetailsClick}>
                  <Edit />
                </IconButton>
              </div>
              <Divider className={classes.divider} />
              <Typography>
                <span className={classes.label}>Name:</span> {user.firstName}{" "}
                {user.lastName}
              </Typography>
              <Typography>
                <span className={classes.label}>Username:</span> {user.username}
              </Typography>
              <Typography>
                <span className={classes.label}>Country:</span> {user.country}
              </Typography>
              <Typography>
                <span className={classes.label}>Account Created On:</span>{" "}
                {dayjs(user.createdAt).format("M/DD/YYYY")}
              </Typography>
              <div className={classes.sectionHeadingContainer}>
                <Typography variant="h5" className={classes.sectionHeading}>
                  User Email
                </Typography>
                <IconButton color="primary" onClick={handleEditEmailClick}>
                  <Edit />
                </IconButton>
              </div>
              <Divider className={classes.divider} />
              <Typography>
                <span className={classes.label}>Email:</span> {user.email}
              </Typography>
              <div className={classes.sectionHeadingContainer}>
                <Typography variant="h5" className={classes.sectionHeading}>
                  User Password
                </Typography>
                <IconButton color="primary" onClick={handleEditPasswordClick}>
                  <Edit />
                </IconButton>
              </div>
              <Divider className={classes.divider} />
              <div className={classes.buttonContainer}>
                <Button
                  variant="outlined"
                  startIcon={<Delete />}
                  className={classes.deleteButton}
                  color="secondary"
                  onClick={handleDeleteAccountClick}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </Paper>
        </Grid>
      </Grid>
      <EditUserImageDialog
        showDialog={showEditUserImageDialog}
        hideDialog={hideEditUserImageDialog}
      />
      <EditDetailsDialog
        showDialog={showEditDetailsDialog}
        hideDialog={hideEditDetailsDialog}
      />
      <EditEmailDialog
        showDialog={showEditEmailDialog}
        hideDialog={hideEditEmailDialog}
      />
      <EditPasswordDialog
        showDialog={showEditPasswordDialog}
        hideDialog={hideEditPasswordDialog}
      />
      <DeleteAccountDialog
        showDialog={showDeleteAccountDialog}
        hideDialog={hideDeleteAccountDialog}
        history={history}
      />
    </>
  );
}

export default Account;
