import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  useTheme,
  Box,
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
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 2,
        cursor: "pointer",
        bgcolor:
          theme.palette.mode === "dark" ? "grey.900" : "background.paper",
        border: `1px solid ${
          theme.palette.mode === "dark"
            ? theme.palette.grey[800]
            : theme.palette.grey[300]
        }`,
        transition: "all 0.35s ease",
        transform: "translateY(0)",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-4px) scale(1.01)",
        },
      }}
    >
      {imageUrl ? (
        <CardMedia
          component="img"
          height="160"
          image={imageUrl}
          alt={post.title}
          sx={{ objectFit: "cover", transition: "transform 0.3s ease" }}
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

      <CardContent>
        <Typography variant="h6" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {truncateText(
            post.summary || post.content?.replace(/<[^>]+>/g, ""),
            100
          )}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end" }}>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          aria-label="Devamını oku"
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.getContrastText(theme.palette.primary.main),
            borderRadius: "50%",
            width: 40,
            height: 40,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.15) rotate(5deg)",
              bgcolor: theme.palette.primary.dark,
            },
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default PostCard;
