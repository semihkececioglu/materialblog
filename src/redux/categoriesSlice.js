// redux/categoriesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://materialblog-server-production.up.railway.app/api";

// 🔄 Tüm kategorileri çek
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const res = await axios.get(`${BASE_URL}/categories`);
    return res.data;
  }
);

// ➕ Yeni kategori oluştur
export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (newCategory) => {
    const res = await axios.post(`${BASE_URL}/categories`, newCategory);
    return res.data;
  }
);

// 📝 Kategori güncelle
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, updatedData }) => {
    const res = await axios.put(`${BASE_URL}/categories/${id}`, updatedData);
    return res.data;
  }
);

// ❌ Kategori sil
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id) => {
    await axios.delete(`${BASE_URL}/categories/${id}`);
    return id;
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // Update
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);
      });
  },
});

export default categoriesSlice.reducer;
