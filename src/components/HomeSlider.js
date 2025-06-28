import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  useTheme,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Link } from "react-router-dom";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomeSlider = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef();
  const theme = useTheme();

  useEffect(() => {
    axios
      .get(
        "https://materialblog-server-production.up.railway.app/api/posts?limit=5"
      )
      .then((res) => {
        setPosts(res.data.posts || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Slider yazıları alınamadı:", err);
        setLoading(false);
      });
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: false,
    customPaging: () => (
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.5)",
          margin: "0 5px",
        }}
      />
    ),
    appendDots: (dots) => (
      <Box
        component="ul"
        sx={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex !important",
          justifyContent: "center",
          p: 0,
          m: 0,
          listStyle: "none",
          zIndex: 3,
        }}
      >
        {dots}
      </Box>
    ),
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{ position: "relative", mb: 4, borderRadius: 3, overflow: "hidden" }}
    >
      {/* Custom Arrows */}
      <IconButton
        onClick={() => sliderRef.current?.slickPrev()}
        sx={{
          position: "absolute",
          top: "50%",
          left: 16,
          zIndex: 2,
          transform: "translateY(-50%)",
          bgcolor: "rgba(255,255,255,0.25)",
          backdropFilter: "blur(6px)",
          "&:hover": { bgcolor: "rgba(255,255,255,0.4)" },
          width: 40,
          height: 40,
        }}
      >
        <ArrowBackIos sx={{ fontSize: "16px", ml: "2px" }} />
      </IconButton>

      <IconButton
        onClick={() => sliderRef.current?.slickNext()}
        sx={{
          position: "absolute",
          top: "50%",
          right: 16,
          zIndex: 2,
          transform: "translateY(-50%)",
          bgcolor: "rgba(255,255,255,0.25)",
          backdropFilter: "blur(6px)",
          "&:hover": { bgcolor: "rgba(255,255,255,0.4)" },
          width: 40,
          height: 40,
        }}
      >
        <ArrowForwardIos sx={{ fontSize: "16px", mr: "2px" }} />
      </IconButton>

      {/* Slider */}
      <Slider ref={sliderRef} {...settings}>
        {posts.map((post) => (
          <Box
            key={post._id}
            sx={{
              height: { xs: 220, sm: 300, md: 420 },
              position: "relative",
            }}
          >
            {/* Background */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${post.image || "/default.jpg"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "brightness(0.6)",
              }}
            />

            {/* Glass Content */}
            <Box
              sx={{
                position: "absolute",
                bottom: 32,
                left: 32,
                zIndex: 2,
                px: 3,
                py: 2,
                borderRadius: 3,
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                color: "#fff",
                maxWidth: "70%",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
              >
                {post.title}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                component={Link}
                to={`/post/${post.slug}`}
                sx={{
                  mt: 1,
                  color: "#fff",
                  borderColor: "#fff",
                  textTransform: "none",
                  backdropFilter: "blur(2px)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.2)",
                    borderColor: "#fff",
                  },
                }}
              >
                Yazıyı Oku
              </Button>
            </Box>
          </Box>
        ))}
      </Slider>

      {/* Dot stil override */}
      <style>
        {`
        .slick-dots li.slick-active div {
          background-color: ${theme.palette.primary.main} !important;
          transform: scale(1.4);
        }
      `}
      </style>
    </Box>
  );
};

export default HomeSlider;
