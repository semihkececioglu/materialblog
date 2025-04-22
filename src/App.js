import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./theme";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import CategoryPage from "./pages/CategoryPage";
import posts from "./data";
import TagPosts from "./pages/TagPosts";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchResults from "./pages/SearchResults";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import AdminLayout from "./admin/AdminLayout";
import PostsPage from "./admin/PostsPage";

function App() {
  const [mode, setMode] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");

  const theme = useMemo(() => getTheme(mode), [mode]);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Layout
            toggleTheme={() => setMode(mode === "light" ? "dark" : "light")}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          >
            <Routes>
              <Route path="/" element={<Home posts={filteredPosts} />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/category/:kategoriAdi" element={<CategoryPage />} />
              <Route path="/tag/:tag" element={<TagPosts />} />
              <Route path="/register" element={<Register />} />

              <Route path="/login" element={<Login />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route
                path="/profile/:username/edit"
                element={<EditProfilePage />}
              />
              {/* Admin paneli rotaları */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<div>Dashboard</div>} />
                <Route path="posts" element={<PostsPage />} />
              </Route>
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>

    // deneme
  );
}

export default App;
