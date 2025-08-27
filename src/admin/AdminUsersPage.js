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
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";

const ROLE_META = {
  admin: {
    label: "Admin",
    tone: "error",
    light: "#FDECEA",
    main: "#D84315",
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 18 }} />,
  },
  editor: {
    label: "Editör",
    tone: "info",
    light: "#E3F2FD",
    main: "#1976D2",
    icon: <EditIcon sx={{ fontSize: 18 }} />,
  },
  user: {
    label: "User",
    tone: "default",
    light: "#F5F5F5",
    main: "#616161",
    icon: <PersonIcon sx={{ fontSize: 18 }} />,
  },
};

const SKELETON_ROWS = 6;

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
        setSnackbar({
          open: true,
          message: "Rol güncellendi",
          severity: "success",
        });
        fetchUsers();
      })
      .catch(() =>
        setSnackbar({
          open: true,
          message: "Rol güncellenemedi",
          severity: "error",
        })
      )
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

  const isEmpty = !rawLoading && filteredUsers.length === 0;

  return (
    <Container
      maxWidth="lg"
      sx={{ py: { xs: 4, md: 5 }, position: "relative" }}
    >
      {/* Ambient background */}
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

      {/* Header / Toolbar */}
      <Paper
        elevation={0}
        sx={(theme) => ({
          mb: 4,
          p: 3,
          borderRadius: 4,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flex: 1,
            minWidth: 240,
          }}
        >
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
            })}
          >
            <PeopleIcon color="primary" />
          </Box>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.5px",
              }}
            >
              Kullanıcılar
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Rol yönetimi ve kullanıcı listesi
            </Typography>
          </Box>
        </Box>

        <TextField
          size="small"
          placeholder="Ara (isim, kullanıcı, e‑posta)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={(theme) => ({
            minWidth: { xs: "100%", sm: 260 },
            flexShrink: 0,
            "& .MuiOutlinedInput-root": {
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
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setQuery("")}
                  edge="end"
                  aria-label="Temizle"
                >
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Select
          size="small"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          displayEmpty
          sx={(theme) => ({
            minWidth: 140,
            borderRadius: 3,
            background: alpha(theme.palette.background.default, 0.5),
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          })}
          renderValue={(val) =>
            val === "all" ? "Tüm Roller" : ROLE_META[val].label
          }
        >
          <MenuItem value="all">Tüm Roller</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="editor">Editör</MenuItem>
          <MenuItem value="user">User</MenuItem>
        </Select>

        <Chip
          label={`${filteredUsers.length} / ${users.length}`}
          size="small"
          sx={{
            fontWeight: 600,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
            color: "primary.main",
            height: 30,
          }}
        />

        <IconButton
          size="small"
          onClick={() => fetchUsers(false)}
          disabled={refreshing}
          aria-label="Yenile"
          sx={{
            border: "1px solid",
            borderColor: "divider",
            ml: 1,
          }}
        >
          {refreshing ? (
            <CircularProgress size={16} />
          ) : (
            <RestartAltRoundedIcon fontSize="small" />
          )}
        </IconButton>
      </Paper>

      {/* Table Card */}
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
                  İletişim
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, background: "background.paper" }}
                >
                  Rol
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    background: "background.paper",
                    width: 90,
                  }}
                >
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
                        <Skeleton variant="circular" width={42} height={42} />
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
                filteredUsers.map((user) => {
                  const meta = ROLE_META[user.role] || ROLE_META.user;
                  const isProtected = user.username === "semihkececioglu";
                  return (
                    <TableRow
                      key={user._id}
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
                          <Tooltip title="Profili görüntüle" arrow>
                            <Avatar
                              src={user.profileImage}
                              alt={user.username}
                              sx={{
                                width: 44,
                                height: 44,
                                cursor: "pointer",
                                boxShadow: (theme) =>
                                  `0 4px 10px -4px ${alpha(
                                    theme.palette.primary.main,
                                    0.4
                                  )}`,
                                transition: ".25s",
                                "&:hover": { transform: "translateY(-3px)" },
                              }}
                              onClick={() =>
                                navigate(`/profile/${user.username}`)
                              }
                            >
                              {user.username?.[0]?.toUpperCase()}
                            </Avatar>
                          </Tooltip>
                          <Box sx={{ minWidth: 140 }}>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.95rem",
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
                            fontSize: "0.83rem",
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
                            <Chip
                              icon={meta.icon}
                              label={meta.label.toUpperCase()}
                              size="small"
                              onClick={() =>
                                !isProtected && handleOpenRoleDialog(user)
                              }
                              sx={{
                                bgcolor: alpha(meta.main, 0.08),
                                color: meta.main,
                                fontWeight: 600,
                                letterSpacing: ".5px",
                                cursor: isProtected ? "not-allowed" : "pointer",
                                transition: ".25s",
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
                            icon={<SecurityRoundedIcon sx={{ fontSize: 16 }} />}
                            sx={{ fontWeight: 600 }}
                          />
                        ) : (
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary", fontSize: ".7rem" }}
                          >
                            -
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}

              {isEmpty && (
                <TableRow>
                  <TableCell colSpan={4} sx={{ py: 6 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        opacity: 0.75,
                      }}
                    >
                      <TuneRoundedIcon color="disabled" sx={{ fontSize: 48 }} />
                      <Typography variant="body2" color="text.secondary">
                        Kriterlere uygun kullanıcı bulunamadı.
                      </Typography>
                      {(query || roleFilter !== "all") && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setQuery("");
                            setRoleFilter("all");
                          }}
                          sx={{ borderRadius: 2 }}
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
            Toplam {users.length} kullanıcı listelendi.
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Seçim: {filteredUsers.length}
          </Typography>
        </Box>
      </Paper>

      {/* Role Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedUser(null);
          setNewRole("");
        }}
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
            Rol Değiştir
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedUser?.username}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1.5, color: "text.secondary", fontWeight: 500 }}
          >
            Yeni rolü seçin:
          </Typography>

          <ToggleButtonGroup
            value={newRole}
            exclusive
            onChange={(_, val) => val && setNewRole(val)}
            fullWidth
            sx={(theme) => ({
              mb: 3,
              gap: 1,
              "& .MuiToggleButton-root": {
                flex: 1,
                borderRadius: 3 + " !important",
                border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
                textTransform: "none",
                fontWeight: 600,
                letterSpacing: ".5px",
                "&.Mui-selected": {
                  background: alpha(theme.palette.primary.main, 0.15),
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                  color: theme.palette.primary.main,
                },
              },
            })}
          >
            <ToggleButton value="user">User</ToggleButton>
            <ToggleButton value="editor">Editör</ToggleButton>
            <ToggleButton value="admin">Admin</ToggleButton>
          </ToggleButtonGroup>

          <Select
            fullWidth
            size="small"
            value={newRole || ""}
            onChange={(e) => setNewRole(e.target.value)}
            sx={{
              borderRadius: 3,
              mb: 2,
              "& .MuiOutlinedInput-root": { borderRadius: 3 },
            }}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="editor">Editör</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>

          <Alert
            severity="info"
            variant="outlined"
            sx={{ borderRadius: 3, fontSize: 12, lineHeight: 1.4 }}
          >
            Rol değişikliği anında uygulanır ve kullanıcı oturum davranışını
            etkileyebilir.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => {
              setDialogOpen(false);
              setSelectedUser(null);
              setNewRole("");
            }}
            sx={{ textTransform: "none", borderRadius: 3 }}
          >
            İptal
          </Button>
          <Button
            variant="contained"
            disabled={!newRole || newRole === selectedUser?.role}
            onClick={handleConfirmRoleChange}
            sx={{ textTransform: "none", borderRadius: 3, fontWeight: 600 }}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3200}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ borderRadius: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminUsersPage;
