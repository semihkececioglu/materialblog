import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import interactionReducer from "./interactionSlice";
import postReducer from "./postSlice";
import commentReducer from "./commentSlice";
import categoriesReducer from "./categoriesSlice";
import tagReducer from "./tagSlice";
import settingsReducer from "./settingsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    interaction: interactionReducer,
    posts: postReducer,
    comments: commentReducer,
    categories: categoriesReducer,
    tags: tagReducer,
    settings: settingsReducer,
  },
});

export default store;
