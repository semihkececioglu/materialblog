import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import {
  Box,
  Typography,
  IconButton,
  Skeleton,
  useTheme,
  Tooltip,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useLazyCss from "../hooks/useLazyCss";

const HomeSlider = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef();
  const theme = useTheme();
  const navigate = useNavigate();

  // CSS lazy load
  useLazyCss(() => import("slick-carousel/slick/slick.css"));
  useLazyCss(() => import("slick-carousel/slick/slick-theme.css"));

  // Slider verileri
  useEffect(() => {
    axios
      .get(
        "https://materialblog-server-production.up.railway.app/api/posts?limit=6"
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

  // OptimizedImage bileşenini güncelleyelim
  const OptimizedImage = ({ post, index }) => {
    const imageUrl = post.image
      ? `${post.image.replace(
          "/upload/",
          "/upload/w_800,f_auto,q_auto:good,c_fill/"
        )}`
      : "/default.jpg";

    return (
      <Box
        component="img"
        src={imageUrl}
        alt={post.title}
        loading={index === 0 ? "eager" : "lazy"}
        fetchpriority={index === 0 ? "high" : "auto"}
        width="800"
        height="450"
        decoding="async"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.3s ease",
          display: "block",
        }}
      />
    );
  };

  // Settings'i güncelleyelim
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 400,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }],
    appendDots: (dots) => (
      <Box
        component="ul"
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 0.5,
          mt: 3,
          mb: -1,
          listStyle: "none",
          p: 0,
        }}
      >
        {dots}
      </Box>
    ),
    customPaging: () => (
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      />
    ),
    initialSlide: 0,
    lazyLoad: null, // React-slick'in lazy load'unu kaldırıyoruz
    autoplaySpeed: 6000,
    pauseOnHover: true,
  };

  // 📌 Loading Skeleton
  if (loading) {
    return (
      <Box
        sx={{
          position: "relative",
          borderRadius: 4,
          overflow: "hidden",
          px: 2,
          py: 4,
          mb: 6,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.02)"
              : "rgba(255,255,255,0.4)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          {[0, 1].map((i) => (
            <Box key={i} sx={{ flex: 1 }}>
              <Skeleton
                variant="rectangular"
                height={240}
                animation="wave"
                sx={{ borderRadius: 3 }}
              />
              <Skeleton
                variant="rounded"
                height={36}
                width="70%"
                animation="wave"
                sx={{ mt: 1.5, borderRadius: 2 }}
              />
            </Box>
          ))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 1 }}>
          {[0, 1, 2].map((d) => (
            <Skeleton
              key={d}
              variant="circular"
              width={8}
              height={8}
              animation="wave"
            />
          ))}
        </Box>
      </Box>
    );
  }

  if (!posts?.length) return null;

  // 📌 Slider render
  return (
    <Box
      component="section" // Semantic HTML için
      sx={{
        position: "relative",
        borderRadius: 4,
        overflow: "hidden",
        px: 2,
        py: 4,
        mb: 6,
        bgcolor:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.02)"
            : "rgba(255,255,255,0.4)",
      }}
    >
      {/* Arrows */}
      <Tooltip title="Önceki">
        <IconButton
          aria-label="Önceki slayt"
          onClick={() => sliderRef.current?.slickPrev()}
          sx={{
            position: "absolute",
            top: "50%",
            left: 8,
            transform: "translateY(-50%)",
            zIndex: 2,
            bgcolor: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(6px)",
            width: 36,
            height: 36,
            "&:hover": { bgcolor: "rgba(255,255,255,0.5)" },
          }}
        >
          <ArrowBackIos sx={{ fontSize: "16px", ml: "1px" }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Sonraki">
        <IconButton
          aria-label="Sonraki slayt"
          onClick={() => sliderRef.current?.slickNext()}
          sx={{
            position: "absolute",
            top: "50%",
            right: 8,
            transform: "translateY(-50%)",
            zIndex: 2,
            bgcolor: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(6px)",
            width: 36,
            height: 36,
            "&:hover": { bgcolor: "rgba(255,255,255,0.5)" },
          }}
        >
          <ArrowForwardIos sx={{ fontSize: "16px", mr: "1px" }} />
        </IconButton>
      </Tooltip>

      {/* Slider */}
      <Slider ref={sliderRef} {...settings}>
        {posts.map((post, index) => (
          <Box
            key={post._id}
            onClick={() => navigate(`/post/${post.slug}`)}
            sx={{
              px: 1,
              cursor: "pointer",
              height: 240,
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "relative",
                height: "100%",
                borderRadius: 3,
                overflow: "hidden",
                "&:hover img": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <OptimizedImage post={post} index={index} />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 2,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: "#fff",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    lineHeight: 1.3,
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                  }}
                >
                  {post.title}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default HomeSlider;
