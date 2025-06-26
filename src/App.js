import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./theme";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import CategoryPage from "./pages/CategoryPage";
import TagPosts from "./pages/TagPosts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchResults from "./pages/SearchResults";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import AdminLayout from "./admin/AdminLayout";
import PostsPage from "./admin/PostsPage";
import DashboardPage from "./admin/DashboardPage";
import AdminCategoriesPage from "./admin/AdminCategoriesPage";
import AdminTagsPage from "./admin/AdminTagsPage";
import AdminCommentsPage from "./admin/AdminCommentsPage";
import AdminSettingsPage from "./admin/AdminSettingsPage";
import PostEditorPage from "./admin/PostEditorPage";
import AdminRoute from "./auth/AdminRoute";
import AdminUsersPage from "./admin/AdminUsersPage";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const [mode, setMode] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Blog Layout */}
            <Route
              element={
                <Layout
                  toggleTheme={() =>
                    setMode(mode === "light" ? "dark" : "light")
                  }
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/post/:slug" element={<PostDetail />} />
              <Route path="/category/:kategoriAdi" element={<CategoryPage />} />
              <Route
                path="/category/:kategoriAdi/page/:pageNumber"
                element={<CategoryPage />}
              />
              <Route path="/tag/:tag" element={<TagPosts />} />
              <Route path="/tag/:tag/page/:pageNumber" element={<TagPosts />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route
                path="/profile/:username/edit"
                element={<EditProfilePage />}
              />
              <Route path="/page/:pageNumber" element={<Home />} />
            </Route>

            {/* Admin Layout */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="posts" element={<PostsPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="tags" element={<AdminTagsPage />} />
              <Route path="comments" element={<AdminCommentsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="editor" element={<PostEditorPage />} />
              <Route path="posts/edit/:id" element={<PostEditorPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
