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

/* ====================
   GA4 Analytics Endpoints
   ==================== */
const ANALYTICS = `${BASE}/analytics`;

export const fetchGaOverview = createAsyncThunk(
  "dashboard/fetchGaOverview",
  async ({ startDate, endDate }) => {
    const { data } = await axios.get(`${ANALYTICS}/overview`, {
      params: { startDate, endDate },
    });
    return data?.rows || [];
  }
);

export const fetchGaTimeseries = createAsyncThunk(
  "dashboard/fetchGaTimeseries",
  async ({ startDate, endDate, metric = "activeUsers" }) => {
    const { data } = await axios.get(`${ANALYTICS}/timeseries`, {
      params: { startDate, endDate, metric },
    });
    return data || [];
  }
);

export const fetchGaTopPages = createAsyncThunk(
  "dashboard/fetchGaTopPages",
  async ({ startDate, endDate, limit = 10 }) => {
    const { data } = await axios.get(`${ANALYTICS}/top-pages`, {
      params: { startDate, endDate, limit },
    });
    return data || [];
  }
);

/* =========== 
   Slice State
   =========== */
const initialState = {
  // Dashboard verileri
  stats: null,
  latestComments: [],
  latestPosts: [],
  loading: false,
  error: null,

  // GA verileri
  gaLoading: false,
  gaError: null,
  gaOverview: [],
  gaSeries: [],
  gaTopPages: [],
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
      s.gaLoading = true;
      s.gaError = null;
    });
    b.addCase(fetchGaOverview.fulfilled, (s, { payload }) => {
      s.gaLoading = false;
      s.gaOverview = payload;
    });
    b.addCase(fetchGaOverview.rejected, (s, a) => {
      s.gaLoading = false;
      s.gaError = a.error?.message || "GA overview alınamadı";
    });

    /* ---- GA Timeseries ---- */
    b.addCase(fetchGaTimeseries.fulfilled, (s, { payload }) => {
      s.gaLoading = false;
      s.gaSeries = payload;
    });

    /* ---- GA Top Pages ---- */
    b.addCase(fetchGaTopPages.fulfilled, (s, { payload }) => {
      s.gaLoading = false;
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
export const selectGaSeries = (s) => s.dashboard.gaSeries;
export const selectGaTopPages = (s) => s.dashboard.gaTopPages;

export const selectDashboardLoading = (s) =>
  s.dashboard.loading || s.dashboard.gaLoading;
export const selectDashboardError = (s) =>
  s.dashboard.error || s.dashboard.gaError;
