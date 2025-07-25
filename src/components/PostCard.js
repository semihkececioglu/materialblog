import React from "react";
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
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { useNavigate } from "react-router-dom";
import slugify from "../utils/slugify";

const getFirstImageFromHTML = (html) => {
  const match = html?.match(/<img[^>]+src=["']([^"'>]+)["']/);
  return match ? match[1] : null;
};

const formatDate = (isoString) => {
  const options = { day: "numeric", month: "long", year: "numeric" };
  return new Date(isoString).toLocaleDateString("tr-TR", options);
};

const PostCard = ({ post }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/post/${slugify(post.title)}`);
  };

  const firstImage = getFirstImageFromHTML(post.content);
  const imageUrl = post.image || firstImage;

  return (
    <Card
      onClick={handleClick}
      sx={{
        width: "100%",
        height: 360,
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
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
        },
      }}
    >
      {imageUrl ? (
        <CardMedia
          component="img"
          height="140"
          image={imageUrl}
          alt={post.title}
          sx={{
            objectFit: "cover",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.03)",
            },
          }}
        />
      ) : (
        <Box
          sx={{
            height: 140,
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
            label={post.category}
            size="small"
            sx={{
              mb: 1,
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.getContrastText(theme.palette.primary.light),
              fontWeight: 500,
            }}
          />
        )}

        {/* Başlık */}
        <Typography
          variant="h6"
          fontWeight={600}
          gutterBottom
          sx={{ fontSize: "1rem", lineHeight: 1.4 }}
        >
          {post.title}
        </Typography>

        {/* Özet */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "0.875rem",
          }}
        >
          {post.summary || post.content?.replace(/<[^>]+>/g, "") || ""}
        </Typography>
      </CardContent>

      {/* Alt bar: tarih + ok icon */}
      <Box
        sx={{
          px: 2,
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {post.date && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarMonthIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {formatDate(post.date)}
            </Typography>
          </Box>
        )}

        <Tooltip title="Devamını Oku">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
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

export default PostCard;
