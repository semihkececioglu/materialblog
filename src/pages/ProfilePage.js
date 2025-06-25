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
  CircularProgress,
} from "@mui/material";
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

        // Eğer likedPosts varsa post detaylarını çek
        if (isOwnProfile) {
          const likedPostDetails = await Promise.all(
            (userInfo.likedPosts || []).map((id) =>
              axios
                .get(
                  `https://materialblog-server-production.up.railway.app/api/posts/${id}`
                )
                .then((res) => res.data)
                .catch(() => null)
            )
          );

          const savedPostDetails = await Promise.all(
            (userInfo.savedPosts || []).map((id) =>
              axios
                .get(
                  `https://materialblog-server-production.up.railway.app/api/posts/${id}`
                )
                .then((res) => res.data)
                .catch(() => null)
            )
          );

          setLikedPosts(likedPostDetails.filter(Boolean));
          setSavedPosts(savedPostDetails.filter(Boolean));
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
              bgcolor: stringToColor(userData.username),
              color: "white",
            }}
          >
            {userData.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6">
              {userData.firstName} {userData.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{userData.username}
            </Typography>
          </Box>
        </Box>

        {isOwnProfile && (
          <>
            <Typography variant="subtitle1" gutterBottom>
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
                        borderRadius: 1,
                        mb: 1,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <ListItemText primary={post.title} />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
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
                        borderRadius: 1,
                        mb: 1,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <ListItemText primary={post.title} />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ProfilePage;
