import { createSlice } from "@reduxjs/toolkit";

// Güvenli şekilde kullanıcıyı localStorage'dan al
let parsedUser = null;
try {
  const rawUser = localStorage.getItem("user");
  parsedUser = rawUser ? JSON.parse(rawUser) : null;
} catch (error) {
  parsedUser = null;
}

const token = localStorage.getItem("token") || null;

const initialState = {
  currentUser: parsedUser,
  token: token,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
