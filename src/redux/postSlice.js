import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  "https://materialblog-server-production.up.railway.app/api/posts";

//  Listeleme (filtre, arama, kategori, tag, sayfa)
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ page = 1, limit = 6, search = "", category = "", tag = "" }) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (tag) params.append("tag", tag);

    const res = await axios.get(`${BASE_URL}?${params.toString()}`);
    return res.data;
  }
);

//  Slug ile detay çek
export const fetchPostBySlug = createAsyncThunk(
  "posts/fetchPostBySlug",
  async (slug) => {
    const res = await axios.get(`${BASE_URL}/slug/${slug}`);
    return res.data;
  }
);

//  ID ile detay çek (admin)
export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (id) => {
    const res = await axios.get(`${BASE_URL}/${id}`);
    return res.data;
  }
);

//  Yeni yazı oluştur
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (newPost) => {
    const res = await axios.post(BASE_URL, newPost);
    return res.data;
  }
);

//  Yazı güncelle
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, updatedPost }) => {
    const res = await axios.put(`${BASE_URL}/${id}`, updatedPost);
    return res.data;
  }
);

//  Yazı sil
export const deletePost = createAsyncThunk("posts/deletePost", async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
  return id; // sadece ID dönüyoruz
});

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    selectedPost: null,
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //  Listeleme
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //  Slug ile detay
      .addCase(fetchPostBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPost = action.payload;
      })
      .addCase(fetchPostBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //  ID ile detay
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //  Yeni oluşturma
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //  Güncelleme
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        state.selectedPost = action.payload;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //  Silme
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSelectedPost } = postSlice.actions;
export default postSlice.reducer;
