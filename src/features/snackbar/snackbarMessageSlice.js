import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  message: "",
  severity: "",
};

const snackbarMessageSlice = createSlice({
  name: "snackbarMessage",
  initialState: initialState,
  reducers: {
    showSnackbarMessage(snackbarMessage) {
      snackbarMessage.open = true;
    },
    hideSnackbarMessage(snackbarMessage) {
      snackbarMessage.open = false;
    },
    setSnackbarMessageContent(snackbarMessage, action) {
      snackbarMessage.message = action.payload;
    },
    setSnackbarMessageSeverity(snackbarMessage, action) {
      snackbarMessage.severity = action.payload;
    },
  },
});

export const selectSnackbarMessage = (state) => state.snackbarMessage;

export const {
  showSnackbarMessage,
  hideSnackbarMessage,
  setSnackbarMessageContent,
  setSnackbarMessageSeverity,
} = snackbarMessageSlice.actions;

export default snackbarMessageSlice.reducer;
