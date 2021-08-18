import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserDetails } from "./userAPI";

const initialState = {
  firstName: "",
  lastName: "",
  username: "",
  country: "",
  email: "",
  createdAt: "",
  likedQuizIds: [],
  savedQuizIds: [],
  loading: true,
  failedToLoad: false,
  finishedLoading: false,
  error: null,
};

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUserDetails();
      return response;
    } catch (err) {
      if (err.response.status === 403) {
        return rejectWithValue("invalid token");
      } else {
        throw err;
      }
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    logOut: (user) => {
      return initialState;
    },
  },
  extraReducers: {
    [fetchUser.pending]: (user) => {
      user.loading = true;
      user.finishedLoading = false;
      user.error = null;
    },
    [fetchUser.fulfilled]: (user, action) => {
      return {
        ...action.payload,
        loading: false,
        failedToLoad: false,
        finishedLoading: true,
        error: null,
      };
    },
    [fetchUser.rejected]: (user, action) => {
      user.loading = false;
      user.failedToLoad = true;
      user.finishedLoading = false;
      user.error = action.payload ? action.payload : action.error.message;
    },
  },
});

export const { logOut } = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
