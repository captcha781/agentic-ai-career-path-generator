import { combineReducers } from "@reduxjs/toolkit";
import auth from "./slices/auth.slice";
import toast from "./slices/toast.slice";

const mainReducer = (asyncReducers) => (state, action) => {
  const combinedReducers = combineReducers({
    auth,
    toast,
    ...asyncReducers,
  });

  return combinedReducers(state, action);
};

export default mainReducer;
