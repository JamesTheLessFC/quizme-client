import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchOneQuiz,
  likeOneQuiz,
  saveOneQuiz,
  unlikeOneQuiz,
  unsaveOneQuiz,
} from "./quizAPI";

const initialState = {
  quiz: {},
  currentQuestionIndex: 0,
  score: 0,
  submittedAnswer: "",
  finished: false,
  loading: true,
  failedToLoad: false,
  liked: false,
  saved: false,
  error: null,
};

export const fetchQuiz = createAsyncThunk(
  "quiz/fetchQuiz",
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await fetchOneQuiz(quizId);
      return response;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return rejectWithValue("quiz not found");
      } else {
        throw err;
      }
    }
  }
);

export const likeQuiz = createAsyncThunk(
  "quiz/likeQuiz",
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await likeOneQuiz(quizId);
      return response;
    } catch (err) {
      if (err.response && err.response.status === 400) {
        return rejectWithValue(err.response.data.error);
      } else {
        throw err;
      }
    }
  }
);

export const unlikeQuiz = createAsyncThunk(
  "quiz/unlikeQuiz",
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await unlikeOneQuiz(quizId);
      return response;
    } catch (err) {
      if (err.response && err.response.status === 400) {
        return rejectWithValue(err.response.data.error);
      } else {
        throw err;
      }
    }
  }
);

export const saveQuiz = createAsyncThunk(
  "quiz/saveQuiz",
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await saveOneQuiz(quizId);
      return response;
    } catch (err) {
      if (err.response && err.response.status === 400) {
        return rejectWithValue(err.response.data.error);
      } else {
        throw err;
      }
    }
  }
);

export const unsaveQuiz = createAsyncThunk(
  "quiz/unsaveQuiz",
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await unsaveOneQuiz(quizId);
      return response;
    } catch (err) {
      if (err.response && err.response.status === 400) {
        return rejectWithValue(err.response.data.error);
      } else {
        throw err;
      }
    }
  }
);

export const quizSlice = createSlice({
  name: "quiz",
  initialState: initialState,
  reducers: {
    setLikedAndSaved(quiz, action) {
      quiz.liked = action.payload.liked;
      quiz.saved = action.payload.saved;
    },
    incrementScore(quiz) {
      quiz.score++;
    },
    showNextQuestion(quiz) {
      quiz.currentQuestionIndex++;
      quiz.submittedAnswer = "";
    },
    submitAnswer(quiz, action) {
      quiz.submittedAnswer = action.payload;
    },
    endQuiz(quiz) {
      quiz.finished = true;
    },
    restartQuiz(quiz) {
      quiz.currentQuestionIndex = 0;
      quiz.score = 0;
      quiz.submittedAnswer = "";
      quiz.finished = false;
    },
  },
  extraReducers: {
    [fetchQuiz.pending]: (quiz) => {
      quiz.loading = true;
    },
    [fetchQuiz.fulfilled]: (quiz, action) => {
      quiz.quiz = action.payload;
      quiz.loading = false;
      quiz.failedToLoad = false;
      quiz.error = null;
    },
    [fetchQuiz.rejected]: (quiz, action) => {
      quiz.loading = false;
      quiz.failedToLoad = true;
      quiz.error = action.payload ? action.payload : action.error.message;
    },
    [likeQuiz.pending]: (quiz) => {
      quiz.loading = true;
    },
    [likeQuiz.fulfilled]: (quiz) => {
      quiz.loading = false;
      quiz.failedToLoad = false;
      quiz.quiz.likes++;
      quiz.liked = true;
      quiz.error = null;
    },
    [likeQuiz.rejected]: (quiz, action) => {
      quiz.loading = false;
      quiz.failedToLoad = true;
      quiz.error = action.payload ? action.payload : action.error.message;
    },
    [unlikeQuiz.pending]: (quiz) => {
      quiz.loading = true;
    },
    [unlikeQuiz.fulfilled]: (quiz) => {
      quiz.loading = false;
      quiz.failedToLoad = false;
      quiz.quiz.likes--;
      quiz.liked = false;
      quiz.error = null;
    },
    [unlikeQuiz.rejected]: (quiz, action) => {
      quiz.loading = false;
      quiz.failedToLoad = true;
      quiz.error = action.payload ? action.payload : action.error.message;
    },
    [saveQuiz.pending]: (quiz) => {
      quiz.loading = true;
    },
    [saveQuiz.fulfilled]: (quiz) => {
      quiz.loading = false;
      quiz.failedToLoad = false;
      quiz.saved = true;
      quiz.error = null;
    },
    [saveQuiz.rejected]: (quiz, action) => {
      quiz.loading = false;
      quiz.failedToLoad = true;
      quiz.error = action.payload ? action.payload : action.error.message;
    },
    [unsaveQuiz.pending]: (quiz) => {
      quiz.loading = true;
    },
    [unsaveQuiz.fulfilled]: (quiz) => {
      quiz.loading = false;
      quiz.failedToLoad = false;
      quiz.saved = false;
      quiz.error = null;
    },
    [unsaveQuiz.rejected]: (quiz, action) => {
      quiz.loading = false;
      quiz.failedToLoad = true;
      quiz.error = action.payload ? action.payload : action.error.message;
    },
  },
});

export const selectQuiz = (state) => state.quiz;

export const {
  setLikedAndSaved,
  incrementScore,
  showNextQuestion,
  endQuiz,
  submitAnswer,
  restartQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;
