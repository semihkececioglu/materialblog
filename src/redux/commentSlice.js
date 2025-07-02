import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  "https://materialblog-server-production.up.railway.app/api/comments";

// Yorumları getir (opsiyonel postId)
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId) => {
    const url = postId ? `${BASE_URL}?postId=${postId}` : BASE_URL;
    const res = await axios.get(url);
    return res.data;
  }
);

// Yeni yorum veya yanıt ekle
export const addComment = createAsyncThunk(
  "comments/addComment",
  async (commentData) => {
    const res = await axios.post(BASE_URL, commentData);
    return res.data;
  }
);

// Yorum sil
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId) => {
    await axios.delete(`${BASE_URL}/${commentId}`);
    return commentId;
  }
);

// Yorum düzenle
export const editComment = createAsyncThunk(
  "comments/editComment",
  async ({ id, text }) => {
    const res = await axios.put(`${BASE_URL}/${id}`, { text });
    return res.data;
  }
);

// Beğeni işlemi
export const toggleLikeComment = createAsyncThunk(
  "comments/toggleLike",
  async ({ commentId, username }) => {
    const res = await axios.put(`${BASE_URL}/${commentId}/like`, { username });
    return { ...res.data, _id: commentId };
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload];
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter(
          (c) => c._id !== id && c.parentId !== id
        );
      })
      .addCase(editComment.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex((c) => c._id === updated._id);
        if (index !== -1) {
          state.items[index].text = updated.text;
        }
      })
      .addCase(toggleLikeComment.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex((c) => c._id === updated._id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...updated };
        }
      });
  },
});

export default commentSlice.reducer;
