import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  mode: '',
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  isPasswordUpdated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setupAuthentication: (state, action) => {
      state = { ...state, ...action.payload };
      return state;
    },
    revokeAuth: (state) => {
      state = initialState;
      return state;
    },
  },
});

export const { setupAuthentication, revokeAuth } = authSlice.actions;
export default authSlice.reducer;
