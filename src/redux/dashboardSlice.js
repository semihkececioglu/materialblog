import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Admin dashboard istatistikleri
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async () => {
    const res = await axios.get(
      "https://materialblog-server-production.up.railway.app/api/dashboard"
    );
    return res.data;
  }
);

// Son 5 yorumu getir
export const fetchLatestComments = createAsyncThunk(
  "dashboard/fetchLatestComments",
  async () => {
    const res = await axios.get(
      "https://materialblog-server-production.up.railway.app/api/comments/latest"
    );
    return res.data;
  }
);

// Son 5 yazıyı getir
export const fetchLatestPosts = createAsyncThunk(
  "dashboard/fetchLatestPosts",
  async () => {
    const res = await axios.get(
      "https://materialblog-server-production.up.railway.app/api/posts/latest"
    );
    return res.data;
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: null,
    latestComments: [],
    latestPosts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // İstatistikler
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Son 5 yorum
      .addCase(fetchLatestComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestComments.fulfilled, (state, action) => {
        state.loading = false;
        state.latestComments = action.payload;
      })
      .addCase(fetchLatestComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Son 5 yazı
      .addCase(fetchLatestPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.latestPosts = action.payload;
      })
      .addCase(fetchLatestPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dashboardSlice.reducer;
