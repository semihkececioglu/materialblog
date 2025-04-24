// components/CommentForm.js
import React from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

const CommentForm = ({
  name,
  email,
  comment,
  onNameChange,
  onEmailChange,
  onCommentChange,
  onSubmit,
  isReply = false,
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mt: isReply ? 1 : 3,
        mb: isReply ? 1 : 4,
        borderRadius: 2,
        backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f9f9f9",
      }}
    >
      {!isReply && (
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          Yorum Yap
        </Typography>
      )}

      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Ad"
            value={name}
            onChange={onNameChange}
            required
            fullWidth
          />
          <TextField
            label="E-posta"
            value={email}
            onChange={onEmailChange}
            required
            fullWidth
          />
        </Box>

        <TextField
          label="Yorumunuz"
          value={comment}
          onChange={onCommentChange}
          required
          fullWidth
          multiline
          minRows={3}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" size="small" type="submit">
            Gönder
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CommentForm;
