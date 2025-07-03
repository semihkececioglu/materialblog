import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  useTheme,
  Card,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ArticleIcon from "@mui/icons-material/Article";
import { useSelector } from "react-redux";

const stringToColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 60%, 50%)`;
};

const TabPanel = ({ value, index, children }) => {
  return value === index ? <Box sx={{ mt: 2 }}>{children}</Box> : null;
};

const ProfilePage = () => {
  const { username } = useParams();
  const user = useSelector((state) => state.user.currentUser);
  const theme = useTheme();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);

  const isOwnProfile = user && user.username === username;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(
          `https://materialblog-server-production.up.railway.app/api/users/${username}`
        );
        const userInfo = userRes.data;
        setUserData(userInfo);

        const postsRes = await axios.get(
          `https://materialblog-server-production.up.railway.app/api/posts?author=${username}&limit=1000`
        );
        setUserPosts(postsRes.data.posts || []);

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

    fetchData();
  }, [username, isOwnProfile]);

  const listItemStyle = {
    mb: 1.5,
    "& a": {
      textDecoration: "none",
      fontWeight: 500,
      fontSize: "1rem",
      color: theme.palette.mode === "dark" ? "#90caf9" : "#1976d2",
      position: "relative",
      transition: "color 0.2s ease",
      "&::after": {
        content: '""',
        position: "absolute",
        left: 0,
        bottom: -2,
        height: "2px",
        width: "100%",
        backgroundColor: theme.palette.primary.main,
        opacity: 0.2,
        transition: "opacity 0.2s ease",
      },
      "&:hover": {
        color: theme.palette.primary.main,
        "&::after": {
          opacity: 1,
        },
      },
      "&:visited": {
        color: theme.palette.mode === "dark" ? "#ce93d8" : "#6a1b9a",
      },
    },
  };

  if (loading)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );

  if (!userData)
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Kullanıcı bulunamadı.</Typography>
      </Box>
    );

  return (
    <Box sx={{ p: 4, maxWidth: 700, mx: "auto" }}>
      <Card
        elevation={6}
        sx={{
          p: 3,
          borderRadius: 4,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(80,80,80,0.3), rgba(40,40,40,0.2))"
              : "linear-gradient(135deg, rgba(255,255,255,0.6), rgba(230,230,250,0.4))",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        {/* Kullanıcı Bilgileri */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar
            src={userData.profileImage || ""}
            sx={{
              width: 64,
              height: 64,
              bgcolor: userData.profileImage
                ? "transparent"
                : stringToColor(userData.username),
              color: "white",
              fontWeight: 600,
            }}
          >
            {!userData.profileImage &&
              userData.username.charAt(0).toUpperCase()}
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

        {/* Biyografi */}
        {userData.bio && (
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-line",
              color: theme.palette.text.secondary,
              mb: 2,
            }}
          >
            {userData.bio}
          </Typography>
        )}

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(e, newVal) => setTab(newVal)}
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab icon={<ArticleIcon />} label="Yazılar" />
          <Tab
            icon={<FavoriteIcon />}
            label="Beğenilen"
            disabled={!isOwnProfile}
          />
          <Tab
            icon={<BookmarkIcon />}
            label="Kaydedilen"
            disabled={!isOwnProfile}
          />
        </Tabs>

        {/* Sekme: Paylaşılan Yazılar */}
        <TabPanel value={tab} index={0}>
          {userPosts.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Henüz yazı paylaşılmamış.
            </Typography>
          ) : (
            <Box component="ol" sx={{ pl: 3 }}>
              {userPosts.map((post) => (
                <Box component="li" key={post._id} sx={listItemStyle}>
                  <Link to={`/post/${post.slug}`}>{post.title}</Link>
                </Box>
              ))}
            </Box>
          )}
        </TabPanel>

        {/* Sekme: Beğenilen Yazılar */}
        <TabPanel value={tab} index={1}>
          {likedPosts.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Henüz beğendiğiniz bir yazı yok.
            </Typography>
          ) : (
            <Box component="ol" sx={{ pl: 3 }}>
              {likedPosts.map((post) => (
                <Box component="li" key={post._id} sx={listItemStyle}>
                  <Link to={`/post/${post.slug}`}>{post.title}</Link>
                </Box>
              ))}
            </Box>
          )}
        </TabPanel>

        {/* Sekme: Kaydedilen Yazılar */}
        <TabPanel value={tab} index={2}>
          {savedPosts.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Henüz kaydettiğiniz bir yazı yok.
            </Typography>
          ) : (
            <Box component="ol" sx={{ pl: 3 }}>
              {savedPosts.map((post) => (
                <Box component="li" key={post._id} sx={listItemStyle}>
                  <Link to={`/post/${post.slug}`}>{post.title}</Link>
                </Box>
              ))}
            </Box>
          )}
        </TabPanel>
      </Card>
    </Box>
  );
};

export default ProfilePage;
