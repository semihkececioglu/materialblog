import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE =
  "https://materialblog-server-production.up.railway.app/api/tags";

// Tüm etiketleri getir
export const fetchTags = createAsyncThunk("tags/fetchTags", async () => {
  const response = await axios.get(API_BASE);
  return response.data;
});

// Etiketi sil
export const deleteTag = createAsyncThunk("tags/deleteTag", async (id) => {
  await axios.delete(`${API_BASE}/${id}`);
  return id;
});

const tagSlice = createSlice({
  name: "tags",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.items = state.items.filter((tag) => tag._id !== action.payload);
      });
  },
});

export default tagSlice.reducer;
