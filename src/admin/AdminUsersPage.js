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
} from "@mui/material";
import axios from "axios";

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
    <Box>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: "bold",
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        Kullanıcılar
      </Typography>

      <Paper
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(10px)",
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
                <TableCell>
                  <strong>Kullanıcı Adı</strong>
                </TableCell>
                <TableCell>
                  <strong>Ad Soyad</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Rol</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => {
                const isProtected = user.username === "semihkececioglu";

                return (
                  <TableRow
                    key={user._id}
                    sx={{
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar
                          src={user.profileImage}
                          alt={user.username}
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: "primary.main",
                          }}
                        >
                          {user.username?.[0]?.toUpperCase()}
                        </Avatar>
                        <Tooltip title="Profili Gör" arrow>
                          <Typography
                            sx={{
                              cursor: "pointer",
                              "&:hover": {
                                textDecoration: "underline",
                                color: "primary.main",
                              },
                            }}
                            onClick={() =>
                              navigate(`/profile/${user.username}`)
                            }
                          >
                            {user.username}
                          </Typography>
                        </Tooltip>
                      </Box>
                    </TableCell>

                    <TableCell>
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : "-"}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Tooltip
                        title={
                          isProtected
                            ? "Bu kullanıcının rolü değiştirilemez"
                            : ""
                        }
                        arrow
                        placement="top"
                      >
                        <span>
                          <Select
                            value={user.role}
                            size="small"
                            onChange={(e) =>
                              handleRoleSelect(user, e.target.value)
                            }
                            disabled={isProtected}
                          >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="editor">Editör</MenuItem>
                          </Select>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            borderRadius: 3,
            p: 2,
          },
        }}
      >
        <DialogTitle>Rol Değişikliği Onayı</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>{selectedUser?.username}</strong> kullanıcısının rolünü{" "}
            <strong>{newRole}</strong> olarak değiştirmek istediğinizden emin
            misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="inherit">
            İptal
          </Button>
          <Button
            onClick={handleConfirmRoleChange}
            variant="contained"
            color="primary"
          >
            Evet, Değiştir
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
    </Box>
  );
};

export default AdminUsersPage;
