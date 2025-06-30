import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE =
  "https://materialblog-server-production.up.railway.app/api/settings";

// Verileri çek
export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async () => {
    const res = await axios.get(API_BASE);
    return res.data;
  }
);

// Verileri güncelle
export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (updatedData) => {
    const res = await axios.put(API_BASE, updatedData);
    return res.data;
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    data: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
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
        state.error = action.error.message;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.data = action.payload;
        state.success = true;
      });
  },
});

export const { clearSuccess } = settingsSlice.actions;
export default settingsSlice.reducer;
