// redux/commentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://materialblog-server-production.up.railway.app/api";

// Yorumları getir
export const fetchComments = createAsyncThunk(
  "comments/fetch",
  async (postId) => {
    const url = postId
      ? `${BASE_URL}/comments?postId=${postId}`
      : `${BASE_URL}/comments`; // Tüm yorumları getir
    const res = await axios.get(url);
    return res.data;
  }
);

// Yorum ekle
export const addComment = createAsyncThunk(
  "comments/add",
  async (commentData) => {
    const res = await axios.post(`${BASE_URL}/comments`, commentData);
    return res.data;
  }
);

// Yorum sil
export const deleteComment = createAsyncThunk("comments/delete", async (id) => {
  await axios.delete(`${BASE_URL}/comments/${id}`);
  return id;
});

// Yorum beğen/vazgeç
export const toggleLikeComment = createAsyncThunk(
  "comments/toggleLike",
  async ({ commentId, username }) => {
    const res = await axios.put(`${BASE_URL}/comments/${commentId}/like`, {
      username,
    });
    return res.data;
  }
);

// Yorum düzenle
export const editComment = createAsyncThunk(
  "comments/editComment",
  async ({ id, text }) => {
    const res = await axios.put(`${BASE_URL}/comments/${id}`, { text });
    return res.data;
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // POST
      .addCase(addComment.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // DELETE
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);
      })

      // LIKE
      .addCase(toggleLikeComment.fulfilled, (state, action) => {
        const { commentId, likes } = action.meta.arg;
        const index = state.items.findIndex((c) => c._id === commentId);
        if (index !== -1) {
          state.items[index].likes = action.payload.likes;
        }
      })

      // EDIT
      .addCase(editComment.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default commentSlice.reducer;
