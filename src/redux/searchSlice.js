import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async ({ searchTerm, page = 1, limit = 6 }) => {
    const res = await axios.get(
      `https://materialblog-server-production.up.railway.app/api/posts?search=${searchTerm}&page=${page}&limit=${limit}`
    );
    return res.data;
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchTerm: "",
    results: [],
    page: 1,
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.posts;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSearchTerm, setPage } = searchSlice.actions;
export default searchSlice.reducer;
