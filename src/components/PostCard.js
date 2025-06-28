import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  useTheme,
  Box,
  Button,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { useNavigate } from "react-router-dom";
import slugify from "../utils/slugify";

const getFirstImageFromHTML = (html) => {
  const match = html?.match(/<img[^>]+src=["']([^"'>]+)["']/);
  return match ? match[1] : null;
};

const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
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
        height: 420, // Sabit yükseklik
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 3,
        cursor: "pointer",
        overflow: "hidden",
        backdropFilter: "blur(10px)",
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.04)"
            : "rgba(255,255,255,0.6)",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: 6,
        transition: "all 0.3s ease",
        transform: "translateY(0)",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 10,
        },
      }}
    >
      {imageUrl ? (
        <CardMedia
          component="img"
          height="160"
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
            height: 160,
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

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {truncateText(
            post.summary || post.content?.replace(/<[^>]+>/g, ""),
            100
          )}
        </Typography>
      </CardContent>

      <Box sx={{ px: 2, pb: 2 }}>
        <Button
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          fullWidth
          endIcon={<ArrowForwardIcon />}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            textTransform: "none",
            bgcolor: theme.palette.primary.main,
            color: theme.palette.getContrastText(theme.palette.primary.main),
            "&:hover": {
              bgcolor: theme.palette.primary.dark,
            },
          }}
        >
          Devamını Oku
        </Button>
      </Box>
    </Card>
  );
};

export default PostCard;
