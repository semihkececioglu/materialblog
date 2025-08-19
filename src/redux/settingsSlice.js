import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE =
  "https://materialblog-server-production.up.railway.app/api/settings";

/* =====================
   Thunks
   ===================== */
export const fetchSettings = createAsyncThunk("settings/fetch", async () => {
  const { data } = await axios.get(BASE);
  return data;
});

export const updateSettings = createAsyncThunk(
  "settings/update",
  async (settings) => {
    const { data } = await axios.put(BASE, settings);
    return data;
  }
);

/* =========== 
   Slice State
   =========== */
const initialState = {
  settings: null,
  loading: false,
  error: null,
  success: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    clearSuccess: (s) => {
      s.success = false;
    },
  },
  extraReducers: (b) => {
    /* ---- Fetch ---- */
    b.addCase(fetchSettings.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchSettings.fulfilled, (s, { payload }) => {
      s.loading = false;
      s.settings = payload;
    });
    b.addCase(fetchSettings.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error?.message || "Ayarlar alınamadı";
    });

    /* ---- Update ---- */
    b.addCase(updateSettings.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(updateSettings.fulfilled, (s, { payload }) => {
      s.loading = false;
      s.settings = payload;
      s.success = true;
    });
    b.addCase(updateSettings.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error?.message || "Ayarlar güncellenemedi";
    });
  },
});

export const { clearSuccess } = settingsSlice.actions;

export default settingsSlice.reducer;

/* Selectors */
export const selectSettings = (s) => s.settings.settings;
export const selectSettingsLoading = (s) => s.settings.loading;
export const selectSettingsError = (s) => s.settings.error;
export const selectSettingsSuccess = (s) => s.settings.success;
