import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE =
  "https://materialblog-server-production.up.railway.app/api/settings";

// ───────────────────────────────────────────────────────────
// Thunks
// ───────────────────────────────────────────────────────────

// Ayarları getir
export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async () => {
    const { data } = await axios.get(API_BASE);
    return data;
  }
);

// Ayarları güncelle (siteTitle, siteDescription, gaEnabled, gaMeasurementId)
export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (updatedData) => {
    const { data } = await axios.put(API_BASE, updatedData);
    return data;
  }
);

// (İsteğe bağlı) Public GA için sadece GA verisi
export const fetchPublicGA = createAsyncThunk(
  "settings/fetchPublicGA",
  async () => {
    const { data } = await axios.get(`${API_BASE}/public`);
    return data; // { gaEnabled, gaMeasurementId }
  }
);

// ───────────────────────────────────────────────────────────
// Slice
// ───────────────────────────────────────────────────────────

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    data: null,
    loading: false,
    updating: false,
    error: null,
    success: false,
    publicGA: null,
  },
  reducers: {
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fetchSettings
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Ayarlar alınamadı";
      })

      // ── updateSettings
      .addCase(updateSettings.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.updating = false;
        state.data = action.payload;
        state.success = true;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error?.message || "Ayarlar güncellenemedi";
      })

      // ── fetchPublicGA (opsiyonel)
      .addCase(fetchPublicGA.fulfilled, (state, action) => {
        state.publicGA = action.payload; // { gaEnabled, gaMeasurementId }
      });
  },
});

export const { clearSuccess } = settingsSlice.actions;

// İsteğe bağlı yardımcı selector'lar:
export const selectSettings = (state) => state.settings.data;
export const selectSettingsLoading = (state) => state.settings.loading;
export const selectSettingsUpdating = (state) => state.settings.updating;
export const selectSettingsError = (state) => state.settings.error;
export const selectSettingsSuccess = (state) => state.settings.success;
export const selectPublicGA = (state) => state.settings.publicGA;

export default settingsSlice.reducer;
