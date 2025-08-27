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
  Divider,
  Skeleton,
} from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
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
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, deleteComment } from "../redux/commentSlice";
import axios from "axios";

const CONTROL_H = 38;
const SKELETON_ROWS = 6;

const AdminCommentsPage = () => {
  const dispatch = useDispatch();
  const { items: comments = [], loading } = useSelector(
    (s) => s.comments || {}
  );
  const [postTitles, setPostTitles] = useState({});
  const [search, setSearch] = useState("");
  const [minLikes, setMinLikes] = useState("");
  const [sortKey, setSortKey] = useState("date"); // date | likes
  const [sortDir, setSortDir] = useState("desc"); // asc | desc
  const [refreshing, setRefreshing] = useState(false);
  const [dialog, setDialog] = useState({ open: false, id: null });

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
  const list = useMemo(() => {
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

  const isEmpty = !loading && list.length === 0;

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchComments()).finally(() => setRefreshing(false));
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteComment(dialog.id));
    } finally {
      setDialog({ open: false, id: null });
    }
  };

  const clearFilters = () => {
    setSearch("");
    setMinLikes("");
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
    <Container
      maxWidth="lg"
      sx={{ py: { xs: 4, md: 5 }, position: "relative" }}
    >
      {/* Ambient bg like Users page */}
      <Box
        aria-hidden
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: (theme) =>
            theme.palette.mode === "dark"
              ? `radial-gradient(circle at 25% 15%, ${alpha(
                  theme.palette.primary.main,
                  0.15
                )}, transparent 60%), linear-gradient(135deg, ${alpha(
                  theme.palette.background.default,
                  1
                )}, ${alpha(theme.palette.background.default, 1)})`
              : `radial-gradient(circle at 25% 15%, ${alpha(
                  theme.palette.primary.light,
                  0.28
                )}, transparent 65%), linear-gradient(135deg, ${alpha(
                  theme.palette.background.default,
                  0.9
                )}, ${alpha(theme.palette.background.paper, 0.9)})`,
          pointerEvents: "none",
        }}
      />

      {/* Header unified with Users page (title on first row, controls below flush) */}
      <Paper
        elevation={0}
        sx={(theme) => ({
          mb: 4,
          p: 3,
          pt: 2.6,
          pb: 2.2,
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          gap: 1.2,
          backdropFilter: "blur(18px)",
          background: alpha(theme.palette.background.paper, 0.85),
          border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: `linear-gradient(120deg, ${alpha(
              theme.palette.primary.main,
              0.08
            )}, transparent 60%)`,
            pointerEvents: "none",
          },
        })}
      >
        {/* Title row */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={(theme) => ({
              width: 52,
              height: 52,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: alpha(theme.palette.primary.main, 0.15),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
              flexShrink: 0,
            })}
          >
            <ForumIcon color="primary" />
          </Box>
          <Box sx={{ flex: 1, minWidth: 240 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, letterSpacing: "-0.5px", lineHeight: 1.1 }}
            >
              Yorumlar
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.6 }}>
              <Chip
                label={`${comments.length} Yorum`}
                size="small"
                icon={<ForumIcon sx={{ fontSize: 18 }} />}
                sx={{
                  fontWeight: 600,
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                  color: "primary.main",
                  height: 30,
                  ".MuiChip-label": { px: 1.2 },
                }}
              />
              <Chip
                label={`${totalLikes} Beğeni`}
                size="small"
                icon={<FavoriteIcon sx={{ fontSize: 18 }} />}
                sx={{
                  fontWeight: 600,
                  bgcolor: (t) => alpha(t.palette.error.main, 0.15),
                  color: "error.main",
                  height: 30,
                  ".MuiChip-label": { px: 1.2 },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Filter row (flush) */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.4,
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            placeholder="Ara (yorum, kullanıcı, yazı)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={(theme) => ({
              minWidth: { xs: "100%", sm: 260 },
              "& .MuiOutlinedInput-root": {
                height: CONTROL_H,
                borderRadius: 3,
                background: alpha(theme.palette.background.default, 0.5),
                backdropFilter: "blur(6px)",
                "&:hover": {
                  background: alpha(theme.palette.background.default, 0.7),
                },
              },
            })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearch("")}>
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            size="small"
            value={minLikes}
            onChange={(e) => setMinLikes(e.target.value.replace(/\D/g, ""))}
            placeholder="Min beğeni"
            sx={(theme) => ({
              width: 140,
              "& .MuiOutlinedInput-root": {
                height: CONTROL_H,
                borderRadius: 3,
                background: alpha(theme.palette.background.default, 0.5),
              },
            })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FavoriteIcon sx={{ fontSize: 16, color: "error.main" }} />
                </InputAdornment>
              ),
            }}
          />

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
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
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

          <IconButton
            size="small"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Yenile"
            sx={{
              width: CONTROL_H,
              height: CONTROL_H,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <RefreshRoundedIcon
              sx={{
                fontSize: 20,
                ...(refreshing && {
                  animation: "spin 1s linear infinite",
                  "@keyframes spin": { to: { transform: "rotate(360deg)" } },
                }),
              }}
            />
          </IconButton>

          {(search || minLikes) && (
            <Button
              size="small"
              variant="text"
              onClick={clearFilters}
              startIcon={<FilterAltOffRoundedIcon fontSize="small" />}
              sx={{
                height: CONTROL_H,
                borderRadius: 3,
                textTransform: "none",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Temizle
            </Button>
          )}
        </Box>
      </Paper>

      {/* Table card unified */}
      <Paper
        elevation={0}
        sx={(theme) => ({
          borderRadius: 4,
          backdropFilter: "blur(14px)",
          background: alpha(theme.palette.background.paper, 0.85),
          border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          overflow: "hidden",
          position: "relative",
        })}
      >
        <TableContainer sx={{ maxHeight: 620 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: 600, background: "background.paper" }}
                >
                  Kullanıcı
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, background: "background.paper" }}
                >
                  Yorum
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, background: "background.paper" }}
                >
                  Yazı
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, background: "background.paper" }}
                >
                  Tarih
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    background: "background.paper",
                    width: 90,
                  }}
                >
                  <FavoriteIcon sx={{ fontSize: 16, color: "error.main" }} />
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    background: "background.paper",
                    width: 90,
                  }}
                >
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
                list.map((c) => {
                  const likeCount = c.likes?.length || 0;
                  const tone =
                    likeCount > 30
                      ? "error.main"
                      : likeCount > 10
                      ? "warning.main"
                      : "text.secondary";
                  return (
                    <TableRow
                      key={c._id}
                      hover
                      sx={{
                        transition: ".25s",
                        "&:hover": {
                          backgroundColor: (theme) =>
                            alpha(theme.palette.primary.main, 0.03),
                        },
                      }}
                    >
                      <TableCell sx={{ py: 1.5 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
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
                        <Chip
                          size="small"
                          label={likeCount}
                          icon={<FavoriteIcon sx={{ fontSize: 16 }} />}
                          sx={(t) => ({
                            fontWeight: 600,
                            bgcolor: alpha(
                              t.palette.error.main,
                              likeCount ? 0.15 : 0.08
                            ),
                            color: tone,
                            height: 30,
                            ".MuiChip-label": { px: 0.9, fontSize: 12 },
                          })}
                        />
                      </TableCell>

                      <TableCell align="right" sx={{ py: 1.5 }}>
                        <Tooltip title="Sil" arrow>
                          <span>
                            <IconButton
                              size="small"
                              onClick={() =>
                                setDialog({ open: true, id: c._id })
                              }
                              sx={(t) => ({
                                width: 36,
                                height: 36,
                                borderRadius: 3,
                                color: "error.main",
                                bgcolor: alpha(t.palette.error.main, 0.1),
                                transition: ".25s",
                                "&:hover": {
                                  bgcolor: alpha(t.palette.error.main, 0.18),
                                },
                              })}
                            >
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
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
                        opacity: 0.75,
                      }}
                    >
                      <ForumIcon color="disabled" sx={{ fontSize: 48 }} />
                      <Typography variant="body2" color="text.secondary">
                        Kriterlere uygun yorum bulunamadı.
                      </Typography>
                      {(search || minLikes) && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={clearFilters}
                          sx={{ borderRadius: 3 }}
                          startIcon={
                            <FilterAltOffRoundedIcon fontSize="small" />
                          }
                        >
                          Filtreleri sıfırla
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />
        <Box
          sx={{
            px: 3,
            py: 2.5,
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Toplam {comments.length} yorum listelendi.
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Görüntülenen: {list.length} / Beğeni: {totalLikes}
          </Typography>
        </Box>
      </Paper>

      {/* Delete dialog */}
      <Dialog
        open={dialog.open}
        onClose={() => setDialog({ open: false, id: null })}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 0,
            width: "100%",
            maxWidth: 420,
            overflow: "hidden",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Yorumu Sil
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Geri alınamaz
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography fontSize={13}>
            Yorum kalıcı olarak silinecek. Devam edilsin mi?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setDialog({ open: false, id: null })}
            sx={{ textTransform: "none", borderRadius: 3 }}
          >
            İptal
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={(t) => ({
              textTransform: "none",
              borderRadius: 3,
              fontWeight: 600,
              background: `linear-gradient(90deg, ${
                t.palette.error.main
              }, ${darken(t.palette.error.main, 0.18)})`,
            })}
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminCommentsPage;
