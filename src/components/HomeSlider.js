import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useKeenSlider } from "keen-slider/react";
import { alpha } from "@mui/material/styles";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import "keen-slider/keen-slider.min.css";

const featuredPosts = [
  {
    id: 1,
    title: "Modern Web Development: Best Practices for 2023",
    image:
      "https://res.cloudinary.com/da2mjic2e/image/upload/v1755797318/The-Starry-Night-Vincent-van-Gogh_iw0tvv.jpg",
    category: "Development",
    author: {
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    date: "August 21, 2023",
  },
  {
    id: 2,
    title: "Modern Web Development: Best Practices for 2023",
    image:
      "https://res.cloudinary.com/da2mjic2e/image/upload/v1755797318/The-Starry-Night-Vincent-van-Gogh_iw0tvv.jpg",
    category: "Development",
    author: {
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    date: "August 21, 2023",
  },
  {
    id: 3,
    title: "Modern Web Development: Best Practices for 2023",
    image:
      "https://res.cloudinary.com/da2mjic2e/image/upload/v1755797318/The-Starry-Night-Vincent-van-Gogh_iw0tvv.jpg",
    category: "Development",
    author: {
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    date: "August 21, 2023",
  },
];

const SliderSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component="section"
      aria-label="Loading featured posts"
      sx={{ position: "relative", mb: 4 }}
    >
      <Box
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          height: { xs: "300px", sm: "450px", md: "500px" },
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "grey.900" : "grey.100",
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{
            transform: "none",
            transformOrigin: "0 0",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: { xs: 2, sm: 3, md: 5 },
            background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
          }}
        >
          <Skeleton
            variant="text"
            width={isMobile ? "90%" : "60%"}
            height={isMobile ? 40 : 60}
            sx={{
              mb: { xs: 1, sm: 2 },
              bgcolor: "rgba(255,255,255,0.1)",
              transform: "none",
              transformOrigin: "0 0",
            }}
          />
          {!isMobile && (
            <Skeleton
              variant="text"
              width="40%"
              height={24}
              sx={{
                bgcolor: "rgba(255,255,255,0.1)",
                transform: "none",
              }}
            />
          )}
        </Box>
      </Box>

      {/* Skeleton Navigation Dots */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          mt: 2,
        }}
      >
        {[...Array(3)].map((_, idx) => (
          <Skeleton
            key={idx}
            variant="rectangular"
            width={idx === 0 ? 24 : 8}
            height={8}
            sx={{
              borderRadius: 4,
              bgcolor: idx === 0 ? "primary.main" : "rgba(255,255,255,0.1)",
              transform: "none",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

const HomeSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    loop: true,
    mode: "snap",
    slides: { perView: 1 },
  });

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = featuredPosts.map((post) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            setImagesLoaded((prev) => prev + 1);
            resolve();
          };
          img.src = post.image;
        });
      });

      await Promise.all(imagePromises);
      setIsLoading(false);
    };

    loadImages();

    return () => {
      setImagesLoaded(0);
      setIsLoading(true);
    };
  }, []);

  if (isLoading) {
    return <SliderSkeleton />;
  }

  return (
    <Box sx={{ position: "relative", mb: 4 }}>
      <Box
        ref={sliderRef}
        className="keen-slider"
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          height: { xs: "400px", sm: "450px", md: "500px" },
        }}
      >
        {featuredPosts.map((post) => (
          <Box
            key={post.id}
            className="keen-slider__slide"
            sx={{
              position: "relative",
              "&:hover img": {
                transform: "scale(1.05)",
              },
            }}
          >
            <Box
              component="img"
              src={post.image}
              alt={post.title}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.6s ease",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                p: { xs: 3, md: 5 },
                color: "white",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  fontWeight: 700,
                  mb: 2,
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {post.title}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar src={post.author.avatar} />
                <Box>
                  <Typography sx={{ fontWeight: 500 }}>
                    {post.author.name}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {post.date}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {loaded && (
        <>
          <IconButton
            onClick={() => instanceRef.current?.prev()}
            sx={{
              position: "absolute",
              left: { xs: 8, md: 16 },
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(4px)",
              color: "white",
              zIndex: 2,
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.25)",
              },
              width: { xs: 40, md: 48 },
              height: { xs: 40, md: 48 },
            }}
          >
            <NavigateBeforeIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
          </IconButton>

          <IconButton
            onClick={() => instanceRef.current?.next()}
            sx={{
              position: "absolute",
              right: { xs: 8, md: 16 },
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(4px)",
              color: "white",
              zIndex: 2,
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.25)",
              },
              width: { xs: 40, md: 48 },
              height: { xs: 40, md: 48 },
            }}
          >
            <NavigateNextIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              mt: 2,
            }}
          >
            {[...Array(instanceRef.current.track.details.slides.length)].map(
              (_, idx) => (
                <Box
                  key={idx}
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                  sx={{
                    width: currentSlide === idx ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    bgcolor:
                      currentSlide === idx
                        ? "primary.main"
                        : alpha("#000", 0.2),
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              )
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default HomeSlider;
