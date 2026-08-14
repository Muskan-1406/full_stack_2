import { createSlice } from "@reduxjs/toolkit";

const generateToken = (user) => {
  const header = btoa(
    JSON.stringify({
      alg: "HS256",
      typ: "JWT",
    })
  );

  const payload = btoa(
    JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + 60 * 60 * 1000,
    })
  );

  const signature = btoa("demo-signature");

  return `${header}.${payload}.${signature}`;
};

const savedToken = localStorage.getItem("token");
const savedUser = localStorage.getItem("user");

const initialState = {
  token: savedToken || null,
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: !!savedToken,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload;

      if (
        email === "admin@gmail.com" &&
        password === "12345"
      ) {
        const user = {
          id: 101,
          email: email,
          role: "student",
        };

        const token = generateToken(user);

        state.token = token;
        state.user = user;
        state.isAuthenticated = true;

        localStorage.setItem("token", token);
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;