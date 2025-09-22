import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Pagination,
  Skeleton,
  Stack,
  Grid,
  Badge,
  Card,
  CardContent,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PostCard from "../components/PostCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/postSlice";
import axios from "axios";
import { BASE_URL } from "../config";

const POSTS_PER_PAGE = 6;

// PostCard Skeleton Component
const PostCardSkeleton = () => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (t) => `1px solid ${alpha(t.palette.divider, 0.1)}`,
      bgcolor: (t) => alpha(t.palette.background.paper, 0.8),
      backdropFilter: "blur(12px)",
      overflow: "hidden",
      height: "100%",
    }}
  >
    {/* Image Skeleton */}
    <Skeleton
      variant="rectangular"
      width="100%"
      height={200}
      sx={{ borderRadius: 0 }}
    />

    <CardContent sx={{ p: 3 }}>
      {/* Category Skeleton */}
      <Skeleton
        variant="rectangular"
        width={80}
        height={20}
        sx={{ borderRadius: 1, mb: 2 }}
      />

      {/* Title Skeleton */}
      <Skeleton variant="text" width="100%" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="80%" height={32} sx={{ mb: 2 }} />

      {/* Excerpt Skeleton */}
      <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" height={20} sx={{ mb: 3 }} />

      {/* Footer */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {/* Date */}
        <Skeleton variant="text" width={100} height={16} />

        {/* Tags */}
        <Stack direction="row" spacing={1}>
          <Skeleton
            variant="rectangular"
            width={40}
            height={18}
            sx={{ borderRadius: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={50}
            height={18}
            sx={{ borderRadius: 1 }}
          />
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

function TagPosts() {
  const { tag, pageNumber } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const page = parseInt(pageNumber) || 1;
  const [tagInfo, setTagInfo] = useState(null);
  const [tagLoading, setTagLoading] = useState(true);

  const { posts, totalPages, loading } = useSelector((state) => state.posts);

  // Tag bilgilerini çek
  useEffect(() => {
    const fetchTagInfo = async () => {
      try {
        setTagLoading(true);
        const response = await axios.get(
          `${BASE_URL}/api/tags/info/${encodeURIComponent(tag)}`
        );
        setTagInfo(response.data);
      } catch (error) {
        console.error("Tag bilgisi alınamadı:", error);
        setTagInfo({
          name: decodeURIComponent(tag),
          count: 0,
        });
      } finally {
        setTagLoading(false);
      }
    };

    fetchTagInfo();
  }, [tag]);

  // Posts çek
  useEffect(() => {
    dispatch(
      fetchPosts({
        tag: decodeURIComponent(tag),
        page,
        limit: POSTS_PER_PAGE,
      })
    );
  }, [dispatch, tag, page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handlePageChange = (event, value) => {
    const url = value === 1 ? `/tag/${tag}` : `/tag/${tag}/page/${value}`;
    navigate(url);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          {/* Icon ve Badge */}
          <Badge
            badgeContent={tagLoading ? 0 : tagInfo?.count || 0}
            sx={{
              "& .MuiBadge-badge": {
                bgcolor: "primary.main",
                color: "white",
                fontWeight: 700,
                fontSize: "0.75rem",
                minWidth: 20,
                height: 20,
                borderRadius: 2,
                border: (t) => `2px solid ${t.palette.background.default}`,
                boxShadow: (t) =>
                  `0 2px 8px ${alpha(t.palette.primary.main, 0.3)}`,
                opacity: tagLoading ? 0.3 : 1,
              },
            }}
          >
            <LocalOfferIcon
              sx={{
                color: "primary.main",
                fontSize: 28,
                opacity: tagLoading ? 0.3 : 1,
              }}
            />
          </Badge>

          {/* Başlık */}
          {tagLoading ? (
            <Skeleton variant="text" width={250} height={48} />
          ) : (
            <Typography
              variant="h3"
              fontWeight={700}
              sx={{
                color: "text.primary",
                fontSize: { xs: "1.75rem", md: "2.25rem" },
              }}
            >
              #{tagInfo?.name || decodeURIComponent(tag)}
            </Typography>
          )}
        </Stack>
      </Box>

      {/* İçerik */}
      {loading ? (
        <>
          {/* Loading Skeletons */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {Array.from({ length: POSTS_PER_PAGE }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  flex: "1 1 calc(33.333% - 20px)",
                  minWidth: "280px",
                }}
              >
                <PostCardSkeleton />
              </Box>
            ))}
          </Box>

          {/* Pagination Skeleton */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="circular"
                  width={40}
                  height={40}
                />
              ))}
            </Stack>
          </Box>
        </>
      ) : posts.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
          }}
        >
          <LocalOfferIcon
            sx={{
              fontSize: 64,
              color: "text.disabled",
              mb: 2,
            }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Bu etikete ait yazı bulunamadı
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Henüz bu etiketle yayınlanmış bir yazı bulunmuyor.
          </Typography>
        </Box>
      ) : (
        <>
          {/* Yazılar - Mevcut düzen */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {posts.map((post) => (
              <Box
                key={post._id}
                sx={{
                  flex: "1 1 calc(33.333% - 20px)",
                  minWidth: "280px",
                }}
              >
                <PostCard post={post} />
              </Box>
            ))}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="medium"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default TagPosts;
