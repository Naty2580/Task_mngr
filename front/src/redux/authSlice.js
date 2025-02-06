import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../util/axiosInstance";
import logger from "../util/logger.js"

// Load token from localStorage
const token = localStorage.getItem("accessToken");
const storedUser = JSON.parse(localStorage.getItem("user")) || {};

export const loginUser = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {

    const response = await api.post("/auth/login", credentials);

    localStorage.setItem("accessToken", response.data.accessToken || "");
    localStorage.setItem("refreshToken", response.data.refreshToken || "");
    localStorage.setItem("user", JSON.stringify(response.data.user));
    logger.info("user logged in", response.data);
    return response.data;

  } catch (error) {
    if (error.response) {
      logger.info("error logining in user", error.response.data);
      console.error("Error response data:", error.response.data);
    return rejectWithValue(error.response.data) || "something went wrong";
  }}
});

export const register = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/register", userData);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    logger.info("user registered", response.data);
    return response.data;
  } catch (error) {
    logger.info("error registering user", error.response.data);
    return rejectWithValue(error.response.data);
  }
}
);


export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("accessToken") || getState().auth.accessToken;
      if (!token) return rejectWithValue("No token found");

      const response = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      logger.info("user fetched", response.data);
      return response.data; // User object
    } catch (error) {
      logger.info("error fetching user", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:  storedUser,
    isAdmin: storedUser?.role === "admin" || false,
    isAuthenticated: token ? true : false,
    isError: false,
    isLoading: false,
    isSuccess: false,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAdmin = false;
      state.isAuthenticated = false;
      state.error = null;
      state.status = "idle";
      state.isSuccess = false;
      state.isLoading = false;
      state.isError = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAdmin = action.payload.user.role === "admin";
        state.status = "succeeded";
        state.isLoading = false;
        state.isAuthenticated = true;
        state.isSuccess = true;
        state.error = null;
        state.isError = false;

      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
        state.isError = false;
        state.status = "loading";
      })
     
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        state.isLoading = false;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong";
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.isAuthenticated = false
        state.status = "failed";
        state.user = null;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.status = "succeeded";
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
