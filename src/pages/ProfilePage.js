import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  useTheme,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const stringToColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 60%, 50%)`;
};

const ProfilePage = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const theme = useTheme();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  const isOwnProfile = user && user.username === username;

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        const userRes = await axios.get(
          `https://materialblog-server-production.up.railway.app/api/users/${username}`
        );
        const userInfo = userRes.data;
        setUserData(userInfo);

        if (isOwnProfile) {
          const liked = await Promise.all(
            (userInfo.likedPosts || []).map((id) =>
              axios
                .get(
                  `https://materialblog-server-production.up.railway.app/api/posts/${id}`
                )
                .then((res) => res.data)
                .catch(() => null)
            )
          );

          const saved = await Promise.all(
            (userInfo.savedPosts || []).map((id) =>
              axios
                .get(
                  `https://materialblog-server-production.up.railway.app/api/posts/${id}`
                )
                .then((res) => res.data)
                .catch(() => null)
            )
          );

          setLikedPosts(liked.filter(Boolean));
          setSavedPosts(saved.filter(Boolean));
        }

        setLoading(false);
      } catch (err) {
        console.error("Kullanıcı verisi alınamadı:", err);
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, [username, isOwnProfile]);

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Kullanıcı bulunamadı.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Card
        elevation={6}
        sx={{
          p: 3,
          borderRadius: 4,
          backdropFilter: "blur(16px)",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.5)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: stringToColor(userData.username),
              color: "white",
              fontWeight: 600,
            }}
          >
            {userData.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {userData.firstName} {userData.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{userData.username}
            </Typography>
          </Box>
        </Box>

        {isOwnProfile && (
          <>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <FavoriteIcon color="error" fontSize="small" />
              Beğenilen Yazılar
            </Typography>

            {likedPosts.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Henüz beğendiğiniz bir yazı yok.
              </Typography>
            ) : (
              <List>
                {likedPosts.map((post) => (
                  <React.Fragment key={post._id}>
                    <ListItem
                      button
                      component={Link}
                      to={`/post/${post.slug}`}
                      sx={{
                        borderRadius: 2,
                        px: 2,
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(0,0,0,0.04)",
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <ArrowForwardIosIcon
                          fontSize="small"
                          color="action"
                          sx={{ mt: 0.5 }}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={post.title} />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}

            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 4 }}
            >
              <BookmarkIcon color="primary" fontSize="small" />
              Kaydedilen Yazılar
            </Typography>

            {savedPosts.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Henüz kaydettiğiniz bir yazı yok.
              </Typography>
            ) : (
              <List>
                {savedPosts.map((post) => (
                  <React.Fragment key={post._id}>
                    <ListItem
                      button
                      component={Link}
                      to={`/post/${post.slug}`}
                      sx={{
                        borderRadius: 2,
                        px: 2,
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(0,0,0,0.04)",
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <ArrowForwardIosIcon
                          fontSize="small"
                          color="action"
                          sx={{ mt: 0.5 }}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={post.title} />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
          </>
        )}
      </Card>
    </Box>
  );
};

export default ProfilePage;
