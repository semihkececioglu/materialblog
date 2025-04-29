import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  useTheme,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const stringToColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 60%, 50%)`;
};

const formatTitleFromUrl = (url) => {
  const slug = url.replace("/post/", "");
  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
};

const ProfilePage = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const theme = useTheme();
  const [likedPaths, setLikedPaths] = useState([]);
  const [savedPaths, setSavedPaths] = useState([]);

  useEffect(() => {
    if (user && user.name === username) {
      const likedKey = `likedPosts_${user.username || user.name}`;
      const savedKey = `savedPosts_${user.username || user.name}`;

      const likedList = JSON.parse(localStorage.getItem(likedKey)) || [];
      const likedUrls = Array.isArray(likedList)
        ? likedList.map((item) => (typeof item === "string" ? item : item.path))
        : [];
      setLikedPaths(likedUrls);

      const savedList = JSON.parse(localStorage.getItem(savedKey)) || [];
      const savedUrls = Array.isArray(savedList)
        ? savedList.map((item) => (typeof item === "string" ? item : item.path))
        : [];
      setSavedPaths(savedUrls);
    }
  }, [user, username]);

  if (!user || user.name !== username) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Bu sayfayı görüntüleme yetkiniz yok.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          maxWidth: 500,
          mx: "auto",
          bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.100",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: stringToColor(user.name),
              color: "white",
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6">{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Kullanıcı Profili
            </Typography>
          </Box>
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          Beğenilen Yazılar
        </Typography>

        {likedPaths.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Henüz beğendiğiniz bir yazı yok.
          </Typography>
        ) : (
          <List>
            {likedPaths.map((path, index) => (
              <React.Fragment key={index}>
                <ListItem
                  button
                  component={Link}
                  to={path}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemText primary={formatTitleFromUrl(path)} />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
          Kaydedilen Yazılar
        </Typography>

        {savedPaths.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Henüz kaydettiğiniz bir yazı yok.
          </Typography>
        ) : (
          <List>
            {savedPaths.map((path, index) => (
              <React.Fragment key={index}>
                <ListItem
                  button
                  component={Link}
                  to={path}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemText primary={formatTitleFromUrl(path)} />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default ProfilePage;
