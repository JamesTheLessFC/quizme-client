import {
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import { Add, Delete, Publish } from "@material-ui/icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import QuizFormDialog from "./QuizFormDialog";
import {
  showSnackbarMessage,
  setSnackbarMessageContent,
  setSnackbarMessageSeverity,
} from "../features/snackbar/snackbarMessageSlice";
import { useDispatch } from "react-redux";
import { selectUser } from "../features/user/userSlice";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  paper: {
    overflow: "hidden",
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
  textField: {
    marginBottom: theme.spacing(3),
  },
  tagsContainer: {
    marginBottom: theme.spacing(3),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  divider: {
    marginBottom: theme.spacing(3),
  },
  helperText: {
    marginTop: 0,
    marginBottom: theme.spacing(3),
  },
  deleteQuestionButton: {
    marginBottom: theme.spacing(3),
  },
  deleteQuestionButtonContainer: {
    textAlign: "right",
  },
  addQuestionButton: {
    marginBottom: theme.spacing(3),
  },
  bottomButtonsContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  submitButton: {},
  deleteQuizButton: {},
}));

function CreateQuizForm() {
  const classes = useStyles();
  const { quizid } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const [categories, setCategories] = useState({
    animals: false,
    art: false,
    beauty_or_fashion: false,
    books_or_literature: false,
    dating_or_relationships: false,
    educational: false,
    food: false,
    geography: false,
    history: false,
    humor: false,
    movies_or_tv: false,
    music: false,
    other: false,
    people: false,
    politics: false,
    pop_culture: false,
    religion_or_spirituality: false,
    science: false,
    sports: false,
    technology: false,
    travel: false,
    trivia: false,
  });
  const [questions, setQuestions] = useState([
    {
      question: "",
      answers: {
        answer1: "",
        answer2: "",
        answer3: "",
        answer4: "",
      },
      correctAnswer: "answer1",
    },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState("create");
  const [quizId, setQuizId] = useState("");

  const authToken = localStorage.getItem("AuthToken");
  axios.defaults.headers.common = { Authorization: `${authToken}` };

  useEffect(() => {
    setQuizId(quizid);
  }, [quizid]);

  useEffect(() => {
    if (quizid) {
      setLoading(true);
      axios
        .get(
          `https://us-central1-quizme-cf318.cloudfunctions.net/api/quizzes/${quizid}`
        )
        .then((response) => {
          const quiz = response.data;
          setTitle(quiz.title);
          setTags(quiz.tags);
          setCategories({
            animals: quiz.categories.animals,
            art: quiz.categories.art,
            beauty_or_fashion: quiz.categories.beauty_or_fashion,
            books_or_literature: quiz.categories.books_or_literature,
            dating: quiz.categories.dating_or_relationships,
            educational: quiz.categories.educational,
            food: quiz.categories.food,
            geography: quiz.categories.geography,
            history: quiz.categories.history,
            humor: quiz.categories.humor,
            movies_or_tv: quiz.categories.movies_or_tv,
            music: quiz.categories.music,
            other: quiz.categories.other,
            people: quiz.categories.people,
            politics: quiz.categories.politics,
            pop_culture: quiz.categories.pop_culture,
            religion_or_spirituality: quiz.categories.religion_or_spirituality,
            science: quiz.categories.science,
            sports: quiz.categories.sports,
            technology: quiz.categories.technology,
            travel: quiz.categories.travel,
            trivia: quiz.categories.trivia,
          });
          setQuestions(
            quiz.questions.map((question) => {
              return {
                question: question.question,
                answers: {
                  answer1: question.answers[0].answer,
                  answer2: question.answers[1].answer,
                  answer3: question.answers[2].answer,
                  answer4: question.answers[3].answer,
                },
                correctAnswer: question.answers[0].correct
                  ? "answer1"
                  : question.answers[1].correct
                  ? "answer2"
                  : question.answers[2].correct
                  ? "answer3"
                  : "answer4",
              };
            })
          );
        })
        .catch((err) => {
          console.error(err);
        });
      setLoading(false);
    }
  }, [quizid]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    if (errors.title) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        title: "",
      }));
    }
  };

  const handleTagChange = (event) => {
    setTag(event.target.value);
  };

  const addTag = () => {
    if (tag.trim() !== "" && !tags.includes(tag.trim().toLowerCase())) {
      setTags((prevTags) => [...prevTags, tag.trim().toLowerCase()]);
    }
    setTag("");
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
  };

  const handleCategoryChange = (event) => {
    setCategories((prevCategories) => ({
      ...prevCategories,
      [event.target.name]: !categories[event.target.name],
    }));
    if (errors.categories) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        categories: "",
      }));
    }
  };

  const handleQuestionChange = (indexToChange, event) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, index) => {
        if (index === indexToChange) {
          return {
            question: event.target.value,
            answers: question.answers,
            correctAnswer: question.correctAnswer,
          };
        } else {
          return question;
        }
      })
    );
    if (
      errors[`question${indexToChange + 1}`] &&
      errors[`question${indexToChange + 1}`].question
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`question${indexToChange + 1}`]: {
          ...prevErrors[`question${indexToChange + 1}`],
          question: "",
        },
      }));
    }
  };

  const handleAnswerChange = (indexToChange, event) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, index) => {
        if (index === indexToChange) {
          return {
            question: question.question,
            answers: {
              ...question.answers,
              [event.target.name]: event.target.value,
            },
            correctAnswer: question.correctAnswer,
          };
        } else {
          return question;
        }
      })
    );
    if (
      errors[`question${indexToChange + 1}`] &&
      errors[`question${indexToChange + 1}`][event.target.name]
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`question${indexToChange + 1}`]: {
          ...prevErrors[`question${indexToChange + 1}`],
          [event.target.name]: "",
        },
      }));
    }
  };

  const handleCorrectAnswerChange = (indexToChange, event) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, index) => {
        if (index === indexToChange) {
          return {
            question: question.question,
            answers: question.answers,
            correctAnswer: event.target.value,
          };
        } else {
          return question;
        }
      })
    );
  };

  const addQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        question: "",
        answers: {
          answer1: "",
          answer2: "",
          answer3: "",
          answer4: "",
        },
        correctAnswer: "answer1",
      },
    ]);
  };

  const handleDeleteQuestionClick = (questionIndex) => {
    if (Object.keys(errors).length > 0) {
      // there are errors present
      setErrors((prevErrors) => {
        let updatedErrors = {};
        Object.keys(prevErrors).forEach((key) => {
          if (key.startsWith("question")) {
            // this is a question error
            if (Number(key.substring(8)) - 1 < questionIndex) {
              // question number is less than deleted question, so keep as is
              updatedErrors[key] = prevErrors[key];
            } else if (Number(key.substring(8)) - 1 > questionIndex) {
              // question number is greater than deleted question, so update the error's question number
              updatedErrors[`question${Number(key.substring(8)) - 1}`] =
                prevErrors[key];
            }
          } else {
            // the error is not a question error, so keep as is
            updatedErrors[key] = prevErrors[key];
          }
        });
        return {
          ...updatedErrors,
        };
      });
    }
    setQuestions((prevQuestions) => {
      return prevQuestions.filter((question, index) => index !== questionIndex);
    });
  };

  const isEmpty = (string) => {
    if (string.trim() === "") return true;
    else return false;
  };

  const validateQuizData = (data) => {
    let inputErrors = {};

    if (isEmpty(data.title)) inputErrors.title = "Must not be empty";
    let categories = Object.values(data.categories).filter((value) => value);
    if (categories.length > 3) {
      inputErrors.categories = "Must not have more than 3 categories";
    } else if (categories.length < 1) {
      inputErrors.categories = "Must have at least 1 category";
    }
    data.questions.forEach((question, i) => {
      if (isEmpty(question.question))
        inputErrors[`question${i + 1}`] = { question: "Must not be empty" };
      question.answers.forEach((answer, j) => {
        if (
          question.answers.filter((ans) => ans.answer === answer.answer)
            .length > 1
        )
          inputErrors[`question${i + 1}`] = {
            ...inputErrors[`question${i + 1}`],
            [`answer${j + 1}`]: "Each answer must be unique",
          };
        if (isEmpty(answer.answer))
          inputErrors[`question${i + 1}`] = {
            ...inputErrors[`question${i + 1}`],
            [`answer${j + 1}`]: "Must not be empty",
          };
      });
    });

    return {
      inputErrors,
      valid: Object.keys(inputErrors).length === 0,
    };
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let quiz = {
      title: title,
      tags: tags,
      categories: categories,
      questions: questions.map((question, index) => {
        return {
          question: question.question,
          answers: [
            {
              answer: question.answers.answer1,
              correct: question.correctAnswer === "answer1",
            },
            {
              answer: question.answers.answer2,
              correct: question.correctAnswer === "answer2",
            },
            {
              answer: question.answers.answer3,
              correct: question.correctAnswer === "answer3",
            },
            {
              answer: question.answers.answer4,
              correct: question.correctAnswer === "answer4",
            },
          ],
        };
      }),
    };

    setSubmitting(true);

    const { inputErrors, valid } = validateQuizData(quiz);
    if (!valid) {
      setErrors(inputErrors);
      setSubmitting(false);
      return;
    }

    if (quizid) {
      axios
        .put(
          `https://us-central1-quizme-cf318.cloudfunctions.net/api/quizzes/${quizid}`,
          quiz
        )
        .then((response) => {
          setSubmitting(false);
          setDialogType("update");
          setShowDialog(true);
        })
        .catch((err) => {
          if (err.response.status === 400) {
            setErrors(err.response.data);
          } else {
            dispatch(setSnackbarMessageSeverity("error"));
            dispatch(setSnackbarMessageContent("Oops! Something went wrong."));
            dispatch(showSnackbarMessage());
          }
          setSubmitting(false);
        });
    } else {
      axios
        .post(
          "https://us-central1-quizme-cf318.cloudfunctions.net/api/quizzes",
          quiz
        )
        .then((response) => {
          setSubmitting(false);
          setQuizId(response.data.quizId);
          setDialogType("create");
          setShowDialog(true);
        })
        .catch((err) => {
          if (err.response.status === 400) {
            setErrors(err.response.data);
          } else {
            dispatch(setSnackbarMessageSeverity("error"));
            dispatch(setSnackbarMessageContent("Oops! Something went wrong."));
            dispatch(showSnackbarMessage());
          }
          setSubmitting(false);
        });
    }
  };

  const handleDeleteQuizClick = () => {
    setDialogType("delete");
    setShowDialog(true);
  };

  const hideDialog = () => {
    setShowDialog(false);
  };

  const deleteQuiz = () => {
    setDeleting(true);
    axios
      .delete(`/quizzes/${quizid}`)
      .then((response) => {
        setDeleting(false);
        window.location = `/quizzes/author/${user.username}`;
        dispatch(setSnackbarMessageSeverity("success"));
        dispatch(setSnackbarMessageContent("Quiz deleted successfully!"));
        dispatch(showSnackbarMessage());
      })
      .catch((err) => {
        console.error(err.response.data);
        setDeleting(false);
        dispatch(setSnackbarMessageSeverity("error"));
        dispatch(setSnackbarMessageContent("Oops! Something went wrong."));
        dispatch(showSnackbarMessage());
        setShowDialog(false);
      });
  };

  if (loading) {
    return (
      <center>
        <CircularProgress />
      </center>
    );
  }

  return (
    <Grid container>
      <Grid item xs={12} lg={9}>
        <Paper className={classes.paper}>
          <Typography variant="h5" className={classes.heading}>
            Quiz Submission Form
          </Typography>
          <div className={classes.content}>
            <TextField
              required
              name="title"
              label="Title"
              variant="outlined"
              fullWidth
              onChange={handleTitleChange}
              value={title}
              error={errors.title ? true : false}
              helperText={errors.title}
              className={classes.textField}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
            />
            <TextField
              name="tag"
              value={tag}
              variant="outlined"
              label="Enter tags here"
              fullWidth
              onChange={handleTagChange}
              className={classes.textField}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  addTag();
                }
              }}
              helperText={
                tags.length === 0 &&
                'Tags (keywords) help users find your quiz when using the "Search Quizzes" function'
              }
            />
            <div className={tags.length > 0 ? classes.tagsContainer : ""}>
              {tags.length > 0 && <FormLabel>Tags&nbsp;</FormLabel>}
              {tags.map((tag, index) => (
                <Chip
                  label={tag}
                  key={`tag${index}`}
                  onDelete={() => handleDeleteTag(tag)}
                  className={classes.chip}
                />
              ))}
            </div>
            <form
              id="quiz-form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <FormControl
                component="fieldset"
                error={errors.categories ? true : false}
              >
                <FormLabel component="legend">Categories</FormLabel>
                <FormGroup row>
                  {Object.entries(categories).map((entry, index) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          checked={entry[1]}
                          onChange={handleCategoryChange}
                          name={entry[0]}
                        />
                      }
                      label={entry[0]
                        .split("_")
                        .map((word) =>
                          word === "tv"
                            ? "TV"
                            : word === "pop"
                            ? "Pop "
                            : word.charAt(0).toUpperCase() + word.substring(1)
                        )
                        .join("")
                        .replace("Or", "/")}
                    />
                  ))}
                </FormGroup>
                <FormHelperText className={classes.helperText}>
                  {errors.categories
                    ? errors.categories
                    : "Choose at least 1 category and no more than 3"}
                </FormHelperText>
              </FormControl>
              {questions.map((question, index) => (
                <div key={index}>
                  <Divider className={classes.divider} />
                  <TextField
                    name="question"
                    required
                    value={question.question}
                    label={`Question ${index + 1}`}
                    variant="outlined"
                    fullWidth
                    id={`question${index}`}
                    onChange={(e) => handleQuestionChange(index, e)}
                    error={
                      errors[`question${index + 1}`] &&
                      errors[`question${index + 1}`].question
                        ? true
                        : false
                    }
                    helperText={
                      errors[`question${index + 1}`]
                        ? errors[`question${index + 1}`].question
                        : ""
                    }
                    className={classes.textField}
                  />
                  <TextField
                    name="answer1"
                    value={question.answers.answer1}
                    label="Answer 1"
                    variant="outlined"
                    fullWidth
                    required
                    onChange={(e) => handleAnswerChange(index, e)}
                    error={
                      errors[`question${index + 1}`] &&
                      errors[`question${index + 1}`].answer1
                        ? true
                        : false
                    }
                    helperText={
                      errors[`question${index + 1}`]
                        ? errors[`question${index + 1}`].answer1
                        : ""
                    }
                    className={classes.textField}
                  />
                  <TextField
                    name="answer2"
                    value={question.answers.answer2}
                    label="Answer 2"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => handleAnswerChange(index, e)}
                    required
                    error={
                      errors[`question${index + 1}`] &&
                      errors[`question${index + 1}`].answer2
                        ? true
                        : false
                    }
                    helperText={
                      errors[`question${index + 1}`]
                        ? errors[`question${index + 1}`].answer2
                        : ""
                    }
                    className={classes.textField}
                  />
                  <TextField
                    name="answer3"
                    value={question.answers.answer3}
                    label="Answer 3"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => handleAnswerChange(index, e)}
                    required
                    error={
                      errors[`question${index + 1}`] &&
                      errors[`question${index + 1}`].answer3
                        ? true
                        : false
                    }
                    helperText={
                      errors[`question${index + 1}`]
                        ? errors[`question${index + 1}`].answer3
                        : ""
                    }
                    className={classes.textField}
                  />
                  <TextField
                    name="answer4"
                    value={question.answers.answer4}
                    label="Answer 4"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => handleAnswerChange(index, e)}
                    required
                    error={
                      errors[`question${index + 1}`] &&
                      errors[`question${index + 1}`].answer4
                        ? true
                        : false
                    }
                    helperText={
                      errors[`question${index + 1}`]
                        ? errors[`question${index + 1}`].answer4
                        : ""
                    }
                    className={classes.textField}
                  />
                  <FormControl
                    component="fieldset"
                    error={
                      errors[`question${index + 1}`] &&
                      errors[`question${index + 1}`].correctAnswer
                        ? true
                        : false
                    }
                  >
                    <FormLabel component="legend">Correct Answer</FormLabel>
                    <RadioGroup
                      name="correctAnswer"
                      value={question.correctAnswer}
                      onChange={(e) => handleCorrectAnswerChange(index, e)}
                      row
                    >
                      <FormControlLabel
                        value="answer1"
                        control={<Radio />}
                        label="Answer 1"
                      />
                      <FormControlLabel
                        value="answer2"
                        control={<Radio />}
                        label="Answer 2"
                      />
                      <FormControlLabel
                        value="answer3"
                        control={<Radio />}
                        label="Answer 3"
                      />
                      <FormControlLabel
                        value="answer4"
                        control={<Radio />}
                        label="Answer 4"
                      />
                    </RadioGroup>
                    <FormHelperText>
                      {errors[`question${index + 1}`]
                        ? errors[`question${index + 1}`].correctAnswer
                        : ""}
                    </FormHelperText>
                  </FormControl>
                  <div className={classes.deleteQuestionButtonContainer}>
                    <Button
                      startIcon={<Delete />}
                      className={classes.deleteQuestionButton}
                      disabled={questions.length === 1 ? true : false}
                      onClick={() => handleDeleteQuestionClick(index)}
                    >
                      Delete Question {index + 1}
                    </Button>
                  </div>
                </div>
              ))}
              <Divider className={classes.divider} />
              <Button
                onClick={addQuestion}
                startIcon={<Add />}
                className={classes.addQuestionButton}
              >
                Add Question
              </Button>
              <Divider className={classes.divider} />
              <div className={classes.bottomButtonsContainer}>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  variant="contained"
                  className={classes.submitButton}
                  startIcon={submitting ? "" : <Publish />}
                  color="primary"
                  form="quiz-form"
                  disabled={submitting ? true : false}
                >
                  {submitting ? (
                    <CircularProgress size={20} />
                  ) : quizid ? (
                    "Update Quiz"
                  ) : (
                    "Create Quiz"
                  )}
                </Button>

                <Button
                  className={classes.deleteQuizButton}
                  startIcon={<Delete />}
                  variant="contained"
                  color="secondary"
                  disabled={deleting || !quizid ? true : false}
                  onClick={handleDeleteQuizClick}
                >
                  Delete Quiz
                </Button>
                <QuizFormDialog
                  showDialog={showDialog}
                  hideDialog={hideDialog}
                  deleteQuiz={deleteQuiz}
                  dialogType={dialogType}
                  quizId={quizId}
                  deleting={deleting}
                />
              </div>
            </form>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default CreateQuizForm;
