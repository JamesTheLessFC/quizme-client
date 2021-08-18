import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  ButtonGroup,
  Grid,
  Link,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Divider,
  CircularProgress,
  Container,
} from "@material-ui/core";
import {
  ThumbUp,
  ThumbUpOutlined,
  Bookmark,
  Edit,
  BookmarkBorder,
} from "@material-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../user/userSlice";
import {
  likeQuiz,
  selectQuizzes,
  fetchQuizzes,
  unlikeQuiz,
  saveQuiz,
  unsaveQuiz,
  setLikedAndSaved,
} from "./QuizzesSlice";
import { useParams } from "react-router";
import dayjs from "dayjs";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const useStyles = makeStyles((theme) => ({
  container: {
    marginLeft: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  noQuizzesPaper: {
    overflow: "hidden",
  },
  noQuizzesHeading: {
    backgroundColor: theme.palette.primary.main,
    background: theme.palette.primary.gradient,
    color: "white",
    padding: theme.spacing(1.5),
    paddingLeft: theme.spacing(2),
  },
  noQuizzesMessage: {
    margin: theme.spacing(2),
  },
  sortByFormContainer: {
    display: "flex",
    alignItems: "stretch",
    overflow: "hidden",
    fontSize: 14,
  },
  sortByFormLabel: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.dark,
    background: theme.palette.primary.gradient,
    padding: theme.spacing(2),
    marginRight: theme.spacing(2),
    display: "flex",
    alignItems: "center",
  },
  radioGroup: {
    flexDirection: "row",
  },
  divider: {
    padding: theme.spacing(0.15),
    backgroundColor: theme.palette.primary.main,
    background: theme.palette.primary.gradient,
  },
  quizItemSmall: {
    overflow: "hidden",
    "&:hover center": {
      height: theme.spacing(6),
      color: "white",
    },
  },
  quizItemLarge: {
    overflow: "hidden",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "&:hover center": {
      width: "30%",
      color: "white",
    },
  },
  quizInfoLarge: {
    width: "95%",
    minWidth: "70%",
    paddingLeft: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quizInfoSmall: {
    width: "100%",
    textAlign: "center",
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  quizTitle: {
    fontWeight: "bold",
  },
  verticalDivider: {
    display: "inline-block",
    height: "21px",
    width: "1px",
    backgroundColor: "rgba(0,0,0,0.25)",
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    position: "relative",
    top: "5px",
  },
  quizAuthorInfoSmall: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing(1),
    fontSize: 16,
  },
  quizAuthorInfoLarge: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(1),
    fontSize: 16,
  },
  avatar: {
    height: theme.spacing(3),
    width: theme.spacing(3),
    display: "inline-block",
  },
  quizAuthorUsername: {
    display: "inline-block",
    paddingRight: theme.spacing(1),
    marginRight: theme.spacing(1),
    borderRight: "1px solid rgba(0,0,0,0.25)",
  },
  buttonGroupSmall: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  buttonGroupLarge: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  startButtonBottom: {
    backgroundColor: theme.palette.primary.dark,
    background:
      "linear-gradient(90deg, rgba(25,38,119,1) 0%, rgba(63,81,181,1) 100%)",
    color: "rgba(0,0,0,0)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: theme.spacing(1),
    transition: "height .3s linear",
    "&:hover": {
      background: theme.palette.primary.extraDark,
      cursor: "pointer",
    },
  },
  startButtonSide: {
    backgroundColor: theme.palette.primary.dark,
    background: theme.palette.primary.gradient,
    width: "5%",
    alignSelf: "stretch",
    color: "rgba(0,0,0,0)",
    transition: "width .5s linear",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      background: theme.palette.primary.extraDark,
      cursor: "pointer",
    },
  },
  loadMoreButton: {
    marginTop: theme.spacing(1),
  },
}));

