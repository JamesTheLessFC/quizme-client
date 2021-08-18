import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchQuizzesWithFilter,
  likeOneQuiz,
  unlikeOneQuiz,
  saveOneQuiz,
  unsaveOneQuiz,
} from "./quizzesAPI";

const initialState = {
  quizzes: [],
  loading: true,
  failedToLoad: false,
  finishedLoading: false,
  sortBy: "createdAt",
  error: null,
};

export const fetchQuizzes = createAsyncThunk(
  "quizzes/fetchQuizzes",
  async ({ filter, sortBy, set }, { rejectWithValue }) => {
    try {
      const response = await fetchQuizzesWithFilter(filter, sortBy, set);
      return response;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data.error);
      } else {
        throw err;
      }
    }
  }
);

export const likeQuiz = createAsyncThunk(
  "quizzes/likeQuiz",
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await likeOneQuiz(quizId);
      return response;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data.error);
      } else {
        throw err;
      }
    }
  }
);

export const unlikeQuiz = createAsyncThunk(
  "quizzes/unlikeQuiz",
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await unlikeOneQuiz(quizId);
      return response;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data.error);
      } else {
        throw err;
      }
    }
  }
);

export const saveQuiz = createAsyncThunk(
  "quizzes/saveQuiz",
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await saveOneQuiz(quizId);
      return response;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data.error);
      } else {
        throw err;
      }
    }
  }
);

export const unsaveQuiz = createAsyncThunk(
  "quizzes/unsaveQuiz",
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await unsaveOneQuiz(quizId);
      return response;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data.error);
      } else {
        throw err;
      }
    }
  }
);

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState: initialState,
  reducers: {
    setLikedAndSaved(quizzes, action) {
      quizzes.quizzes = quizzes.quizzes.map((quiz) => {
        return {
          ...quiz,
          liked: action.payload.likedQuizIds.includes(quiz.quizId),
          saved: action.payload.savedQuizIds.includes(quiz.quizId),
        };
      });
    },
  },
  extraReducers: {
    [fetchQuizzes.pending]: (quizzes) => {
      quizzes.loading = true;
      quizzes.failedToLoad = false;
      quizzes.finishedLoading = false;
      quizzes.error = null;
    },
    [fetchQuizzes.fulfilled]: (quizzes, action) => {
      quizzes.quizzes =
        quizzes.sortBy === action.payload.sortedBy &&
        quizzes.filter === action.payload.filter
          ? quizzes.quizzes.concat(action.payload.quizzes)
          : action.payload.quizzes;
      quizzes.moreQuizzes = action.payload.moreQuizzes;
      quizzes.sortBy = action.payload.sortedBy;
      quizzes.filter = action.payload.filter;
      quizzes.loading = false;
      quizzes.failedToLoad = false;
      quizzes.finishedLoading = true;
      quizzes.error = null;
    },
    [fetchQuizzes.rejected]: (quizzes, action) => {
      quizzes.loading = false;
      quizzes.failedToLoad = true;
      quizzes.finishedLoading = false;
      quizzes.error = action.payload ? action.payload : action.error.message;
    },
    [likeQuiz.pending]: (quizzes) => {
      quizzes.loading = true;
    },
    [likeQuiz.fulfilled]: (quizzes, action) => {
      let quizIndex = quizzes.quizzes.findIndex(
        (quiz) => quiz.quizId === action.payload.quizId
      );
      quizzes.quizzes[quizIndex].likes++;
      quizzes.quizzes[quizIndex].liked = true;
      quizzes.loading = false;
      quizzes.error = null;
    },
    [likeQuiz.rejected]: (quizzes, action) => {
      quizzes.loading = false;
      quizzes.failedToLoad = true;
      quizzes.error = action.payload ? action.payload : action.error.message;
    },
    [unlikeQuiz.pending]: (quizzes) => {
      quizzes.loading = true;
    },
    [unlikeQuiz.fulfilled]: (quizzes, action) => {
      let quizIndex = quizzes.quizzes.findIndex(
        (quiz) => quiz.quizId === action.payload.quizId
      );
      quizzes.quizzes[quizIndex].likes--;
      quizzes.quizzes[quizIndex].liked = false;
      quizzes.loading = false;
      quizzes.failedToLoad = false;
      quizzes.error = null;
    },
    [unlikeQuiz.rejected]: (quizzes, action) => {
      quizzes.loading = false;
      quizzes.failedToLoad = true;
      quizzes.error = action.payload ? action.payload : action.error.message;
    },
    [saveQuiz.pending]: (quizzes) => {
      quizzes.loading = true;
    },
    [saveQuiz.fulfilled]: (quizzes, action) => {
      quizzes.loading = false;
      quizzes.failedToLoad = false;
      quizzes.error = null;
      quizzes.quizzes[
        quizzes.quizzes.findIndex(
          (quiz) => quiz.quizId === action.payload.quizId
        )
      ].saved = true;
    },
    [saveQuiz.rejected]: (quizzes, action) => {
      quizzes.loading = false;
      quizzes.failedToLoad = true;
      quizzes.error = action.payload ? action.payload : action.error.message;
    },
    [unsaveQuiz.pending]: (quizzes) => {
      quizzes.loading = true;
    },
    [unsaveQuiz.fulfilled]: (quizzes, action) => {
      quizzes.loading = false;
      quizzes.failedToLoad = false;
      quizzes.error = null;
      quizzes.quizzes[
        quizzes.quizzes.findIndex(
          (quiz) => quiz.quizId === action.payload.quizId
        )
      ].saved = false;
    },
    [unsaveQuiz.rejected]: (quizzes, action) => {
      quizzes.loading = false;
      quizzes.failedToLoad = true;
      quizzes.error = action.payload ? action.payload : action.error.message;
    },
  },
});

export const { setLikedAndSaved } = quizzesSlice.actions;

export const selectQuizzes = (state) => state.quizzes;

export default quizzesSlice.reducer;
