import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  DialogContentText,
  DialogActions,
  Button,
  Tooltip,
  Container,
  Chip,
} from "@mui/material";
import axios from "axios";
import { alpha } from "@mui/material/styles";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get("https://materialblog-server-production.up.railway.app/api/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Kullanıcılar alınamadı:", err);
        setSnackbar({
          open: true,
          message: "Kullanıcılar yüklenemedi",
          severity: "error",
        });
        setLoading(false);
      });
  };

  const handleRoleSelect = (user, role) => {
    setSelectedUser(user);
    setNewRole(role);
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
          message: "Rol başarıyla güncellendi",
          severity: "success",
        });
        fetchUsers();
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Rol güncellenemedi",
          severity: "error",
        });
      })
      .finally(() => {
        setDialogOpen(false);
        setSelectedUser(null);
        setNewRole("");
      });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setNewRole("");
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <PeopleIcon sx={{ fontSize: 28, color: "primary.main" }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              Kullanıcılar
            </Typography>
            <Chip
              label={`${users.length} kullanıcı`}
              size="small"
              sx={{
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
                fontWeight: 500,
                height: "24px",
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Users Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ py: 2.5, px: 3, fontWeight: 600 }}>
                  Kullanıcı
                </TableCell>
                <TableCell sx={{ py: 2.5, px: 3, fontWeight: 600 }}>
                  İletişim
                </TableCell>
                <TableCell sx={{ py: 2.5, px: 3, fontWeight: 600 }}>
                  Yetki
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => {
                const isProtected = user.username === "semihkececioglu";
                const roleColors = {
                  admin: {
                    light: "#FBE9E7",
                    main: "#FF5722",
                    icon: <AdminPanelSettingsIcon sx={{ fontSize: 18 }} />,
                  },
                  editor: {
                    light: "#E3F2FD",
                    main: "#2196F3",
                    icon: <EditIcon sx={{ fontSize: 18 }} />,
                  },
                  user: {
                    light: "#F5F5F5",
                    main: "#9E9E9E",
                    icon: <PersonIcon sx={{ fontSize: 18 }} />,
                  },
                };

                return (
                  <TableRow
                    key={user._id}
                    sx={{
                      "&:hover": {
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.02),
                      },
                    }}
                  >
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Tooltip
                          title="Profili görüntüle"
                          placement="top"
                          arrow
                          sx={{
                            backgroundColor: "background.paper",
                            "& .MuiTooltip-arrow": {
                              color: "background.paper",
                            },
                          }}
                        >
                          <Avatar
                            src={user.profileImage}
                            sx={{
                              width: 42,
                              height: 42,
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                transform: "scale(1.05)",
                                boxShadow: 2,
                              },
                            }}
                            onClick={() =>
                              navigate(`/profile/${user.username}`)
                            }
                          >
                            {user.username?.[0]?.toUpperCase()}
                          </Avatar>
                        </Tooltip>
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.95rem",
                              color: "text.primary",
                              lineHeight: 1.2,
                              mb: 0.5,
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
                              fontSize: "0.75rem",
                            }}
                          >
                            @{user.username}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.875rem",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          {user.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 3 }}>
                      <Tooltip
                        title={
                          isProtected
                            ? "Bu kullanıcının rolü değiştirilemez"
                            : "Rolü değiştirmek için tıklayın"
                        }
                        arrow
                        placement="left"
                        sx={{
                          "& .MuiTooltip-tooltip": {
                            bgcolor: "background.paper",
                            color: "text.primary",
                            boxShadow: (theme) =>
                              `0 4px 8px ${alpha(
                                theme.palette.common.black,
                                0.1
                              )}`,
                            fontSize: "0.75rem",
                            p: 1,
                            borderRadius: 1,
                          },
                        }}
                      >
                        <Box>
                          <Chip
                            icon={roleColors[user.role].icon}
                            label={user.role.toUpperCase()}
                            size="small"
                            sx={{
                              bgcolor: roleColors[user.role].light,
                              color: roleColors[user.role].main,
                              fontWeight: 500,
                              minWidth: 90,
                              height: 28,
                              cursor: isProtected ? "not-allowed" : "pointer",
                              transition: "all 0.2s ease",
                              "& .MuiChip-icon": {
                                fontSize: 16,
                                mr: 0.5,
                              },
                              "&:hover": !isProtected && {
                                bgcolor: alpha(
                                  roleColors[user.role].light,
                                  0.8
                                ),
                                transform: "translateY(-1px)",
                                boxShadow: 1,
                              },
                            }}
                            onClick={() =>
                              !isProtected && setSelectedUser(user)
                            }
                          />
                        </Box>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Role Change Dialog */}
      <Dialog
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: "100%",
            maxWidth: 400,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Rol Değişikliği
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 2, color: "text.secondary" }}
            >
              {selectedUser?.username} kullanıcısı için yeni rol seçin:
            </Typography>
            <Select
              fullWidth
              value={newRole || selectedUser?.role || ""}
              onChange={(e) => setNewRole(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="editor">Editör</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setSelectedUser(null)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
            }}
          >
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmRoleChange}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
            }}
          >
            Değişikliği Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminUsersPage;
