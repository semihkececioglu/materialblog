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

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 600,
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
            sx={{ px: 1, cursor: "pointer" }}
          >
            <Box
              sx={{
                position: "relative",
                height: 240,
                borderRadius: 3,
                overflow: "hidden",
                "&:hover .slider-img": {
                  filter: "blur(4px)",
                  transform: "scale(1.05)",
                },
              }}
            >
              <Box
                component="img"
                src={post.image || "/default.jpg"}
                alt={post.title}
                className="slider-img"
                loading={index === 0 ? "eager" : "lazy"} // ✅ İlk görsel hemen yüklenir
                fetchpriority={index === 0 ? "high" : "auto"} // ✅ İlk görsele yüksek öncelik
                decoding="async"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "all 0.4s ease",
                  borderRadius: 3,
                  display: "block",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  right: 16,
                  bgcolor: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(6px)",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color="#fff"
                  noWrap
                >
                  {post.title}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>

      {/* Aktif dot rengi */}
      <style>{`
        .slick-dots li.slick-active div {
          background-color: ${theme.palette.primary.main} !important;
          transform: scale(1.3);
        }
      `}</style>
    </Box>
  );
};

export default HomeSlider;
