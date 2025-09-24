import React, {
  useEffect,
  lazy,
  Suspense,
  useMemo,
  useCallback,
  startTransition,
} from "react";
import { Box, Pagination, Container, useTheme } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/postSlice";
import PostCardSkeleton from "../components/skeletons/PostCardSkeleton";
import HomeSlider from "../components/HomeSlider"; // Lazy loading kaldırıldı

// Lazy loading ile bileşenleri yükle
const PostCard = lazy(() => import("../components/PostCard"));
const Sidebar = lazy(() => import("../components/sidebar/Sidebar"));

const POSTS_PER_PAGE = 6;

const Home = () => {
  const { pageNumber } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const page = parseInt(pageNumber) || 1;

  const { posts, totalPages, loading, error } = useSelector(
    (state) => state.posts
  );

  useEffect(() => {
    startTransition(() => {
      dispatch(fetchPosts({ page, limit: POSTS_PER_PAGE }));
    });
  }, [dispatch, page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Memoized pagination handler
  const handleChange = useCallback(
    (event, value) => {
      startTransition(() => {
        navigate(value === 1 ? "/" : `/page/${value}`);
      });
    },
    [navigate]
  );

  // Memoized pagination styles
  const paginationStyles = useMemo(
    () => ({
      "& .MuiPaginationItem-root": {
        fontWeight: 600,
        borderRadius: "50%",
        width: 48,
        height: 48,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.08)",
        color: theme.palette.text.primary,
        border: "none",
        transition: "all 0.2s ease",
        "&.Mui-selected": {
          backgroundColor: "#000000",
          color: "white",
          "&:hover": {
            backgroundColor: "#333333",
          },
        },
        "&:hover": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.15)"
              : "rgba(0,0,0,0.12)",
        },
        "&.MuiPaginationItem-ellipsis": {
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "transparent",
          },
        },
      },
    }),
    [theme.palette.mode, theme.palette.text.primary]
  );

  // Memoized styles
  const containerStyles = useMemo(() => ({ mt: 4 }), []);

  const mainBoxStyles = useMemo(
    () => ({
      display: "flex",
      gap: 4,
      flexDirection: { xs: "column", md: "row" },
    }),
    []
  );

  const contentBoxStyles = useMemo(() => ({ flex: 3 }), []);

  const sidebarBoxStyles = useMemo(() => ({ flex: 1 }), []);

  const postsGridStyles = useMemo(
    () => ({
      display: "flex",
      flexWrap: "wrap",
      gap: 3,
    }),
    []
  );

  const postItemStyles = useMemo(
    () => ({
      flex: "1 1 calc(33.333% - 20px)",
      minWidth: "250px",
    }),
    []
  );

  return (
    <Container maxWidth="lg" sx={containerStyles}>
      {/* HomeSlider direkt render - Layout shift yok */}
      <HomeSlider />

      <Box sx={mainBoxStyles}>
        {/* Ana içerik */}
        <Box sx={contentBoxStyles}>
          {loading ? (
            <>
              <Box sx={postsGridStyles}>
                {Array.from({ length: POSTS_PER_PAGE }).map((_, i) => (
                  <Box key={i} sx={postItemStyles}>
                    <PostCardSkeleton />
                  </Box>
                ))}
              </Box>
              <Box sx={{ mt: 4, height: 40 }} />
            </>
          ) : error ? (
            <Box sx={{ textAlign: "center", mt: 6 }}>
              <p>Hata: {error}</p>
            </Box>
          ) : (
            <>
              <Box sx={postsGridStyles}>
                {posts.map((post, index) => (
                  <Box key={post._id} sx={postItemStyles}>
                    <Suspense fallback={<PostCardSkeleton />}>
                      <PostCard
                        post={post}
                        priority={index < 3}
                        index={index}
                      />
                    </Suspense>
                  </Box>
                ))}
              </Box>

              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handleChange}
                    size="large"
                    sx={paginationStyles}
                  />
                </Box>
              )}
            </>
          )}
        </Box>

        {/* Sidebar */}
        <Box sx={sidebarBoxStyles}>
          <Suspense fallback={<Box sx={{ height: 100 }} />}>
            <Sidebar />
          </Suspense>
        </Box>
      </Box>
    </Container>
  );
};

export default React.memo(Home);
