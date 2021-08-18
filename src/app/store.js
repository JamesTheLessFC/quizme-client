import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "../features/user/userSlice";
import quizzesReducer from "../features/quizzes/QuizzesSlice";
import quizReducer from "../features/Quiz/quizSlice";
import snackbarMessageReducer from "../features/snackbar/snackbarMessageSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["snackbarMessage"],
  blacklist: ["quiz", "quizzes", "user"],
};

const rootReducer = combineReducers({
  user: userReducer,
  quizzes: quizzesReducer,
  quiz: quizReducer,
  snackbarMessage: snackbarMessageReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

//export const store = createStore(persistedReducer);

export const persistor = persistStore(store);

// export const store = configureStore({
//   reducer: {
//     user: userReducer,
//     quizzes: quizzesReducer,
//     quiz: quizReducer,
//     snackbarMessage: snackbarMessageReducer,
//   }
// });
