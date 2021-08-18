import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  selectQuiz,
  fetchQuiz,
  incrementScore,
  showNextQuestion,
  endQuiz,
  submitAnswer,
  restartQuiz,
  likeQuiz,
  unlikeQuiz,
  saveQuiz,
  unsaveQuiz,
  setLikedAndSaved,
} from "./quizSlice";
import { selectUser } from "../user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  ButtonGroup,
  Link,
  Paper,
  Typography,
  CircularProgress,
  useMediaQuery,
} from "@material-ui/core";
import {
  Bookmark,
  BookmarkBorder,
  Check,
  Clear,
  Refresh,
  ThumbUp,
  ThumbUpOutlined,
} from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "84vh",
    backgroundColor: "white",
    overflow: "hidden",
    boxShadow: theme.shadows[5],
  },
  quizHeader: {
    display: "flex",
    padding: theme.spacing(2),
    justifyContent: "space-between",
    backgroundColor: theme.palette.primary.main,
    background: theme.palette.primary.gradient,
    color: theme.palette.primary.contrastText,
  },
  quizTitle: {
    marginRight: theme.spacing(2),
  },
  headerScore: {
    textAlign: "right",
  },
  quizMain: {
    padding: theme.spacing(2),
  },
  question: {
    textAlign: "center",
    margin: theme.spacing(5),
  },
  answerButton: {
    backgroundColor: theme.palette.info.main,
    textTransform: "none",
    color: theme.palette.info.contrastText,
    transition: "font-size .3s linear",
    padding: theme.spacing(1),
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: theme.palette.info.dark,
      fontSize: "1.25em",
    },
  },
  check: {
    color: theme.palette.success.main,
  },
  clear: {
    color: theme.palette.error.main,
  },
  correctAnswerMessage: {
    color: theme.palette.success.dark,
    marginTop: theme.spacing(5),
    transition: "margin-top .3s linear",
  },
  incorrectAnswerMessage: {
    color: theme.palette.error.dark,
    marginTop: theme.spacing(5),
    transition: "margin-top .3s linear",
  },
  nextButton: {
    margin: theme.spacing(5),
    backgroundColor: theme.palette.main,
  },
  quizFooter: {
    textAlign: "center",
    backgroundColor: theme.palette.primary.main,
    background: theme.palette.primary.gradient,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2),
  },
  //finished quiz styles:
  resultsHeaderGoodScore: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(1),
    fontWeight: "bold",
    overflow: "hidden",
  },
  resultsHeaderBadScore: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(1),
    fontWeight: "bold",
    overflow: "hidden",
  },
  resultsContainer: {
    overflow: "hidden",
    margin: theme.spacing(3),
    maxWidth: "20rem",
  },
  optionButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  congratsContainer: {
    margin: theme.spacing(2),
  },
  buttonGroupContainer: {
    margin: theme.spacing(2),
  },
  seeMoreLinkContainer: {
    margin: theme.spacing(2),
  },
}));

