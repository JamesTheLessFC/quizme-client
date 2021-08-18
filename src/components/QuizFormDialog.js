import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Icon,
} from "@material-ui/core";
import { selectUser } from "../features/user/userSlice";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Warning } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    backgroundColor: theme.palette.primary.main,
    background: theme.palette.primary.gradient,
    color: "white",
  },
  warningContainer: {
    display: "flex",
    alignItems: "center",
    color: theme.palette.warning.dark,
  },
  warningIcon: {
    color: theme.palette.warning.main,
    marginRight: theme.spacing(2),
    display: "flex",
    alignItems: "center",
  },
  dialogActions: {
    flexWrap: "wrap",
  },
}));

function QuizFormDialog({
  showDialog,
  hideDialog,
  deleteQuiz,
  dialogType,
  quizId,
  deleting,
}) {
  const user = useSelector(selectUser);
  const classes = useStyles();

  const navigateToQuizEditPage = () => {
    window.location = `/quiz/${quizId}/edit`;
  };

  return (
    <Dialog
      open={showDialog}
      onClose={dialogType === "delete" ? hideDialog : navigateToQuizEditPage}
    >
      <DialogTitle className={classes.dialogTitle}>
        {dialogType === "delete"
          ? "Delete this quiz?"
          : dialogType === "create"
          ? "Quiz Created Successfully!"
          : "Quiz Updated Successfully!"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <br />
          {dialogType === "delete" ? (
            <div className={classes.warningContainer}>
              <Icon className={classes.warningIcon}>
                <Warning />
              </Icon>
              <Typography>
                Once you've deleted this quiz, it can't be recovered.
              </Typography>
            </div>
          ) : (
            "We recommend testing your quiz to make sure everything looks okay."
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        {dialogType === "delete" ? (
          <>
            <Button
              onClick={deleteQuiz}
              color="primary"
              disabled={deleting ? true : false}
            >
              {deleting ? <CircularProgress size={20} /> : "Delete Quiz"}
            </Button>
            <Button onClick={hideDialog} color="primary" autoFocus>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => (window.location = `/quiz/${quizId}`)}
              color="primary"
              autoFocus
            >
              Test Quiz
            </Button>
            <Button onClick={navigateToQuizEditPage} color="primary">
              Continue Editing
            </Button>
            <Button
              onClick={() =>
                (window.location = `/quizzes/author/${user.username}`)
              }
              color="primary"
            >
              Go To My Quizzes
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default QuizFormDialog;
