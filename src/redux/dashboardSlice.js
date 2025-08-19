import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

/* ===========================
   EXISTING DASHBOARD ENDPOINTS
   =========================== */
const BASE = "https://materialblog-server-production.up.railway.app/api";

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async () => {
    const { data } = await axios.get(`${BASE}/dashboard`);
    return data; // { postsCount, commentsCount, categoriesCount, ... } (örnek)
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
   GA4 ANALYTICS ENDPOINTS
   ==================== */
const ANALYTICS = `${BASE}/analytics`;

export const fetchGaOverview = createAsyncThunk(
  "dashboard/fetchGaOverview",
  async ({ startDate, endDate }) => {
    const { data } = await axios.get(`${ANALYTICS}/overview`, {
      params: { startDate, endDate },
    });
    return data; // raw GA response
  }
);

export const fetchGaTimeseries = createAsyncThunk(
  "dashboard/fetchGaTimeseries",
  async ({ startDate, endDate, metric = "activeUsers" }) => {
    const { data } = await axios.get(`${ANALYTICS}/timeseries`, {
      params: { startDate, endDate, metric },
    });
    return data; // raw GA response
  }
);

export const fetchGaTopPages = createAsyncThunk(
  "dashboard/fetchGaTopPages",
  async ({ startDate, endDate, limit = 10 }) => {
    const { data } = await axios.get(`${ANALYTICS}/top-pages`, {
      params: { startDate, endDate, limit },
    });
    return data; // raw GA response
  }
);

/* ===========
   SLICE STATE
   =========== */
const initialState = {
  // Mevcut backend istatistikleri
  stats: null,
  latestComments: [],
  latestPosts: [],
  loading: false, // mevcut dashboard istekleri için
  error: null,

  // GA verileri
  gaLoading: false, // GA istekleri için ayrı loading
  gaError: null,
  gaOverview: null, // overview raw response
  gaSeries: [], // [{ date: "YYYYMMDD", value: number }]
  gaTopPages: [], // [{ path, title, views }]
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    /* ---- Mevcut: İstatistikler ---- */
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

    /* ---- Mevcut: Son 5 yorum ---- */
    b.addCase(fetchLatestComments.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchLatestComments.fulfilled, (s, { payload }) => {
      s.loading = false;
      s.latestComments = payload || [];
    });
    b.addCase(fetchLatestComments.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error?.message || "Son yorumlar alınamadı";
    });

    /* ---- Mevcut: Son 5 yazı ---- */
    b.addCase(fetchLatestPosts.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchLatestPosts.fulfilled, (s, { payload }) => {
      s.loading = false;
      s.latestPosts = payload || [];
    });
    b.addCase(fetchLatestPosts.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error?.message || "Son yazılar alınamadı";
    });

    /* ---- GA: Overview ---- */
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

    /* ---- GA: Timeseries ---- */
    b.addCase(fetchGaTimeseries.pending, (s) => {
      s.gaLoading = true;
      s.gaError = null;
    });
    b.addCase(fetchGaTimeseries.fulfilled, (s, { payload }) => {
      s.gaLoading = false;
      const rows = payload?.rows || [];
      s.gaSeries = rows.map((r) => ({
        date: r.dimensionValues?.[0]?.value || "", // YYYYMMDD
        value: Number(r.metricValues?.[0]?.value || 0),
      }));
    });
    b.addCase(fetchGaTimeseries.rejected, (s, a) => {
      s.gaLoading = false;
      s.gaError = a.error?.message || "GA timeseries alınamadı";
    });

    /* ---- GA: Top Pages ---- */
    b.addCase(fetchGaTopPages.pending, (s) => {
      s.gaLoading = true;
      s.gaError = null;
    });
    b.addCase(fetchGaTopPages.fulfilled, (s, { payload }) => {
      s.gaLoading = false;
      const rows = payload?.rows || [];
      s.gaTopPages = rows.map((r) => ({
        path: r.dimensionValues?.[0]?.value || "",
        title: r.dimensionValues?.[1]?.value || "",
        views: Number(r.metricValues?.[0]?.value || 0),
      }));
    });
    b.addCase(fetchGaTopPages.rejected, (s, a) => {
      s.gaLoading = false;
      s.gaError = a.error?.message || "GA top pages alınamadı";
    });
  },
});

export default dashboardSlice.reducer;

/* (Opsiyonel) Seçiciler */
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
