import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Skeleton,
  Stack,
  Badge,
  Pagination,
  Alert,
  Snackbar,
  Slide,
} from "@mui/material";
import { alpha, darken, styled } from "@mui/material/styles";
import ForumIcon from "@mui/icons-material/Forum";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import FilterAltOffRoundedIcon from "@mui/icons-material/FilterAltOffRounded";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ClearIcon from "@mui/icons-material/Clear";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, deleteComment } from "../redux/commentSlice";
import axios from "axios";

const CONTROL_H = 42;
const SKELETON_ROWS = 8;
const ITEMS_PER_PAGE = 10;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    "& .action-buttons": {
      opacity: 1,
      transform: "translateX(0)",
    },
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  height: 28,
  borderRadius: 14,
  fontWeight: 600,
  fontSize: "0.75rem",
  transition: "all 0.3s ease",
}));

const AdminCommentsPage = () => {
  const dispatch = useDispatch();
  const { items: comments = [], loading } = useSelector(
    (s) => s.comments || {}
  );

  // State
  const [postTitles, setPostTitles] = useState({});
  const [search, setSearch] = useState("");
  const [minLikes, setMinLikes] = useState("");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [refreshing, setRefreshing] = useState(false);
  const [dialog, setDialog] = useState({ open: false, id: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Initial fetch
  useEffect(() => {
    dispatch(fetchComments());
  }, [dispatch]);

  // Post titles
  useEffect(() => {
    if (!comments.length) return;
    const ids = [
      ...new Set(comments.map((c) => c.postId?.toString?.())),
    ].filter(Boolean);
    const missing = ids.filter((id) => !postTitles[id]);
    if (!missing.length) return;
    const map = {};
    Promise.all(
      missing.map(async (id) => {
        try {
          const { data } = await axios.get(
            `https://materialblog-server-production.up.railway.app/api/posts/${id}`
          );
          map[id] = data?.title || "Başlık Yok";
        } catch {
          map[id] = "Bilinmeyen Yazı";
        }
      })
    ).then(() => setPostTitles((p) => ({ ...p, ...map })));
  }, [comments, postTitles]);

  const totalLikes = comments.reduce((s, c) => s + (c.likes?.length || 0), 0);
  const minLikesNum = minLikes === "" ? 0 : Number(minLikes) || 0;

  // Filtering + sorting
  const filteredComments = useMemo(() => {
    let arr = [...comments];
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (c) =>
          c.text?.toLowerCase().includes(q) ||
          c.user?.username?.toLowerCase().includes(q) ||
          postTitles[c.postId?.toString?.()]?.toLowerCase?.().includes(q)
      );
    }
    if (minLikesNum > 0) {
      arr = arr.filter((c) => (c.likes?.length || 0) >= minLikesNum);
    }
    arr.sort((a, b) => {
      if (sortKey === "likes") {
        const la = a.likes?.length || 0;
        const lb = b.likes?.length || 0;
        return sortDir === "asc" ? la - lb : lb - la;
      }
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sortDir === "asc" ? da - db : db - da;
    });
    return arr;
  }, [comments, search, minLikesNum, sortKey, sortDir, postTitles]);

  // Pagination
  const totalPages = Math.ceil(filteredComments.length / ITEMS_PER_PAGE);
  const paginatedComments = filteredComments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const isEmpty = !loading && paginatedComments.length === 0;

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchComments()).finally(() => {
      setRefreshing(false);
      showSnackbar("Yorumlar yenilendi!", "success");
    });
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteComment(dialog.id));
      showSnackbar("Yorum başarıyla silindi!", "info");

      // Sayfa kontrolü
      const newTotal = Math.ceil(
        (filteredComments.length - 1) / ITEMS_PER_PAGE
      );
      if (currentPage > newTotal && newTotal > 0) {
        setCurrentPage(newTotal);
      }
    } catch (error) {
      showSnackbar("Silme işlemi sırasında bir hata oluştu!", "error");
    } finally {
      setDialog({ open: false, id: null });
    }
  };

  const clearFilters = () => {
    setSearch("");
    setMinLikes("");
    setCurrentPage(1);
  };

  // Highlight helper
  const highlight = (text = "") => {
    if (!search.trim()) return text;
    const q = search.trim();
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <Box
          component="mark"
          sx={{
            px: 0.3,
            borderRadius: 0.5,
            bgcolor: "warning.main",
            color: "warning.contrastText",
            fontWeight: 600,
          }}
        >
          {text.slice(idx, idx + q.length)}
        </Box>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      {/* Enhanced Background */}
      <Box
        aria-hidden
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: (t) =>
            t.palette.mode === "dark"
              ? `radial-gradient(circle at 20% 15%, ${alpha(
                  t.palette.primary.main,
                  0.15
                )}, transparent 60%), 
                 radial-gradient(circle at 80% 85%, ${alpha(
                   t.palette.secondary.main,
                   0.12
                 )}, transparent 60%),
                 linear-gradient(135deg, ${t.palette.background.default}, ${
                  t.palette.background.default
                })`
              : `radial-gradient(circle at 20% 15%, ${alpha(
                  t.palette.primary.light,
                  0.4
                )}, transparent 65%), 
                 radial-gradient(circle at 80% 85%, ${alpha(
                   t.palette.secondary.light,
                   0.3
                 )}, transparent 65%),
                 linear-gradient(135deg, ${t.palette.background.default}, ${
                  t.palette.background.paper
                })`,
        }}
      />

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 5 } }}>
        {/* Enhanced Header */}
        <Paper
          elevation={0}
          sx={(t) => ({
            mb: 4,
            p: 4,
            borderRadius: 6,
            backdropFilter: "blur(20px)",
            background:
              t.palette.mode === "dark"
                ? `linear-gradient(145deg, ${alpha(
                    t.palette.background.paper,
                    0.9
                  )}, ${alpha(t.palette.background.default, 0.95)})`
                : `linear-gradient(145deg, ${alpha("#fff", 0.95)}, ${alpha(
                    "#f8fafc",
                    0.9
                  )})`,
            border: `1px solid ${alpha(t.palette.divider, 0.2)}`,
            position: "relative",
            overflow: "hidden",
            "&:before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 30% 20%, ${alpha(
                t.palette.primary.main,
                0.08
              )} 0%, transparent 50%), 
                           radial-gradient(circle at 80% 80%, ${alpha(
                             t.palette.secondary.main,
                             0.06
                           )} 0%, transparent 50%)`,
              pointerEvents: "none",
            },
          })}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            {/* Title Section */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={3}
              sx={{ mb: 3 }}
            >
              <Stack direction="row" alignItems="center" spacing={3}>
                <Box
                  sx={(t) => ({
                    width: 64,
                    height: 64,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
                    boxShadow: `0 8px 32px ${alpha(
                      t.palette.primary.main,
                      0.3
                    )}`,
                  })}
                >
                  <ForumIcon sx={{ fontSize: 32, color: "white" }} />
                </Box>
                <Box>
                  <Typography
                    variant="h3"
                    fontWeight={900}
                    sx={{
                      mb: 1,
                      background: (t) =>
                        `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "rgba(0, 0, 0, 0)",
                      letterSpacing: "-1px",
                      fontSize: { xs: "2rem", md: "2.5rem" },
                    }}
                  >
                    Yorum Yönetimi
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Badge
                      badgeContent={comments.length}
                      color="primary"
                      max={999}
                    >
                      <StyledChip
                        icon={<ForumIcon sx={{ fontSize: 18 }} />}
                        label="Toplam Yorum"
                        sx={{
                          bgcolor: (t) => alpha(t.palette.primary.main, 0.15),
                          color: "primary.main",
                        }}
                      />
                    </Badge>
                    {(search || minLikes) && (
                      <Badge
                        badgeContent={filteredComments.length}
                        color="secondary"
                        max={999}
                      >
                        <StyledChip
                          icon={<TrendingUpIcon sx={{ fontSize: 18 }} />}
                          label="Görüntülenen"
                          sx={{
                            bgcolor: (t) =>
                              alpha(t.palette.secondary.main, 0.15),
                            color: "secondary.main",
                          }}
                        />
                      </Badge>
                    )}
                    <Badge badgeContent={totalLikes} color="error" max={999}>
                      <StyledChip
                        icon={<FavoriteIcon sx={{ fontSize: 18 }} />}
                        label="Toplam Beğeni"
                        sx={{
                          bgcolor: (t) => alpha(t.palette.error.main, 0.15),
                          color: "error.main",
                        }}
                      />
                    </Badge>
                  </Stack>
                </Box>
              </Stack>

              {/* Refresh Button */}
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                sx={(t) => ({
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  bgcolor: alpha(t.palette.primary.main, 0.1),
                  color: "primary.main",
                  border: `1px solid ${alpha(t.palette.primary.main, 0.2)}`,
                  "&:hover": {
                    bgcolor: alpha(t.palette.primary.main, 0.2),
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.3s ease",
                })}
              >
                <RefreshRoundedIcon
                  sx={{
                    fontSize: 24,
                    ...(refreshing && {
                      animation: "spin 1s linear infinite",
                      "@keyframes spin": {
                        to: { transform: "rotate(360deg)" },
                      },
                    }),
                  }}
                />
              </IconButton>
            </Stack>

            {/* Enhanced Filters */}
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", md: "center" }}
              flexWrap="wrap"
            >
              <TextField
                size="small"
                placeholder="Ara (yorum, kullanıcı, yazı)"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                sx={(t) => ({
                  flex: 1,
                  minWidth: 320,
                  "& .MuiOutlinedInput-root": {
                    height: CONTROL_H,
                    borderRadius: 4,
                    background: alpha(t.palette.background.default, 0.6),
                    backdropFilter: "blur(10px)",
                  },
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon
                        sx={{ fontSize: 22, color: "primary.main" }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: search && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSearch("");
                          setCurrentPage(1);
                        }}
                        sx={{
                          bgcolor: (t) => alpha(t.palette.error.main, 0.1),
                          color: "error.main",
                        }}
                      >
                        <ClearIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                size="small"
                value={minLikes}
                onChange={(e) => {
                  setMinLikes(e.target.value.replace(/\D/g, ""));
                  setCurrentPage(1);
                }}
                placeholder="Min beğeni"
                sx={(t) => ({
                  width: 140,
                  "& .MuiOutlinedInput-root": {
                    height: CONTROL_H,
                    borderRadius: 4,
                    background: alpha(t.palette.background.default, 0.6),
                    backdropFilter: "blur(10px)",
                  },
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FavoriteIcon
                        sx={{ fontSize: 16, color: "error.main" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant={sortKey === "date" ? "contained" : "outlined"}
                  onClick={() => setSortKey("date")}
                  startIcon={<SortRoundedIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    height: CONTROL_H,
                    borderRadius: 3,
                    textTransform: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    minWidth: 86,
                  }}
                >
                  Tarih
                </Button>
                <Button
                  size="small"
                  variant={sortKey === "likes" ? "contained" : "outlined"}
                  onClick={() => setSortKey("likes")}
                  startIcon={<FavoriteIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    height: CONTROL_H,
                    borderRadius: 3,
                    textTransform: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    minWidth: 90,
                  }}
                >
                  Beğeni
                </Button>

                <IconButton
                  size="small"
                  onClick={() =>
                    setSortDir((d) => (d === "asc" ? "desc" : "asc"))
                  }
                  title={`Sıralama: ${sortDir === "asc" ? "Artan" : "Azalan"}`}
                  sx={{
                    width: CONTROL_H,
                    height: CONTROL_H,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  {sortDir === "asc" ? (
                    <ArrowUpwardRoundedIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <ArrowDownwardRoundedIcon sx={{ fontSize: 18 }} />
                  )}
                </IconButton>
              </Stack>

              {(search || minLikes) && (
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  sx={{
                    height: CONTROL_H,
                    borderRadius: 4,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 2,
                    minWidth: "auto",
                    whiteSpace: "nowrap",
                  }}
                  startIcon={<ClearIcon fontSize="small" />}
                >
                  Temizle
                </Button>
              )}
            </Stack>
          </Box>
        </Paper>

        {/* Enhanced Table */}
        <Paper
          elevation={0}
          sx={(t) => ({
            borderRadius: 4,
            backdropFilter: "blur(20px)",
            background: alpha(t.palette.background.paper, 0.9),
            border: `1px solid ${alpha(t.palette.divider, 0.2)}`,
            overflow: "hidden",
          })}
        >
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Kullanıcı</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Yorum</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Yazı</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tarih</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, width: 90 }}>
                    <FavoriteIcon sx={{ fontSize: 16, color: "error.main" }} />
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, width: 90 }}>
                    İşlem
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading &&
                  Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                    <TableRow key={`sk-${i}`}>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Skeleton variant="circular" width={42} height={42} />
                          <Box sx={{ flex: 1 }}>
                            <Skeleton width="55%" height={18} />
                            <Skeleton width="35%" height={14} />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Skeleton width="90%" height={16} />
                        <Skeleton width="60%" height={14} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width="70%" height={16} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width="60%" height={16} />
                      </TableCell>
                      <TableCell align="center">
                        <Skeleton width={50} height={28} />
                      </TableCell>
                      <TableCell align="right">
                        <Skeleton width={36} height={32} />
                      </TableCell>
                    </TableRow>
                  ))}

                {!loading &&
                  paginatedComments.map((c) => {
                    const likeCount = c.likes?.length || 0;
                    const tone =
                      likeCount > 30
                        ? "error.main"
                        : likeCount > 10
                        ? "warning.main"
                        : "text.secondary";
                    return (
                      <StyledTableRow key={c._id}>
                        <TableCell sx={{ py: 1.5 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Avatar
                              src={c.user?.profileImage}
                              alt={c.user?.username}
                              sx={{
                                width: 44,
                                height: 44,
                                fontWeight: 600,
                                bgcolor: (t) =>
                                  !c.user?.profileImage &&
                                  alpha(t.palette.primary.main, 0.15),
                                color: "primary.main",
                              }}
                            >
                              {(c.user?.username?.[0] || "").toUpperCase()}
                            </Avatar>
                            <Box sx={{ minWidth: 140 }}>
                              <Typography
                                sx={{
                                  fontWeight: 600,
                                  fontSize: "0.92rem",
                                  lineHeight: 1.2,
                                  mb: 0.3,
                                }}
                              >
                                {highlight(c.user?.username || "—")}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.7rem",
                                }}
                              >
                                ID: {c.user?._id?.slice(-6) || "N/A"}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell sx={{ py: 1.5, maxWidth: 380 }}>
                          <Tooltip
                            title={c.text}
                            arrow
                            disableInteractive
                            placement="top"
                          >
                            <Typography
                              sx={{
                                fontSize: "0.8rem",
                                color: "text.secondary",
                                lineHeight: 1.35,
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {highlight(c.text || "")}
                            </Typography>
                          </Tooltip>
                        </TableCell>

                        <TableCell sx={{ py: 1.5, maxWidth: 260 }}>
                          <Typography
                            sx={{
                              fontSize: "0.72rem",
                              color: "text.secondary",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={
                              postTitles[c.postId?.toString?.()] ||
                              "Yükleniyor..."
                            }
                          >
                            {highlight(
                              postTitles[c.postId?.toString?.()] ||
                                "Yükleniyor..."
                            )}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ py: 1.5 }}>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary", fontSize: ".7rem" }}
                          >
                            {new Date(c.date).toLocaleDateString("tr-TR")}
                          </Typography>
                        </TableCell>

                        <TableCell align="center" sx={{ py: 1.5 }}>
                          <StyledChip
                            size="small"
                            label={likeCount}
                            icon={<FavoriteIcon sx={{ fontSize: 16 }} />}
                            sx={(t) => ({
                              bgcolor: alpha(
                                t.palette.error.main,
                                likeCount ? 0.15 : 0.08
                              ),
                              color: tone,
                              height: 30,
                            })}
                          />
                        </TableCell>

                        <TableCell align="right" sx={{ py: 1.5 }}>
                          <Tooltip title="Sil" arrow>
                            <IconButton
                              size="small"
                              onClick={() =>
                                setDialog({ open: true, id: c._id })
                              }
                              className="action-buttons"
                              sx={(t) => ({
                                width: 36,
                                height: 36,
                                borderRadius: 3,
                                color: "error.main",
                                bgcolor: alpha(t.palette.error.main, 0.1),
                                border: `1px solid ${alpha(
                                  t.palette.error.main,
                                  0.2
                                )}`,
                                opacity: 0.7,
                                transform: "translateX(10px)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  bgcolor: alpha(t.palette.error.main, 0.2),
                                },
                              })}
                            >
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </StyledTableRow>
                    );
                  })}

                {isEmpty && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ py: 8 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <ForumIcon color="disabled" sx={{ fontSize: 64 }} />
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          fontWeight={600}
                        >
                          Yorum bulunamadı
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {search || minLikes
                            ? "Aradığınız kriterlere uygun yorum bulunamadı"
                            : "Henüz yorum bulunmuyor"}
                        </Typography>
                        {(search || minLikes) && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={clearFilters}
                            startIcon={<ClearIcon />}
                          >
                            Filtreleri Temizle
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Enhanced Table Footer with Pagination */}
          {!loading && filteredComments.length > 0 && (
            <Box
              sx={{
                px: 4,
                py: 3,
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: (t) => `1px solid ${alpha(t.palette.divider, 0.1)}`,
                bgcolor: (t) => alpha(t.palette.background.default, 0.3),
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="body2"
                  color="text.primary"
                  fontWeight={600}
                >
                  Toplam {filteredComments.length} yorum
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Sayfa {currentPage} / {totalPages}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Gösterilen {paginatedComments.length} yorum
                </Typography>
              </Stack>

              {totalPages > 1 && (
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(e, value) => setCurrentPage(value)}
                  color="primary"
                  shape="rounded"
                  size="small"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      fontWeight: 600,
                      transition: "all 0.3s ease",
                      "&.Mui-selected": {
                        background: (t) =>
                          `linear-gradient(135deg, ${
                            t.palette.primary.main
                          }, ${darken(t.palette.primary.main, 0.2)})`,
                      },
                    },
                  }}
                />
              )}
            </Box>
          )}
        </Paper>

        {/* Enhanced Delete Dialog */}
        <Dialog
          open={dialog.open}
          onClose={() => setDialog({ open: false, id: null })}
          TransitionComponent={Transition}
          PaperProps={{
            sx: {
              borderRadius: 6,
              overflow: "hidden",
              background: (t) =>
                t.palette.mode === "dark"
                  ? `linear-gradient(145deg, ${alpha(
                      t.palette.background.paper,
                      0.95
                    )}, ${alpha(t.palette.background.default, 0.9)})`
                  : `linear-gradient(145deg, ${alpha("#fff", 0.98)}, ${alpha(
                      "#f8fafc",
                      0.95
                    )})`,
              backdropFilter: "blur(20px)",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 800,
              pb: 1,
              fontSize: "1.3rem",
              background: (t) =>
                `linear-gradient(135deg, ${t.palette.error.main}, ${darken(
                  t.palette.error.main,
                  0.2
                )})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "rgba(0, 0, 0, 0)",
            }}
          >
            Yorumu Kalıcı Olarak Sil
          </DialogTitle>
          <DialogContent sx={{ pt: 4, pb: 1 }}>
            <Stack spacing={2}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: (t) => alpha(t.palette.error.main, 0.1),
                  border: (t) =>
                    `1px solid ${alpha(t.palette.error.main, 0.2)}`,
                }}
              >
                <Typography fontSize={14} fontWeight={600} color="error.main">
                  ⚠️ Bu işlem geri alınamaz!
                </Typography>
              </Box>
              <Typography fontSize={14} color="text.secondary" lineHeight={1.6}>
                Yorum ve tüm ilişkili veriler kalıcı olarak silinecektir.
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() => setDialog({ open: false, id: null })}
              sx={{
                textTransform: "none",
                borderRadius: 3,
                fontWeight: 600,
                px: 3,
              }}
            >
              İptal Et
            </Button>
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              sx={(t) => ({
                textTransform: "none",
                borderRadius: 3,
                fontWeight: 700,
                px: 3,
                background: `linear-gradient(135deg, ${
                  t.palette.error.main
                }, ${darken(t.palette.error.main, 0.2)})`,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 24px ${alpha(t.palette.error.main, 0.4)}`,
                },
              })}
            >
              Evet, Sil
            </Button>
          </DialogActions>
        </Dialog>

        {/* Enhanced Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          TransitionComponent={Slide}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{
              width: "100%",
              borderRadius: 3,
              fontWeight: 600,
              boxShadow: (t) =>
                `0 8px 32px ${alpha(t.palette[snackbar.severity].main, 0.3)}`,
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AdminCommentsPage;
