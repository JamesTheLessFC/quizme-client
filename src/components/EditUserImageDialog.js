import React, { useState, useEffect } from "react";
import { selectUser } from "../features/user/userSlice";
import { useSelector } from "react-redux";
import {
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Icon,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Cancel, CloudUpload, Error, Help } from "@material-ui/icons";
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
  dialogContent: {
    padding: theme.spacing(2),
  },
  avatarFileInputContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    margin: theme.spacing(2),
  },
  fileInputHelpContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    flexBasis: "70%",
    flexGrow: 1,
  },
  customFileInput: {
    ...theme.typography.button,
    cursor: "pointer",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[300],
    padding: theme.spacing(1),
    display: "inline-block",
    boxShadow: theme.shadows[2],
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.15)",
      boxShadow: theme.shadows[4],
    },
  },
  fileInput: {
    display: "none",
  },
  helpContainer: {
    display: "flex",
    alignItems: "center",
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  helpMessage: {},
  errorMessage: {
    color: theme.palette.error.main,
  },
  helpIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  errorIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.error.main,
  },
  fileInputInnerContainer: {
    display: "flex",
    alignItems: "center",
    flexBasis: "100%",
    justifyContent: "center",
  },
  fileName: {
    marginLeft: theme.spacing(2),
    wordBreak: "break-all",
  },
  noFileChosen: {
    marginLeft: theme.spacing(2),
    wordBreak: "break-word",
  },
  uploadImageButton: {
    marginTop: theme.spacing(2),
  },
}));

function EditUserImageDialog({ showDialog, hideDialog }) {
  const classes = useStyles();
  const user = useSelector(selectUser);
  const [imageError, setImageError] = useState("");
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [avatar, setAvatar] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setAvatar(user.imageUrl);
    setImage(null);
    setImageError("");
    setFileName("No file chosen");
  }, [user, showDialog]);

  const handleImageChange = (event) => {
    setFileName(
      event.target.files.item(0)
        ? event.target.files.item(0).name
        : "No file chosen"
    );
    const fileExtensionRegex = /\.(jpe?g|png)$/i;
    setImageError(
      event.target.files.item(0) &&
        !fileExtensionRegex.test(event.target.files.item(0).name)
        ? "Image Format Error: Supported formats are JPG and PNG."
        : ""
    );
    setAvatar(
      event.target.files[0]
        ? URL.createObjectURL(event.target.files[0])
        : user
        ? user.imageUrl
        : null
    );
    setImage(event.target.files[0]);
  };

  const profilePictureHandler = () => {
    setSubmitting(true);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    let form_data = new FormData();
    form_data.append("image", image);
    axios
      .post(
        "https://us-central1-quizme-cf318.cloudfunctions.net/api/user/image",
        form_data,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        setSubmitting(false);
        window.location.reload();
        dispatch(setSnackbarMessageContent("Image upload successful!"));
        dispatch(setSnackbarMessageSeverity("success"));
        dispatch(showSnackbarMessage());
      })
      .catch((err) => {
        setSubmitting(false);
        if (
          err.response &&
          err.response.data.error === "Wrong file type submitted"
        ) {
          setImageError(
            "Image Format Error: Supported formats are JPG and PNG."
          );
        }
        dispatch(setSnackbarMessageContent("Image upload failed"));
        dispatch(setSnackbarMessageSeverity("error"));
        dispatch(showSnackbarMessage());
      });
  };

  return (
    <Dialog open={showDialog} onClose={hideDialog}>
      <DialogTitle className={classes.title}>Edit User Image</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <div className={classes.avatarFileInputContainer}>
          <Avatar className={classes.avatar} src={avatar} />
          <div className={classes.fileInputHelpContainer}>
            <div className={classes.helpContainer}>
              <Icon
                className={imageError ? classes.errorIcon : classes.helpIcon}
              >
                {imageError ? <Error /> : <Help />}
              </Icon>
              <Typography
                className={
                  imageError ? classes.errorMessage : classes.helpMessage
                }
              >
                {imageError
                  ? imageError
                  : "To change your user image, choose a file and then click the 'Upload' button."}
              </Typography>
            </div>
            <div className={classes.fileInputInnerContainer}>
              <label className={classes.customFileInput}>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className={classes.fileInput}
                />
                Choose&nbsp;File
              </label>
              <Typography
                className={
                  fileName === "No file chosen"
                    ? classes.noFileChosen
                    : classes.fileName
                }
              >
                {fileName}
              </Typography>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          startIcon={submitting ? "" : <CloudUpload />}
          onClick={profilePictureHandler}
          disabled={imageError || fileName === "No file chosen" || submitting}
        >
          {submitting ? <CircularProgress size={20} /> : "Upload"}
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

export default EditUserImageDialog;
