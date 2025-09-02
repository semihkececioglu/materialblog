import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";

const AboutPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.7)",
        }}
      >
        {/* Profil kısmı */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
        >
          <Avatar
            src="https://live.staticflickr.com/7677/27328457514_1b083fb60d_z.jpg" // 📌 Kendi profil görselini ekleyebilirsin
            sx={{ width: 120, height: 120, mb: 2 }}
          />
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Semih Rahman Keçecioğlu
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Full-Stack Developer • React & Node.js Enthusiast
          </Typography>

          {/* Sosyal medya ikonları */}
          <Box mt={2} display="flex" gap={2}>
            <Tooltip title="GitHub">
              <IconButton
                color="inherit"
                component="a"
                href="https://github.com/username"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="LinkedIn">
              <IconButton
                color="primary"
                component="a"
                href="https://linkedin.com/in/username"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Twitter / X">
              <IconButton
                sx={{ color: "#1DA1F2" }}
                component="a"
                href="https://twitter.com/username"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="E-posta">
              <IconButton
                sx={{ color: "red" }}
                component="a"
                href="mailto:seninmailin@gmail.com"
              >
                <EmailIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Hakkımda metni */}
        <Typography variant="body1" color="text.secondary" paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi
          enim, sollicitudin et ligula at, ullamcorper pellentesque orci. Nam
          nec sapien ut justo ultrices faucibus sit amet vel lorem. Nunc
          malesuada feugiat neque, ut finibus turpis aliquam ac. Curabitur eget
          mollis massa. Etiam vitae sapien id sem mattis congue. Vivamus posuere
          neque risus, a malesuada arcu lacinia in. Vivamus sit amet libero sit
          amet lectus tincidunt lacinia. Maecenas gravida lacinia tellus, eget
          aliquet dui varius ut. Aliquam sed dui ut ligula commodo porta eu a
          quam.
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          Nam consectetur, ipsum ut ornare imperdiet, odio erat gravida magna,
          dapibus convallis libero turpis id dui. Pellentesque at mauris
          dapibus, aliquet mauris ut, ultrices lorem. Quisque rutrum odio id
          tellus blandit ornare. Nam volutpat ornare malesuada. Nullam nec velit
          sed sem dapibus rutrum. In hac habitasse platea dictumst. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Fusce rhoncus semper
          sodales. Etiam mattis, tellus vel semper aliquet, lacus massa mollis
          est, eu blandit nisi magna quis erat. Vivamus a justo sit amet turpis
          tempor pharetra.
        </Typography>
      </Paper>
    </Container>
  );
};

export default AboutPage;