function Quiz() {
  const { quizid } = useParams();
  const quiz = useSelector(selectQuiz);
  const dispatch = useDispatch();
  const [answerOrder, setAnswerOrder] = useState([]);
  const user = useSelector(selectUser);
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const [answerMessage, setAnswerMessage] = useState({
    correct: "",
    incorrect: "",
  });

  useEffect(() => {
    dispatch(fetchQuiz(quizid));
  }, [dispatch, quizid]);

  useEffect(() => {
    dispatch(
      setLikedAndSaved({
        liked: user.likedQuizIds.includes(quizid),
        saved: user.savedQuizIds.includes(quizid),
      })
    );
  }, [dispatch, user.likedQuizIds, user.savedQuizIds, quizid]);

  useEffect(() => {
    const newAnswerOrder = [];
    let randomIndex;
    while (newAnswerOrder.length < 4) {
      randomIndex = Math.floor(Math.random() * 4);
      if (newAnswerOrder.includes(randomIndex)) {
        continue;
      } else {
        newAnswerOrder.push(randomIndex);
      }
    }
    setAnswerOrder(newAnswerOrder);
  }, [quiz.currentQuestionIndex]);

  useEffect(() => {
    changeAnswerMessage();
  }, [quiz.currentQuestionIndex]);

  const changeAnswerMessage = () => {
    setAnswerMessage((prevAnswerMessage) => {
      const correctAnswerMessages = [
        "You got it!",
        "Nice job!",
        "Correct!",
        "Nailed it!",
      ];
      const incorrectAnswerMessages = ["Nope!", "Ouch!", "Sorry!", "Oops!"];
      const newAnswerMessage = {};
      let randomIndex;
      while (!newAnswerMessage.correct) {
        randomIndex = Math.floor(Math.random() * 4);
        if (prevAnswerMessage.correct !== correctAnswerMessages[randomIndex]) {
          newAnswerMessage.correct = correctAnswerMessages[randomIndex];
          newAnswerMessage.incorrect = incorrectAnswerMessages[randomIndex];
        }
      }
      return newAnswerMessage;
    });
  };

  const handleAnswerClick = (answerIndex) => {
    dispatch(submitAnswer(answerIndex));
    if (
      quiz.quiz.questions[quiz.currentQuestionIndex].answers[answerIndex]
        .correct
    ) {
      dispatch(incrementScore());
    }
  };

  const handleNextClick = () => {
    if (quiz.currentQuestionIndex + 1 !== quiz.quiz.questions.length) {
      dispatch(showNextQuestion());
    } else {
      dispatch(endQuiz());
    }
  };

  const handleRestartClick = () => {
    dispatch(restartQuiz());
  };

  const handleLike = (quizId) => {
    if (!quiz.liked) {
      dispatch(likeQuiz(quizId));
    } else {
      dispatch(unlikeQuiz(quizId));
    }
  };

  const handleSave = (quizId) => {
    if (!quiz.saved) {
      dispatch(saveQuiz(quizId));
    } else {
      dispatch(unsaveQuiz(quizId));
    }
  };

  if (quiz.loading) {
    return (
      <center>
        <CircularProgress />
      </center>
    );
  }

  if (!quiz.quiz.title) {
    return <Typography>Quiz not found.</Typography>;
  }

  if (quiz.finished)
    return (
      <Paper className={classes.root}>
        <div className={classes.quizHeader}>
          <Typography className={classes.quizTitle}>
            {quiz.quiz.title}
          </Typography>
          <Typography className={classes.headerScore}>
            Final&nbsp;Score: {quiz.score}/{quiz.quiz.questions.length}
          </Typography>
        </div>
        <center className={classes.congratsContainer}>
          <Typography variant="h5">
            Congratulations!
            <br />
            You've finished this quiz.
          </Typography>
        </center>
        <center>
          <Paper className={classes.resultsContainer}>
            <Typography
              className={
                quiz.score / quiz.quiz.questions.length > 0.5
                  ? classes.resultsHeaderGoodScore
                  : classes.resultsHeaderBadScore
              }
            >
              Your Score
            </Typography>
            <Typography variant="h2">{`${Math.round(
              (quiz.score / quiz.quiz.questions.length) * 100
            )}%`}</Typography>
          </Paper>
        </center>
        <center className={classes.buttonGroupContainer}>
          <ButtonGroup>
            <Button
              variant="contained"
              onClick={handleRestartClick}
              startIcon={<Refresh />}
              className={classes.optionButton}
            >
              Restart
            </Button>
            <Button
              variant="contained"
              onClick={() => handleLike(quizid)}
              startIcon={quiz.liked ? <ThumbUp /> : <ThumbUpOutlined />}
              className={classes.optionButton}
            >
              {quiz.quiz.likes}
            </Button>
            <Button
              variant="contained"
              onClick={() => handleSave(quizid)}
              startIcon={quiz.saved ? <Bookmark /> : <BookmarkBorder />}
              className={classes.optionButton}
            >
              {!matches ? "" : quiz.saved ? "Remove" : "Save"}
            </Button>
          </ButtonGroup>
        </center>
        <center className={classes.seeMoreLinkContainer}>
          <Link href={`/quizzes/author/${quiz.quiz.author}`}>
            See more quizzes by {quiz.quiz.author}
          </Link>
        </center>
        <Typography className={classes.quizFooter}>Quiz Complete</Typography>
      </Paper>
    );

  return (
    <Paper className={classes.root}>
      <div className={classes.quizHeader}>
        <Typography className={classes.quizTitle}>{quiz.quiz.title}</Typography>
        <Typography className={classes.headerScore}>
          Current&nbsp;Score: {quiz.score}/{quiz.quiz.questions.length}
        </Typography>
      </div>
      <div className={classes.quizMain}>
        <Typography variant="h5" className={classes.question}>
          {quiz.quiz.questions[quiz.currentQuestionIndex].question}
        </Typography>
        <ButtonGroup
          className={classes.answerGroup}
          orientation="vertical"
          fullWidth
        >
          {answerOrder.map((answerIndex) => (
            <Button
              variant="contained"
              className={classes.answerButton}
              key={answerIndex}
              disabled={quiz.submittedAnswer !== ""}
              onClick={() => handleAnswerClick(answerIndex)}
            >
              {
                quiz.quiz.questions[quiz.currentQuestionIndex].answers[
                  answerIndex
                ].answer
              }
              &nbsp;
              {quiz.submittedAnswer === answerIndex &&
              quiz.quiz.questions[quiz.currentQuestionIndex].answers[
                answerIndex
              ].correct ? (
                <Check className={classes.check} />
              ) : quiz.submittedAnswer === answerIndex ? (
                <Clear className={classes.clear} />
              ) : (
                ""
              )}
            </Button>
          ))}
        </ButtonGroup>
        <center>
          <Typography
            className={
              quiz.submittedAnswer !== "" &&
              quiz.quiz.questions[quiz.currentQuestionIndex].answers[
                quiz.submittedAnswer
              ].correct
                ? classes.correctAnswerMessage
                : quiz.submittedAnswer !== ""
                ? classes.incorrectAnswerMessage
                : ""
            }
          >
            {quiz.submittedAnswer !== "" &&
            quiz.quiz.questions[quiz.currentQuestionIndex].answers[
              quiz.submittedAnswer
            ].correct
              ? answerMessage.correct
              : quiz.submittedAnswer !== ""
              ? answerMessage.incorrect
              : ""}
          </Typography>
        </center>
        <center>
          <Button
            className={classes.nextButton}
            variant="contained"
            size="large"
            color="primary"
            onClick={handleNextClick}
            disabled={quiz.submittedAnswer === ""}
          >
            {quiz.currentQuestionIndex + 1 < quiz.quiz.questions.length
              ? "Next"
              : "Finish"}
          </Button>
        </center>
      </div>
      <Typography className={classes.quizFooter}>
        Question {quiz.currentQuestionIndex + 1} of {quiz.quiz.questions.length}
      </Typography>
    </Paper>
  );
}

export default Quiz;
