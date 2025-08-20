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

/* ===========================
   Google Analytics Endpoints
   =========================== */
const GA = `${BASE}/analytics`;

// Overview (aktif kullanıcı + pageviews)
export const fetchGaOverview = createAsyncThunk(
  "dashboard/fetchGaOverview",
  async ({ startDate = "7daysAgo", endDate = "today" } = {}) => {
    const { data } = await axios.get(`${GA}/overview`, {
      params: { startDate, endDate },
    });
    return data;
  }
);

// Timeseries (grafik)
export const fetchGaTimeseries = createAsyncThunk(
  "dashboard/fetchGaTimeseries",
  async ({ startDate = "7daysAgo", endDate = "today" } = {}) => {
    const { data } = await axios.get(`${GA}/timeseries`, {
      params: { startDate, endDate },
    });
    return data;
  }
);

// Top pages (en çok görüntülenen sayfalar)
export const fetchGaTopPages = createAsyncThunk(
  "dashboard/fetchGaTopPages",
  async ({ startDate = "30daysAgo", endDate = "today", limit = 10 } = {}) => {
    const { data } = await axios.get(`${GA}/top-pages`, {
      params: { startDate, endDate, limit },
    });
    return data;
  }
);

/* =========== 
   Slice State
   =========== */
const initialState = {
  stats: null,
  latestComments: [],
  latestPosts: [],
  gaOverview: null,
  gaTimeseries: null,
  gaTopPages: null,
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

    /* ---- GA Overview ---- */
    b.addCase(fetchGaOverview.pending, (s) => {
      s.loading = true;
    });
    b.addCase(fetchGaOverview.fulfilled, (s, { payload }) => {
      s.loading = false;
      s.gaOverview = payload;
    });
    b.addCase(fetchGaOverview.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error?.message || "GA overview alınamadı";
    });

    /* ---- GA Timeseries ---- */
    b.addCase(fetchGaTimeseries.fulfilled, (s, { payload }) => {
      s.gaTimeseries = payload;
    });

    /* ---- GA Top Pages ---- */
    b.addCase(fetchGaTopPages.fulfilled, (s, { payload }) => {
      s.gaTopPages = payload;
    });
  },
});

export default dashboardSlice.reducer;

/* Selectors */
export const selectDashboardStats = (s) => s.dashboard.stats;
export const selectLatestComments = (s) => s.dashboard.latestComments;
export const selectLatestPosts = (s) => s.dashboard.latestPosts;

export const selectGaOverview = (s) => s.dashboard.gaOverview;
export const selectGaTimeseries = (s) => s.dashboard.gaTimeseries;
export const selectGaTopPages = (s) => s.dashboard.gaTopPages;

export const selectDashboardLoading = (s) => s.dashboard.loading;
export const selectDashboardError = (s) => s.dashboard.error;
