import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Skeleton } from "@mui/material";
import { useKeenSlider } from "keen-slider/react";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import "keen-slider/keen-slider.min.css";

const featuredPosts = [
  {
    id: 1,
    title: "MUI Blog Mobil App Yayınlandı!",
    image:
      "https://static0.anpoimages.com/wordpress/wp-content/uploads/2022/06/what-is-google-play-hero.jpg",
    link: "https://play.google.com/",
    isExternal: true,
  },
  {
    id: 2,
    title: "React.js Documentation",
    image:
      "https://media.licdn.com/dms/image/v2/D5612AQHa7xiegv6bgw/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1723760089292?e=2147483647&v=beta&t=evG986J3qcaNKM4sXr-4PulPjJJrTDC-YYobaPZess0",
    link: "https://react.dev/",
    isExternal: true,
  },
  {
    id: 3,
    title: "Material UI Documentation",
    image:
      "https://docs.yavuzlar.org/~gitbook/image?url=https%3A%2F%2F10693534-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FpHJ8OuTO6xpfwqkn7vmg%252Fuploads%252Fgit-blob-3f1365d7005bca7581c54543c0fe115e655a812b%252FMUI.png%3Falt%3Dmedia&width=768&dpr=4&quality=100&sign=34b5b893&sv=2",
    link: "https://mui.com/material-ui/getting-started/",
    isExternal: true,
  },
];

const SliderSkeleton = () => (
  <Box sx={{ position: "relative", mb: 4 }}>
    <Box
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        height: { xs: "400px", sm: "450px", md: "500px" },
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "grey.900" : "grey.100",
      }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        animation="wave"
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: { xs: 3, md: 5 },
          background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
        }}
      >
        <Skeleton
          variant="text"
          width="60%"
          height={60}
          sx={{
            mb: 2,
            bgcolor: "rgba(255,255,255,0.1)",
          }}
        />
      </Box>
    </Box>
  </Box>
);

const HomeSlider = () => {
  const navigate = useNavigate();
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
          img.onerror = () => resolve(); // Hata durumunda da devam et
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

  const handleSlideClick = (post) => {
    if (post.isExternal) {
      window.open(post.link, "_blank", "noopener,noreferrer");
    } else {
      navigate(post.link);
    }
  };

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
            onClick={() => handleSlideClick(post)}
            sx={{
              position: "relative",
              cursor: "pointer",
              "&:hover img": {
                transform: "scale(1.05)",
              },
              "&:hover .slide-overlay": {
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3))",
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
              className="slide-overlay"
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))",
                transition: "background 0.3s ease",
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
                zIndex: 1,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  fontWeight: 700,
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  lineHeight: 1.2,
                }}
              >
                {post.title}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {loaded && instanceRef.current && (
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
            {featuredPosts.map((_, idx) => (
              <Box
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                sx={{
                  width: currentSlide === idx ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  bgcolor:
                    currentSlide === idx ? "primary.main" : alpha("#000", 0.2),
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default HomeSlider;
