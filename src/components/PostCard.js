import React, { useMemo, useCallback } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  useTheme,
  Box,
  IconButton,
  Chip,
  Tooltip,
  Skeleton,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { useNavigate } from "react-router-dom";
import slugify from "../utils/slugify";

/** İçerikten ilk <img> src'sini al */
const getFirstImageFromHTML = (html) => {
  if (!html || typeof html !== "string") return null;
  const match = html.match(/<img[^>]+src=["']([^"'>]+)["']/);
  return match ? match[1] : null;
};

const formatDate = (isoString) => {
  if (!isoString) return "";
  try {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(isoString).toLocaleDateString("tr-TR", options);
  } catch (error) {
    console.warn("Date formatting error:", error);
    return "";
  }
};

/** Cloudinary mi? */
const isCloudinary = (url) =>
  typeof url === "string" &&
  url.includes("res.cloudinary.com") &&
  url.includes("/image/upload/");

/** Cloudinary URL'ine dönüşüm (LCP için optimize) */
const buildCloudinaryUrl = (url, w, quality = "auto:best") => {
  if (!url || !isCloudinary(url)) return url || "";
  return url.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_${quality},dpr_auto,c_fill,g_auto,w_${w},e_unsharp_mask:80/`
  );
};

/** srcset & sizes üretici – LCP için optimize */
const buildResponsive = (url, priority = false) => {
  if (!url) return { src: "", srcSet: undefined, sizes: undefined };
  if (!isCloudinary(url))
    return { src: url, srcSet: undefined, sizes: undefined };

  // Priority images için daha düşük kalite ama hızlı yükleme
  const quality = priority ? "auto:low" : "auto:best";

  const w400 = buildCloudinaryUrl(url, 400, quality);
  const w600 = buildCloudinaryUrl(url, 600, quality);
  const w900 = buildCloudinaryUrl(url, 900, quality);

  return {
    src: w600,
    srcSet: `${w400} 400w, ${w600} 600w, ${w900} 900w`,
    sizes: "(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw",
  };
};

// PostCard Skeleton Component - Same dimensions
const PostCardSkeleton = React.memo(() => {
  const theme = useTheme();

  const skeletonCardStyles = useMemo(
    () => ({
      width: "100%",
      height: 360, // Exact same height as real card
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      borderRadius: 4,
      overflow: "hidden",
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.08)"
          : "rgba(255,255,255,0.4)",
      border: "1px solid rgba(255,255,255,0.15)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      contain: "layout style paint",
    }),
    [theme.palette.mode]
  );

  return (
    <Card sx={skeletonCardStyles}>
      {/* Image Skeleton - Same height */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={140}
        animation="wave"
        sx={{
          bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.200",
        }}
      />

      {/* Content Skeleton */}
      <CardContent sx={{ flexGrow: 1, px: 2, py: 1.5 }}>
        {/* Category Chip Skeleton */}
        <Skeleton
          variant="rounded"
          width={80}
          height={24}
          sx={{ mb: 1, borderRadius: 3 }}
          animation="wave"
        />

        {/* Title Skeleton */}
        <Skeleton
          variant="text"
          width="90%"
          height={22}
          sx={{ mb: 1 }}
          animation="wave"
        />

        {/* Summary Skeleton - 2 lines */}
        <Skeleton
          variant="text"
          width="100%"
          height={16}
          sx={{ mb: 0.5 }}
          animation="wave"
        />
        <Skeleton variant="text" width="75%" height={16} animation="wave" />
      </CardContent>

      {/* Bottom Bar Skeleton - Same layout */}
      <Box
        sx={{
          px: 2,
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 48, // Fixed height for bottom section
        }}
      >
        {/* Date Skeleton */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Skeleton
            variant="circular"
            width={16}
            height={16}
            animation="wave"
          />
          <Skeleton variant="text" width={80} height={12} animation="wave" />
        </Box>

        {/* Action Button Skeleton */}
        <Skeleton
          variant="rounded"
          width={40}
          height={40}
          sx={{ borderRadius: 2 }}
          animation="wave"
        />
      </Box>
    </Card>
  );
});

PostCardSkeleton.displayName = "PostCardSkeleton";

const PostCard = ({ post, priority = false, index = 0, isLoading = false }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Memoize expensive calculations
  const firstImage = useMemo(
    () => getFirstImageFromHTML(post?.content),
    [post?.content]
  );

  const rawImageUrl = useMemo(
    () => post?.image || firstImage,
    [post?.image, firstImage]
  );

  const responsive = useMemo(
    () => buildResponsive(rawImageUrl, priority),
    [rawImageUrl, priority]
  );

  const formattedDate = useMemo(
    () => (post?.date ? formatDate(post.date) : null),
    [post?.date]
  );

  const categoryData = useMemo(
    () => ({
      name:
        typeof post?.category === "object"
          ? post.category?.name || "Kategori"
          : post?.category || "Kategori",
      color:
        typeof post?.category === "object"
          ? post.category?.color || theme.palette.primary.light
          : theme.palette.primary.light,
    }),
    [post?.category, theme.palette.primary.light]
  );

  // Memoized click handlers (must be before any early return)
  const handleClick = useCallback(() => {
    if (post?.title) {
      navigate(`/post/${slugify(post.title)}`);
    }
  }, [navigate, post?.title]);

  const handleIconClick = useCallback(
    (e) => {
      e.stopPropagation();
      handleClick();
    },
    [handleClick]
  );

  // Memoized styles - Fixed height to prevent layout shift
  const cardStyles = useMemo(
    () => ({
      width: "100%",
      height: 360, // Fixed height - prevents layout shift
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      borderRadius: 4,
      cursor: "pointer",
      overflow: "hidden",
      backdropFilter: "blur(16px)",
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.08)"
          : "rgba(255,255,255,0.4)",
      border: "1px solid rgba(255,255,255,0.15)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
      contain: "layout style paint", // Browser'a layout hesaplamalarını optimize et
      willChange: "transform", // GPU acceleration için
      "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
      },
    }),
    [theme.palette.mode]
  );

  const mediaStyles = useMemo(
    () => ({
      height: 140, // Fixed height
      objectFit: "cover",
      transition: "transform 0.3s ease",
      "&:hover": {
        transform: "scale(1.03)",
      },
    }),
    []
  );

  // Image load handler
  const handleImageLoad = useCallback(() => {
    // Image yüklendiğinde preconnect hints ekle
    if (index < 3) {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = "https://res.cloudinary.com";
      if (!document.querySelector(`link[href="${link.href}"]`)) {
        document.head.appendChild(link);
      }
    }
  }, [index]);

  // Loading state için skeleton göster
  if (isLoading || !post) {
    return <PostCardSkeleton />;
  }

  return (
    <Card onClick={handleClick} sx={cardStyles}>
      {rawImageUrl ? (
        <CardMedia
          component="img"
          width={480}
          height={140}
          image={responsive.src}
          srcSet={responsive.srcSet}
          sizes={responsive.sizes}
          alt={post.title || "Blog post image"}
          loading={priority || index < 3 ? "eager" : "lazy"} // İlk 3 görseli hemen yükle
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"} // Modern browsers için
          sx={mediaStyles}
          onLoad={handleImageLoad}
        />
      ) : (
        <Box
          sx={{
            height: 140, // Same fixed height
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.200",
          }}
        >
          <ImageNotSupportedIcon
            sx={{ fontSize: 48, color: theme.palette.text.secondary }}
          />
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1, px: 2, py: 1.5 }}>
        {/* Chip */}
        {post.category && (
          <Chip
            label={categoryData.name}
            size="small"
            sx={{
              mb: 1,
              backgroundColor: categoryData.color,
              color: "#fff", // kontrast için beyaz metin
              fontWeight: 500,
            }}
          />
        )}

        {/* Başlık */}
        <Typography
          variant="h2"
          component="h3"
          fontWeight={600}
          gutterBottom
          sx={{
            fontSize: "1rem",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2, // Max 2 line to prevent height variation
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minHeight: 44, // Fixed minimum height for consistent layout
          }}
        >
          {post.title || "Başlık bulunamadı"}
        </Typography>

        {/* Özet */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2, // Fixed line count
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "0.875rem",
            minHeight: 32, // Fixed minimum height for consistent layout
          }}
        >
          {post.summary ||
            (post.content
              ? post.content.replace(/<[^>]+>/g, "").substring(0, 100) + "..."
              : "")}
        </Typography>
      </CardContent>

      {/* Alt bar */}
      <Box
        sx={{
          px: 2,
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 48, // Fixed height for bottom section
        }}
      >
        {formattedDate && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarMonthIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {formattedDate}
            </Typography>
          </Box>
        )}

        <Tooltip title="Devamını Oku">
          <IconButton
            onClick={handleIconClick}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.getContrastText(theme.palette.primary.main),
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
                boxShadow: "0 0 8px rgba(0,0,0,0.3)",
              },
              borderRadius: 2,
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

// Optimized memo comparison
export default React.memo(PostCard, (prevProps, nextProps) => {
  return (
    prevProps.post?._id === nextProps.post?._id &&
    prevProps.post?.title === nextProps.post?.title &&
    prevProps.post?.image === nextProps.post?.image &&
    prevProps.post?.date === nextProps.post?.date &&
    prevProps.post?.category === nextProps.post?.category &&
    prevProps.isLoading === nextProps.isLoading
  );
});