function Quizzes({ filter }) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const quizzes = useSelector(selectQuizzes);
  const { category } = useParams();
  const { username } = useParams();
  const classes = useStyles();
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up("md"));
  const sm = useMediaQuery(theme.breakpoints.up("sm"));
  const [quizCount, setQuizCount] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [quizList, setQuizList] = useState([]);

  useEffect(() => {
    if (user.finishedLoading && filter === "category") {
      dispatch(
        fetchQuizzes({
          filter: `category/${category}`,
          sortBy,
          set: quizCount / 10,
        })
      );
    }
  }, [filter, category, dispatch, quizCount, sortBy, user.finishedLoading]);

  useEffect(() => {
    if (user.finishedLoading && filter === "author") {
      dispatch(
        fetchQuizzes({
          filter: `author/${username}`,
          sortBy,
          set: quizCount / 10,
        })
      );
    }
  }, [filter, username, dispatch, quizCount, sortBy, user.finishedLoading]);

  useEffect(() => {
    if (user.finishedLoading && filter === "") {
      dispatch(
        fetchQuizzes({
          filter,
          sortBy,
          set: quizCount / 10,
        })
      );
    }
  }, [filter, dispatch, quizCount, sortBy, user.finishedLoading]);

  useEffect(() => {
    if (user.finishedLoading && filter.startsWith("search?term=")) {
      dispatch(
        fetchQuizzes({
          filter,
          sortBy,
          set: quizCount / 10,
        })
      );
    }
  }, [filter, dispatch, quizCount, sortBy, user.finishedLoading]);

  useEffect(() => {
    if (
      user.finishedLoading &&
      filter === "saved" &&
      quizzes.filter !== "saved"
    ) {
      dispatch(
        fetchQuizzes({
          filter,
        })
      );
    }
  }, [dispatch, quizzes.filter, filter, user.finishedLoading]);

  useEffect(() => {
    if (quizzes.finishedLoading) {
      dispatch(
        setLikedAndSaved({
          likedQuizIds: user.likedQuizIds,
          savedQuizIds: user.savedQuizIds,
        })
      );
    }
  }, [user.likedQuizIds, user.savedQuizIds, dispatch, quizzes.finishedLoading]);

  useEffect(() => {
    if (quizzes.finishedLoading && quizzes.quizzes.length > 0) {
      setQuizList(
        filter !== "saved"
          ? quizzes.quizzes
          : quizzes.quizzes
              .slice()
              .sort((a, b) => {
                if (sortBy === "createdAt") {
                  return Date.parse(b.createdAt) - Date.parse(a.createdAt);
                } else {
                  return b.likes - a.likes;
                }
              })
              .filter((quiz, index) => {
                return (
                  index < quizCount && user.savedQuizIds.includes(quiz.quizId)
                );
              })
      );
    }
  }, [
    quizzes.loading,
    quizzes.finishedLoading,
    quizzes.quizzes,
    filter,
    sortBy,
    quizCount,
    user.savedQuizIds,
  ]);

  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
    setQuizCount(10);
  };

  const handleLike = (quizId, liked) => {
    if (!liked) {
      dispatch(likeQuiz(quizId));
    } else {
      dispatch(unlikeQuiz(quizId));
    }
  };

  const handleSave = (quizId, saved) => {
    if (!saved) {
      dispatch(saveQuiz(quizId));
    } else {
      dispatch(unsaveQuiz(quizId));
    }
  };

  const handleLoadMoreClick = () => {
    setQuizCount((prevQuizCount) => {
      return prevQuizCount + 10;
    });
  };

  if (quizzes.loading) {
    return (
      <center>
        <CircularProgress />
      </center>
    );
  }

  if (quizzes.finishedLoading && quizList.length === 0) {
    return (
      <Container maxWidth="xs" className={classes.container}>
        <Paper className={classes.noQuizzesPaper}>
          <Typography className={classes.noQuizzesHeading} variant="h5">
            Sorry!
          </Typography>
          <Typography className={classes.noQuizzesMessage}>
            No quizzes found.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item key="sortByForm" xs={12} lg={9}>
          <Paper className={classes.sortByFormContainer}>
            <FormLabel className={classes.sortByFormLabel} component="legend">
              Sort&nbsp;By
            </FormLabel>
            <RadioGroup
              aria-label="sort by"
              name="sortBy"
              value={sortBy}
              onChange={handleSortByChange}
              className={classes.radioGroup}
            >
              <FormControlLabel
                value="createdAt"
                control={<Radio />}
                label="Newest"
              />
              <FormControlLabel
                value="likes"
                control={<Radio />}
                label="Most Popular"
              />
            </RadioGroup>
          </Paper>
        </Grid>
        <Grid item key="divider" xs={12} lg={9}>
          <Divider className={classes.divider} />
        </Grid>
        {quizList.map((quiz) => (
          <Grid item key={quiz.quizId} xs={12} lg={9}>
            <Paper
              className={md ? classes.quizItemLarge : classes.quizItemSmall}
            >
              <div
                className={md ? classes.quizInfoLarge : classes.quizInfoSmall}
              >
                <div>
                  <Typography className={classes.quizTitle} variant="h6">
                    {quiz.title}
                  </Typography>
                  <Typography>
                    {quiz.questions.length > 1
                      ? quiz.questions.length + " Questions"
                      : quiz.questions.length + " Question"}
                    <span className={classes.verticalDivider}></span>
                    Categories:{" "}
                    {Object.entries(quiz.categories)
                      .filter((entry) => entry[1])
                      .map((entry, index) => (
                        <span key={entry[0]}>
                          <Link href={`/quizzes/categories/${entry[0]}`}>
                            {entry[0]
                              .split("_")
                              .map((word) =>
                                word === "tv"
                                  ? "TV"
                                  : word === "pop"
                                  ? "Pop "
                                  : word.charAt(0).toUpperCase() +
                                    word.substring(1)
                              )
                              .join("")
                              .replace("Or", "/")}
                          </Link>
                          <span>
                            {index + 1 ===
                            Object.entries(quiz.categories).filter(
                              (entry) => entry[1]
                            ).length
                              ? ""
                              : ", "}
                          </span>
                        </span>
                      ))}
                  </Typography>
                  <div
                    className={
                      md
                        ? classes.quizAuthorInfoLarge
                        : classes.quizAuthorInfoSmall
                    }
                  >
                    <Avatar
                      className={classes.avatar}
                      src={quiz.authorImageUrl}
                    />
                    &nbsp;
                    <Link
                      className={classes.quizAuthorUsername}
                      href={`/quizzes/author/${quiz.author}`}
                    >
                      {quiz.author}
                    </Link>
                    <span>
                      {sm ? " Created " : " "}
                      {dayjs(quiz.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
                <ButtonGroup
                  className={
                    md ? classes.buttonGroupLarge : classes.buttonGroupSmall
                  }
                  variant="text"
                  orientation={md ? "vertical" : "horizontal"}
                >
                  <Tooltip title="Like Quiz">
                    <Button
                      startIcon={quiz.liked ? <ThumbUp /> : <ThumbUpOutlined />}
                      onClick={() => handleLike(quiz.quizId, quiz.liked)}
                    >
                      {quiz.likes}
                    </Button>
                  </Tooltip>
                  <Button
                    startIcon={quiz.saved ? <Bookmark /> : <BookmarkBorder />}
                    onClick={() => handleSave(quiz.quizId, quiz.saved)}
                  >
                    {quiz.saved ? "Remove" : "Save"}
                  </Button>
                  <Button
                    startIcon={<Edit />}
                    disabled={quiz.author !== user.username}
                    href={`/quiz/${quiz.quizId}/edit`}
                  >
                    Edit
                  </Button>
                </ButtonGroup>
              </div>
              <center
                className={
                  md ? classes.startButtonSide : classes.startButtonBottom
                }
                onClick={() => (window.location = `/quiz/${quiz.quizId}`)}
              >
                <Typography className={classes.startButtonText} variant="h6">
                  Start
                </Typography>
              </center>
            </Paper>
          </Grid>
        ))}
        <Grid item key={"loadMoreButton"} xs={12} lg={9}>
          <center>
            <Button
              className={classes.loadMoreButton}
              disabled={
                filter !== "saved"
                  ? !quizzes.moreQuizzes
                  : quizzes.quizzes.length <= quizCount
              }
              onClick={handleLoadMoreClick}
              variant="contained"
              color="primary"
            >
              Load More Quizzes
            </Button>
          </center>
        </Grid>
      </Grid>
    </>
  );
}

export default Quizzes;
