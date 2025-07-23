import React from "react";
import { Avatar, Typography, Box, Stack, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AuthorInfo = ({ name, avatar, username, date, readingTime }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    if (username) navigate(`/profile/${username}`);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
      <Avatar
        src={avatar}
        alt={name}
        sx={{
          bgcolor: avatar ? "transparent" : theme.palette.primary.main,
          color: "#fff",
          fontWeight: 600,
          textTransform: "uppercase",
        }}
      >
        {!avatar && name?.charAt(0)}
      </Avatar>

      <Box>
        <Typography
          variant="subtitle2"
          color="primary"
          onClick={handleClick}
          sx={{
            fontWeight: 600,
            cursor: username ? "pointer" : "default",
            textDecoration: username ? "underline" : "none",
            "&:hover": username && { opacity: 0.8 },
          }}
        >
          {name}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {date} • Tahmini okuma süresi: {readingTime} dk
        </Typography>
      </Box>
    </Stack>
  );
};

export default AuthorInfo;
