import React, { useState, useEffect, useMemo } from "react";
import {
  Avatar,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  Container,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Skeleton,
  Stack,
  Badge,
  Pagination,
  Slide,
} from "@mui/material";
import { alpha, darken, styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ClearIcon from "@mui/icons-material/Clear";

const CONTROL_H = 42;
const SKELETON_ROWS = 8;
const ITEMS_PER_PAGE = 10;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ROLE_META = {
  admin: {
    label: "ADMİN",
    tone: "error",
    light: "#FDECEA",
    main: "#D84315",
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 18 }} />,
  },
  editor: {
    label: "EDİTÖR",
    tone: "info",
    light: "#E3F2FD",
    main: "#1976D2",
    icon: <EditIcon sx={{ fontSize: 18 }} />,
  },
  user: {
    label: "USER",
    tone: "default",
    light: "#F5F5F5",
    main: "#616161",
    icon: <PersonIcon sx={{ fontSize: 18 }} />,
  },
};

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

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [rawLoading, setRawLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers(true);
  }, []);

  const fetchUsers = (initial = false) => {
    if (initial) setRawLoading(true);
    else setRefreshing(true);
    axios
      .get("https://materialblog-server-production.up.railway.app/api/users")
      .then((res) => {
        setUsers(res.data || []);
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Kullanıcılar yüklenemedi",
          severity: "error",
        });
      })
      .finally(() => {
        setRawLoading(false);
        setRefreshing(false);
      });
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenRoleDialog = (user) => {
    if (user.username === "semihkececioglu") return;
    setSelectedUser(user);
    setNewRole(user.role);
    setDialogOpen(true);
  };

  const handleConfirmRoleChange = () => {
    axios
      .put(
        `https://materialblog-server-production.up.railway.app/api/users/${selectedUser._id}/role`,
        { role: newRole }
      )
      .then(() => {
        showSnackbar("Rol başarıyla güncellendi!", "success");
        fetchUsers();
      })
      .catch(() => showSnackbar("Rol güncellenemedi!", "error"))
      .finally(() => {
        setDialogOpen(false);
        setSelectedUser(null);
        setNewRole("");
      });
  };

  const filteredUsers = useMemo(() => {
    let list = users;
    if (roleFilter !== "all") list = list.filter((u) => u.role === roleFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (u) =>
          u.username?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, query, roleFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const isEmpty = !rawLoading && paginatedUsers.length === 0;

  const clearFilters = () => {
    setQuery("");
    setRoleFilter("all");
    setCurrentPage(1);
  };

  // Role counts
  const roleCounts = useMemo(() => {
    return users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
  }, [users]);

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
                  <PeopleIcon sx={{ fontSize: 32, color: "white" }} />
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
                    Kullanıcı Yönetimi
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Badge
                      badgeContent={users.length}
                      color="primary"
                      max={999}
                    >
                      <StyledChip
                        icon={<PeopleIcon sx={{ fontSize: 18 }} />}
                        label="Toplam Kullanıcı"
                        sx={{
                          bgcolor: (t) => alpha(t.palette.primary.main, 0.15),
                          color: "primary.main",
                        }}
                      />
                    </Badge>
                    {(query || roleFilter !== "all") && (
                      <Badge
                        badgeContent={filteredUsers.length}
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
                    <Badge
                      badgeContent={roleCounts.admin || 0}
                      color="error"
                      max={999}
                    >
                      <StyledChip
                        icon={<AdminPanelSettingsIcon sx={{ fontSize: 18 }} />}
                        label="Admin"
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
                onClick={() => fetchUsers(false)}
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
                {refreshing ? (
                  <CircularProgress size={20} />
                ) : (
                  <RefreshRoundedIcon sx={{ fontSize: 24 }} />
                )}
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
                placeholder="Ara (isim, kullanıcı, e‑posta)"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
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
                  endAdornment: query && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setQuery("");
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

              <Select
                size="small"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                displayEmpty
                sx={(t) => ({
                  minWidth: 160,
                  "& .MuiOutlinedInput-root": {
                    height: CONTROL_H,
                    borderRadius: 4,
                    background: alpha(t.palette.background.default, 0.6),
                    backdropFilter: "blur(10px)",
                  },
                })}
                renderValue={(val) =>
                  val === "all" ? "Tüm Roller" : ROLE_META[val]?.label || val
                }
              >
                <MenuItem value="all">Tüm Roller</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="editor">Editör</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>

              {(query || roleFilter !== "all") && (
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
                  <TableCell sx={{ fontWeight: 700 }}>İletişim</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Rol</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 90 }}>
                    Güvenlik
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rawLoading &&
                  Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                    <TableRow key={`sk-${i}`}>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Skeleton variant="circular" width={44} height={44} />
                          <Box sx={{ flex: 1 }}>
                            <Skeleton width="55%" height={18} />
                            <Skeleton width="35%" height={14} />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Skeleton width="70%" height={18} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={90} height={30} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={60} height={24} />
                      </TableCell>
                    </TableRow>
                  ))}

                {!rawLoading &&
                  paginatedUsers.map((user) => {
                    const meta = ROLE_META[user.role] || ROLE_META.user;
                    const isProtected = user.username === "semihkececioglu";
                    return (
                      <StyledTableRow key={user._id}>
                        <TableCell sx={{ py: 1.5 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Tooltip title="Profili görüntüle" arrow>
                              <Avatar
                                src={user.profileImage}
                                alt={user.username}
                                sx={{
                                  width: 44,
                                  height: 44,
                                  cursor: "pointer",
                                  fontWeight: 600,
                                  bgcolor: (t) =>
                                    !user.profileImage &&
                                    alpha(t.palette.primary.main, 0.15),
                                  color: "primary.main",
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: (t) =>
                                      `0 8px 24px ${alpha(
                                        t.palette.primary.main,
                                        0.4
                                      )}`,
                                  },
                                }}
                                onClick={() =>
                                  navigate(`/profile/${user.username}`)
                                }
                              >
                                {(user.username?.[0] || "").toUpperCase()}
                              </Avatar>
                            </Tooltip>
                            <Box sx={{ minWidth: 140 }}>
                              <Typography
                                sx={{
                                  fontWeight: 600,
                                  fontSize: "0.92rem",
                                  lineHeight: 1.2,
                                  mb: 0.3,
                                }}
                              >
                                {user.firstName && user.lastName
                                  ? `${user.firstName} ${user.lastName}`
                                  : user.username}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.7rem",
                                }}
                              >
                                @{user.username}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell sx={{ py: 1.5 }}>
                          <Typography
                            sx={{
                              fontSize: "0.8rem",
                              color: "text.secondary",
                              maxWidth: 240,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={user.email}
                          >
                            {user.email}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ py: 1.5 }}>
                          <Tooltip
                            title={
                              isProtected
                                ? "Korunan kullanıcı"
                                : "Rolü değiştirmek için tıklayın"
                            }
                            arrow
                          >
                            <span>
                              <StyledChip
                                icon={meta.icon}
                                label={meta.label}
                                size="small"
                                onClick={() =>
                                  !isProtected && handleOpenRoleDialog(user)
                                }
                                sx={{
                                  bgcolor: alpha(meta.main, 0.08),
                                  color: meta.main,
                                  letterSpacing: ".5px",
                                  cursor: isProtected
                                    ? "not-allowed"
                                    : "pointer",
                                  opacity: isProtected ? 0.7 : 1,
                                  "&:hover": !isProtected && {
                                    bgcolor: alpha(meta.main, 0.15),
                                    transform: "translateY(-2px)",
                                  },
                                }}
                              />
                            </span>
                          </Tooltip>
                        </TableCell>

                        <TableCell sx={{ py: 1.5 }}>
                          {isProtected ? (
                            <Chip
                              size="small"
                              label="Protected"
                              color="secondary"
                              variant="outlined"
                              icon={
                                <SecurityRoundedIcon sx={{ fontSize: 16 }} />
                              }
                              sx={{ fontWeight: 600, height: 28 }}
                            />
                          ) : (
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                fontSize: ".7rem",
                              }}
                            >
                              -
                            </Typography>
                          )}
                        </TableCell>
                      </StyledTableRow>
                    );
                  })}

                {isEmpty && (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ py: 8 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <PeopleIcon color="disabled" sx={{ fontSize: 64 }} />
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          fontWeight={600}
                        >
                          Kullanıcı bulunamadı
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {query || roleFilter !== "all"
                            ? "Aradığınız kriterlere uygun kullanıcı bulunamadı"
                            : "Henüz kullanıcı bulunmuyor"}
                        </Typography>
                        {(query || roleFilter !== "all") && (
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
          {!rawLoading && filteredUsers.length > 0 && (
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
                  Toplam {filteredUsers.length} kullanıcı
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Sayfa {currentPage} / {totalPages}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Gösterilen {paginatedUsers.length} kullanıcı
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

        {/* Enhanced Role Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setSelectedUser(null);
            setNewRole("");
          }}
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
              width: "100%",
              maxWidth: 420,
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 800,
              pb: 1,
              pt: 3,
              fontSize: "1.4rem",
              background: (t) =>
                `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "rgba(0, 0, 0, 0)",
            }}
          >
            Rol Değiştir
          </DialogTitle>

          <DialogContent sx={{ pt: 4, pb: 1 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Kullanıcı: <strong>@{selectedUser?.username}</strong>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Yeni rolü seçin:
              </Typography>
            </Box>

            <Select
              fullWidth
              size="small"
              value={newRole || ""}
              onChange={(e) => setNewRole(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  height: 48,
                },
              }}
            >
              <MenuItem value="user">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon sx={{ fontSize: 18 }} />
                  User
                </Box>
              </MenuItem>
              <MenuItem value="editor">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EditIcon sx={{ fontSize: 18 }} />
                  Editör
                </Box>
              </MenuItem>
              <MenuItem value="admin">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AdminPanelSettingsIcon sx={{ fontSize: 18 }} />
                  Admin
                </Box>
              </MenuItem>
            </Select>

            <Alert
              severity="info"
              variant="outlined"
              sx={{
                borderRadius: 3,
                fontSize: 12,
                lineHeight: 1.4,
                mt: 2,
                bgcolor: (t) => alpha(t.palette.info.main, 0.05),
              }}
            >
              Rol değişikliği anında uygulanır ve kullanıcı oturum davranışını
              etkileyebilir.
            </Alert>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button
              onClick={() => {
                setDialogOpen(false);
                setSelectedUser(null);
                setNewRole("");
              }}
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
              variant="contained"
              disabled={!newRole || newRole === selectedUser?.role}
              onClick={handleConfirmRoleChange}
              sx={(t) => ({
                textTransform: "none",
                borderRadius: 3,
                fontWeight: 700,
                px: 3,
                background: `linear-gradient(135deg, ${
                  t.palette.primary.main
                }, ${darken(t.palette.primary.main, 0.2)})`,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 24px ${alpha(t.palette.primary.main, 0.4)}`,
                },
              })}
            >
              Kaydet
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

export default AdminUsersPage;
