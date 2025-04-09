import React from "react";
import { Avatar, Typography, Box, Stack } from "@mui/material";

const AuthorInfo = ({ name, avatar, date, readingTime }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
      <Avatar src={avatar} alt={name} />
      <Box>
        <Typography variant="subtitle2" color="text.primary">
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
