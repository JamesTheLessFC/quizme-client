import { Button, Container, InputBase, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Search } from "@material-ui/icons";
import React, { useState } from "react";
import Quizzes from "../features/quizzes/Quizzes";

const useStyles = makeStyles((theme) => ({
  container: {
    marginLeft: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  paper: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1),
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  searchButton: {
    padding: 10,
    minWidth: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    "&:disabled": {
      backgroundColor: "white",
    },
  },
}));

function QuizSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const classes = useStyles();

  const handleTermChange = (event) => {
    setShowResults(false);
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowResults(true);
  };

  return (
    <div>
      <Container maxWidth="xs" className={classes.container}>
        <Paper
          component="form"
          className={classes.paper}
          onSubmit={handleSubmit}
        >
          <InputBase
            placeholder="Search Quizzes"
            value={searchTerm}
            onChange={handleTermChange}
            className={classes.input}
          />
          <Button
            type="submit"
            className={classes.searchButton}
            onClick={handleSubmit}
            disabled={searchTerm.trim() === ""}
            color="primary"
          >
            <Search />
          </Button>
        </Paper>
      </Container>
      {showResults && (
        <Quizzes filter={`search?term=${searchTerm.toLowerCase()}`} />
      )}
    </div>
  );
}

export default QuizSearch;
