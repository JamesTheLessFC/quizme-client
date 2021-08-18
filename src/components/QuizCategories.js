import { Grid, Paper, Typography } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const images = {
  animals:
    "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Fanimals.jpg?alt=media&token=d6431d03-3174-4231-9d3c-3f2460ae782a",
  art: "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Fart.jpg?alt=media&token=39ff1837-4760-49a9-9e94-bf3eb96897ed",
  beauty_or_fashion:
    "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Fbeauty_or_fashion.jpg?alt=media&token=f340749a-9f04-41fe-b509-74e5d38cfc1a",
  books_or_literature:
    "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Fbooks_or_literature.jpg?alt=media&token=9f79d01b-4256-48a6-906d-e80cf440e5e7",
  dating_or_relationships:
    "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Fdating_or_relationships.jpg?alt=media&token=68522b19-eb64-49a6-b440-cc27a3595eed",
  educational:
    "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Feducational.jpg?alt=media&token=19fb822a-10e2-4f10-ba09-082e780e19fd",
  food: "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Ffood.jpg?alt=media&token=2cf969db-17fb-4a7f-af75-b3cebc95c67a",
  geography:
    "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Fgeography.jpg?alt=media&token=92a0eb33-401c-451b-9ef5-0cb1515b153e",
  history:
    "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Fhistory.jpg?alt=media&token=04583d17-47c2-4643-b283-635615bb9f16",
  humor:
    "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Fhumor.jpg?alt=media&token=262d60eb-c46f-4bcd-bdd9-c43e231ccbbc",
  movies_or_tv:
    "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Fmovies_or_tv.jpg?alt=media&token=0d4e0096-218b-4236-967b-2b9d7be0c614",
  music:
    "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Fmusic.jpg?alt=media&token=459c6487-78fc-4139-84ed-67afca4471b1",
  other:
    "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Fother.jpg?alt=media&token=214fba0d-0e61-4675-991c-aad292331981",
  people:
    "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Fpeople.jpg?alt=media&token=20357f65-7131-4db0-acb8-f0c765fb93fe",
  politics:
    "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Fpolitics.jpg?alt=media&token=a92219ca-9300-4130-98f4-7b80ff67520c",
  pop_culture:
    "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Fpop_culture.jpg?alt=media&token=d332b16e-15e2-4a8f-bc86-3b376c56ca49",
  religion_or_spirituality:
    "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Freligion_or_spirituality.jpg?alt=media&token=9132239a-01f0-4179-a056-9edcacd2879e",
  science:
    "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Fscience.jpg?alt=media&token=d0f0c806-20ec-4191-a372-51ed61707e79",
  sports:
    "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Fsports.jpg?alt=media&token=4d91eab6-ec30-4684-997f-8ab14ca3bbda",
  technology:
    "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Ftechnology.jpg?alt=media&token=f500283d-34b5-41d9-9417-618925e40363",
  travel:
    "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Ftravel.jpg?alt=media&token=ea0fe80c-922f-4471-98c7-6ea39a8a1638",
  trivia:
    "https://firebasestorage.googleapis.com/v0/b/quizme-cf318.appspot.com/o/categories%2Ftrivia.jpg?alt=media&token=b69304b9-0969-48a4-8345-ae31342f254e",
};

const useStyles = makeStyles((theme) => ({
  category: {
    backgroundColor: theme.palette.primary.main,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    height: "100%",
    "&:hover a": {
      height: theme.spacing(6),
      color: theme.palette.primary.contrastText,
    },
  },
  categoryTitle: {
    padding: theme.spacing(1),
    color: theme.palette.primary.contrastText,
    wordSpacing: "-.1em",
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  categoryImg: {
    maxWidth: "100%",
  },
  categoryLink: {
    position: "absolute",
    backgroundColor: theme.palette.primary.main,
    bottom: 0,
    height: theme.spacing(1),
    width: "100%",
    transition: "height .3s linear",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "rgba(0,0,0,0)",
    textDecoration: "none",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

function QuizCategories() {
  const classes = useStyles();
  const categories = [
    "animals",
    "art",
    "beauty_or_fashion",
    "books_or_literature",
    "dating_or_relationships",
    "educational",
    "food",
    "geography",
    "history",
    "humor",
    "movies_or_tv",
    "music",
    "other",
    "people",
    "politics",
    "pop_culture",
    "religion_or_spirituality",
    "science",
    "sports",
    "technology",
    "travel",
    "trivia",
  ];

  return (
    <Grid container>
      <Grid item xs={12} lg={9}>
        <Grid container spacing={2} alignItems="stretch">
          {categories.map((category) => (
            <Grid item xs={6} md={4} key={category}>
              <Paper className={classes.category}>
                <Typography className={classes.categoryTitle}>
                  {category
                    .split("_")
                    .map((word) =>
                      word === "tv"
                        ? "TV"
                        : word === "pop"
                        ? "Pop "
                        : word.charAt(0).toUpperCase() + word.substring(1)
                    )
                    .join("")
                    .replace("Or", " / ")}
                </Typography>
                <img
                  className={classes.categoryImg}
                  src={images[category]}
                  alt={category + " category image"}
                />
                <a
                  className={classes.categoryLink}
                  href={`/quizzes/categories/${category}`}
                >
                  <Typography>Browse Quizzes</Typography>
                </a>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default QuizCategories;
