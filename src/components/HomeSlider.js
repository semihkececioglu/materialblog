import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Box, Typography, IconButton, Skeleton } from "@mui/material";
import { useKeenSlider } from "keen-slider/react";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

const featuredPosts = [
  {
    id: 1,
    title: "MUI Blog Mobil App Yayınlandı!",
    image:
      "https://play-lh.googleusercontent.com/020GnyVJKboBRDyZ9Oe4pfigwkm8Mq1_SO0br0Lk6-eQhiRHXeJ5dFH6-JI3DQSx3QkGpOYKTmZu=w1296-h2160-rw",
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

const HomeSlider = React.memo(() => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized slider configuration
  const sliderConfig = useMemo(
    () => ({
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
    }),
    []
  );

  const [sliderRef, instanceRef] = useKeenSlider(sliderConfig);

  // Optimized image preloading
  useEffect(() => {
    const preloadImages = () => {
      let loadedCount = 0;
      const totalImages = featuredPosts.length;

      featuredPosts.forEach((post) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setIsLoading(false);
          }
        };
        img.src = post.image;
      });
    };

    // Start preloading immediately
    preloadImages();
  }, []);

  // Memoized click handler
  const handleSlideClick = useCallback(
    (post) => {
      if (post.isExternal) {
        window.open(post.link, "_blank", "noopener,noreferrer");
      } else {
        navigate(post.link);
      }
    },
    [navigate]
  );

  // Memoized navigation handlers
  const handlePrev = useCallback(() => {
    instanceRef.current?.prev();
  }, [instanceRef]);

  const handleNext = useCallback(() => {
    instanceRef.current?.next();
  }, [instanceRef]);

  const handleDotClick = useCallback(
    (idx) => {
      instanceRef.current?.moveToIdx(idx);
    },
    [instanceRef]
  );

  // Memoized styles - Fixed container size
  const containerStyles = useMemo(
    () => ({
      position: "relative",
      mb: 4,
      height: { xs: "440px", sm: "490px", md: "540px" }, // Fixed height
      minHeight: { xs: "440px", sm: "490px", md: "540px" }, // Prevent collapse
    }),
    []
  );

  const sliderStyles = useMemo(
    () => ({
      borderRadius: 3,
      overflow: "hidden",
      height: { xs: "400px", sm: "450px", md: "500px" },
      width: "100%",
    }),
    []
  );

  const skeletonContainerStyles = useMemo(
    () => ({
      ...sliderStyles,
      bgcolor: (theme) =>
        theme.palette.mode === "dark" ? "grey.900" : "grey.100",
      position: "relative",
    }),
    [sliderStyles]
  );

  const buttonStyles = useMemo(
    () => ({
      position: "absolute",
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
    }),
    []
  );

  const dotsContainerStyles = useMemo(
    () => ({
      display: "flex",
      justifyContent: "center",
      gap: 1,
      mt: 2,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 32, // Fixed height for dots
    }),
    []
  );

  // Always render with fixed container - no layout shift
  return (
    <Box sx={containerStyles}>
      {isLoading ? (
        // Loading state - same dimensions as real content
        <>
          <Box sx={skeletonContainerStyles}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
              sx={{ borderRadius: 3 }}
            />

            {/* Skeleton overlay with text */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                p: { xs: 3, md: 5 },
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                zIndex: 1,
              }}
            >
              <Skeleton
                variant="text"
                width="60%"
                height={60}
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                }}
              />
            </Box>
          </Box>

          {/* Skeleton Buttons - same position */}
          <Skeleton
            variant="circular"
            sx={{
              ...buttonStyles,
              left: { xs: 8, md: 16 },
              bgcolor: "rgba(255, 255, 255, 0.1)",
              position: "absolute",
            }}
          />
          <Skeleton
            variant="circular"
            sx={{
              ...buttonStyles,
              right: { xs: 8, md: 16 },
              bgcolor: "rgba(255, 255, 255, 0.1)",
              position: "absolute",
            }}
          />

          {/* Skeleton Dots - fixed position */}
          <Box sx={dotsContainerStyles}>
            {featuredPosts.map((_, idx) => (
              <Skeleton
                key={idx}
                variant="rounded"
                width={idx === 0 ? 24 : 8}
                height={8}
                sx={{
                  borderRadius: 4,
                  bgcolor: "rgba(0,0,0,0.1)",
                }}
              />
            ))}
          </Box>
        </>
      ) : (
        // Loaded state - same dimensions
        <>
          <Box ref={sliderRef} className="keen-slider" sx={sliderStyles}>
            {featuredPosts.map((post) => (
              <SliderSlide
                key={post.id}
                post={post}
                onClick={handleSlideClick}
              />
            ))}
          </Box>

          {loaded && instanceRef.current && (
            <>
              {/* Navigation Buttons */}
              <IconButton
                onClick={handlePrev}
                aria-label="Önceki slayt"
                sx={{ ...buttonStyles, left: { xs: 8, md: 16 } }}
              >
                <NavigateBeforeIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
              </IconButton>

              <IconButton
                onClick={handleNext}
                aria-label="Sonraki slayt"
                sx={{ ...buttonStyles, right: { xs: 8, md: 16 } }}
              >
                <NavigateNextIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
              </IconButton>

              {/* Dots Navigation */}
              <Box sx={dotsContainerStyles}>
                {featuredPosts.map((_, idx) => (
                  <Box
                    key={idx}
                    role="button"
                    aria-label={`${idx + 1}. slayta git`}
                    onClick={() => handleDotClick(idx)}
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
                ))}
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
});

const SliderSlide = React.memo(({ post, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(post);
  }, [onClick, post]);

  const slideStyles = useMemo(
    () => ({
      position: "relative",
      cursor: "pointer",
      "&:hover img": {
        transform: "scale(1.05)",
      },
      "&:hover .slide-overlay": {
        background: "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3))",
      },
    }),
    []
  );

  const imageStyles = useMemo(
    () => ({
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.6s ease",
    }),
    []
  );

  const overlayStyles = useMemo(
    () => ({
      position: "absolute",
      inset: 0,
      background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))",
      transition: "background 0.3s ease",
    }),
    []
  );

  const textContainerStyles = useMemo(
    () => ({
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      p: { xs: 3, md: 5 },
      color: "white",
      zIndex: 1,
    }),
    []
  );

  const titleStyles = useMemo(
    () => ({
      fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
      fontWeight: 700,
      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
      lineHeight: 1.2,
    }),
    []
  );

  return (
    <Box className="keen-slider__slide" onClick={handleClick} sx={slideStyles}>
      <Box
        component="img"
        src={post.image}
        alt={post.title}
        loading="eager"
        sx={imageStyles}
      />

      <Box className="slide-overlay" sx={overlayStyles} />

      <Box sx={textContainerStyles}>
        <Typography variant="h3" sx={titleStyles}>
          {post.title}
        </Typography>
      </Box>
    </Box>
  );
});

HomeSlider.displayName = "HomeSlider";
export default HomeSlider;
