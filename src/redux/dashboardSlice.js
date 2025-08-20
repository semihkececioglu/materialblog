import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE = "https://materialblog-server-production.up.railway.app/api";

/* ===========================
   Dashboard Backend Endpoints
   =========================== */
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async () => {
    const { data } = await axios.get(`${BASE}/dashboard`);
    return data; // { postsCount, commentsCount, categoriesCount, ... }
  }
);

export const fetchLatestComments = createAsyncThunk(
  "dashboard/fetchLatestComments",
  async () => {
    const { data } = await axios.get(`${BASE}/comments/latest`);
    return data; // Array(5)
  }
);

export const fetchLatestPosts = createAsyncThunk(
  "dashboard/fetchLatestPosts",
  async () => {
    const { data } = await axios.get(`${BASE}/posts/latest`);
    return data; // Array(5)
  }
);

/* =========== 
   Slice State
   =========== */
const initialState = {
  stats: null,
  latestComments: [],
  latestPosts: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    /* ---- Dashboard Stats ---- */
    b.addCase(fetchDashboardStats.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchDashboardStats.fulfilled, (s, { payload }) => {
      s.loading = false;
      s.stats = payload;
    });
    b.addCase(fetchDashboardStats.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error?.message || "İstatistikler alınamadı";
    });

    /* ---- Latest Comments ---- */
    b.addCase(fetchLatestComments.fulfilled, (s, { payload }) => {
      s.latestComments = payload || [];
    });

    /* ---- Latest Posts ---- */
    b.addCase(fetchLatestPosts.fulfilled, (s, { payload }) => {
      s.latestPosts = payload || [];
    });
  },
});

export default dashboardSlice.reducer;

/* Selectors */
export const selectDashboardStats = (s) => s.dashboard.stats;
export const selectLatestComments = (s) => s.dashboard.latestComments;
export const selectLatestPosts = (s) => s.dashboard.latestPosts;

export const selectDashboardLoading = (s) => s.dashboard.loading;
export const selectDashboardError = (s) => s.dashboard.error;
