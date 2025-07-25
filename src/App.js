import React, { useEffect, useState, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./theme";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import CategoryPage from "./pages/CategoryPage";
import TagPosts from "./pages/TagPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchResults from "./pages/SearchResults";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import AdminLayout from "./admin/AdminLayout";
import PostsPage from "./admin/AdminPostsPage";
import DashboardPage from "./admin/AdminDashboardPage";
import AdminCategoriesPage from "./admin/AdminCategoriesPage";
import AdminTagsPage from "./admin/AdminTagsPage";
import AdminCommentsPage from "./admin/AdminCommentsPage";
import AdminSettingsPage from "./admin/AdminSettingsPage";
import PostEditorPage from "./admin/AdminPostEditorPage";
import AdminRoute from "./auth/AdminRoute";
import AdminUsersPage from "./admin/AdminUsersPage";
import NotFound from "./pages/NotFound";
import RoleBasedAdminRedirect from "./auth/RoleBasedAdminRedirect";

// Redux
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import { login } from "./redux/userSlice";

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser.id && !parsedUser._id) {
          parsedUser._id = parsedUser.id;
        }

        dispatch(login({ user: parsedUser, token: storedToken }));
      } catch (error) {
        console.error("Local user parse hatası:", error);
      }
    }
  }, [dispatch]);

  return children;
};

function App() {
  const [mode, setMode] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");

  const theme = useMemo(() => getTheme(mode), [mode]);
  const user = useSelector((state) => state.user.currentUser);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthLoader>
            <Routes>
              {/* Genel Kullanıcı Rotaları */}
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
                <Route
                  path="/category/:kategoriAdi"
                  element={<CategoryPage />}
                />
                <Route
                  path="/category/:kategoriAdi/page/:pageNumber"
                  element={<CategoryPage />}
                />
                <Route path="/tag/:tag" element={<TagPosts />} />
                <Route
                  path="/tag/:tag/page/:pageNumber"
                  element={<TagPosts />}
                />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
                <Route
                  path="/profile/:username/edit"
                  element={<EditProfilePage />}
                />
                <Route path="/page/:pageNumber" element={<Home />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin Paneli */}
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<RoleBasedAdminRedirect />} />
                <Route
                  path="dashboard"
                  element={
                    user?.role === "admin" ? (
                      <DashboardPage />
                    ) : (
                      <Navigate to="/admin/posts" replace />
                    )
                  }
                />
                <Route path="posts" element={<PostsPage />} />
                <Route path="posts/edit/:id" element={<PostEditorPage />} />
                <Route path="editor" element={<PostEditorPage />} />
                <Route
                  path="categories"
                  element={
                    user?.role === "admin" ? (
                      <AdminCategoriesPage />
                    ) : (
                      <Navigate to="/admin/posts" replace />
                    )
                  }
                />
                <Route
                  path="tags"
                  element={
                    user?.role === "admin" ? (
                      <AdminTagsPage />
                    ) : (
                      <Navigate to="/admin/posts" replace />
                    )
                  }
                />
                <Route
                  path="comments"
                  element={
                    user?.role === "admin" ? (
                      <AdminCommentsPage />
                    ) : (
                      <Navigate to="/admin/posts" replace />
                    )
                  }
                />
                <Route
                  path="users"
                  element={
                    user?.role === "admin" ? (
                      <AdminUsersPage />
                    ) : (
                      <Navigate to="/admin/posts" replace />
                    )
                  }
                />
                <Route
                  path="settings"
                  element={
                    user?.role === "admin" ? (
                      <AdminSettingsPage />
                    ) : (
                      <Navigate to="/admin/posts" replace />
                    )
                  }
                />
              </Route>
            </Routes>
          </AuthLoader>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
