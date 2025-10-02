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
  Chip,
  Skeleton,
  Divider,
  Badge,
  Button,
  Fade,
} from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ArticleIcon from "@mui/icons-material/Article";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
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
  const navigate = useNavigate();
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [username]);

  const postItemStyle = {
    mb: 2,
    p: 2,
    borderRadius: 2,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.03)"
        : "rgba(0,0,0,0.02)",
    border: `1px solid ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.08)"
        : "rgba(0,0,0,0.06)"
    }`,
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.05)"
          : "rgba(0,0,0,0.04)",
      transform: "translateY(-1px)",
      boxShadow: theme.shadows[2],
    },
    "& a": {
      textDecoration: "none",
      color: "inherit",
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, mt: { xs: 1, md: 2 }, minHeight: "100vh" }}>
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
          {/* Header Skeleton */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Skeleton
              variant="text"
              width={300}
              height={40}
              sx={{ mx: "auto", mb: 1 }}
            />
            <Skeleton
              variant="text"
              width={200}
              height={24}
              sx={{ mx: "auto" }}
            />
          </Box>

          <Card
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))"
                  : "linear-gradient(135deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))",
              border: "1px solid",
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.08)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
            }}
          >
            {/* Avatar Section Skeleton */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Skeleton
                variant="circular"
                width={100}
                height={100}
                sx={{ mb: 3 }}
              />
              <Skeleton
                variant="rounded"
                width={120}
                height={36}
                sx={{ mb: 2 }}
              />
              <Skeleton variant="rounded" width={100} height={40} />
            </Box>

            <Skeleton
              variant="rounded"
              width="100%"
              height={100}
              sx={{ mb: 4 }}
            />
            <Skeleton
              variant="rounded"
              width="100%"
              height={48}
              sx={{ mb: 2 }}
            />

            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rounded"
                width="100%"
                height={60}
                sx={{ mb: 2 }}
              />
            ))}
          </Card>
        </Box>
      </Box>
    );
  }

  if (!userData)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Kullanıcı bulunamadı.
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ p: 4, mt: { xs: 1, md: 2 }, minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              mb: 1,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {userData.firstName} {userData.lastName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Kullanıcı Profili
          </Typography>
        </Box>

        {/* Main Card */}
        <Card
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))"
                : "linear-gradient(135deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))",
            border: "1px solid",
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.08)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
          }}
        >
          {/* Avatar Section */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Fade in={!loading}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{ position: "relative", display: "inline-block", mb: 3 }}
                >
                  <Avatar
                    src={userData.profileImage || ""}
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: userData.profileImage
                        ? "transparent"
                        : stringToColor(userData.username),
                      color: "white",
                      fontWeight: 700,
                      fontSize: "2.5rem",
                      boxShadow: theme.shadows[8],
                      border: "4px solid",
                      borderColor: "background.paper",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    {!userData.profileImage &&
                      userData.username.charAt(0).toUpperCase()}
                  </Avatar>
                </Box>

                <Chip
                  icon={<PersonIcon sx={{ fontSize: 18 }} />}
                  label={`@${userData.username}`}
                  variant="filled"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    px: 2,
                    py: 0.5,
                    height: 36,
                    mb: 2,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: "white",
                    borderRadius: 3,
                    boxShadow: theme.shadows[3],
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: theme.shadows[6],
                    },
                    "& .MuiChip-icon": {
                      color: "white",
                      fontSize: 18,
                    },
                  }}
                />

                {/* Edit Button for Own Profile */}
                {isOwnProfile && (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/profile/${username}/edit`)}
                    sx={{
                      borderRadius: 3,
                      fontWeight: 600,
                      textTransform: "none",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    Profili Düzenle
                  </Button>
                )}
              </Box>
            </Fade>
          </Box>

          {/* Biyografi */}
          {userData.bio && (
            <Card
              elevation={2}
              sx={{
                p: 2.5,
                mb: 4,
                borderRadius: 3,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.02)",
                border: `1px solid ${
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.08)"
                }`,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-line",
                  color: theme.palette.text.primary,
                  lineHeight: 1.6,
                  fontStyle: "italic",
                  textAlign: "center",
                }}
              >
                "{userData.bio}"
              </Typography>
            </Card>
          )}

          <Divider sx={{ mb: 4 }} />

          {/* Tabs with Badges */}
          <Tabs
            value={tab}
            onChange={(e, newVal) => setTab(newVal)}
            variant="fullWidth"
            sx={{
              mb: 2,
              "& .MuiTab-root": {
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                mx: 0.5,
                transition: "all 0.3s ease",
                "&.Mui-selected": {
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                  color: theme.palette.primary.main,
                },
              },
            }}
          >
            <Tab
              icon={
                <Badge
                  badgeContent={userPosts.length}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#2196f3",
                      color: "white",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                    },
                  }}
                >
                  <ArticleIcon sx={{ color: "#2196f3" }} />
                </Badge>
              }
              label="Yazılar"
            />
            <Tab
              icon={
                <Badge
                  badgeContent={isOwnProfile ? likedPosts.length : 0}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#f44336",
                      color: "white",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                    },
                  }}
                >
                  <FavoriteIcon sx={{ color: "#f44336" }} />
                </Badge>
              }
              label="Beğenilen"
              disabled={!isOwnProfile}
            />
            <Tab
              icon={
                <Badge
                  badgeContent={isOwnProfile ? savedPosts.length : 0}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#ff9800",
                      color: "white",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                    },
                  }}
                >
                  <BookmarkIcon sx={{ color: "#ff9800" }} />
                </Badge>
              }
              label="Kaydedilen"
              disabled={!isOwnProfile}
            />
          </Tabs>

          {/* Tab Panels */}
          <TabPanel value={tab} index={0}>
            {userPosts.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <ArticleIcon
                  sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="body1" color="text.secondary">
                  Henüz yazı paylaşılmamış.
                </Typography>
              </Box>
            ) : (
              <Box>
                {userPosts.map((post, index) => (
                  <Box key={post._id} sx={postItemStyle}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          minWidth: 32,
                          height: 32,
                          borderRadius: 2,
                          backgroundColor: "#2196f3",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Link to={`/post/${post.slug}`} style={{ flex: 1 }}>
                        <Typography variant="body1" fontWeight={500}>
                          {post.title}
                        </Typography>
                      </Link>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tab} index={1}>
            {likedPosts.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <FavoriteIcon
                  sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="body1" color="text.secondary">
                  Henüz beğendiğiniz bir yazı yok.
                </Typography>
              </Box>
            ) : (
              <Box>
                {likedPosts.map((post, index) => (
                  <Box key={post._id} sx={postItemStyle}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          minWidth: 32,
                          height: 32,
                          borderRadius: 2,
                          backgroundColor: "#f44336",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Link to={`/post/${post.slug}`} style={{ flex: 1 }}>
                        <Typography variant="body1" fontWeight={500}>
                          {post.title}
                        </Typography>
                      </Link>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tab} index={2}>
            {savedPosts.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <BookmarkIcon
                  sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="body1" color="text.secondary">
                  Henüz kaydettiğiniz bir yazı yok.
                </Typography>
              </Box>
            ) : (
              <Box>
                {savedPosts.map((post, index) => (
                  <Box key={post._id} sx={postItemStyle}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          minWidth: 32,
                          height: 32,
                          borderRadius: 2,
                          backgroundColor: "#ff9800",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Link to={`/post/${post.slug}`} style={{ flex: 1 }}>
                        <Typography variant="body1" fontWeight={500}>
                          {post.title}
                        </Typography>
                      </Link>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </TabPanel>
        </Card>
      </Box>
    </Box>
  );
};

export default ProfilePage;
