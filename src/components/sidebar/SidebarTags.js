import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Box, Typography, Paper, Chip, Skeleton } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import slugify from "../../utils/slugify";
import axios from "axios";
import { BASE_URL } from "../../config";

// Cache için global variable
let cachedTags = null;
let cacheTime = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 dakika cache (artırıldı)

const SidebarTags = React.memo(() => {
  const [tags, setTags] = useState(cachedTags || []);
  const [loading, setLoading] = useState(!cachedTags);
  const [error, setError] = useState(false);
  const location = useLocation();
  const mountedRef = useRef(true);

  // Component unmount olduğunda ref'i false yap
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Memoized tag colors
  const tagColors = useMemo(
    () => ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"],
    []
  );

  // Memoized styles - boşluğu minimize et
  const paperStyles = useMemo(
    () => ({
      p: 2,
      mt: 3,
      borderRadius: 2,
      bgcolor: (theme) =>
        theme.palette.mode === "dark"
          ? alpha(theme.palette.background.paper, 0.4)
          : alpha(theme.palette.background.paper, 0.85),
      backdropFilter: "blur(12px)",
      border: "1px solid",
      borderColor: "divider",
      transition: "all 0.3s ease",
      "&:hover": {
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.5)
            : alpha(theme.palette.background.paper, 0.95),
        transform: "translateY(-1px)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      },
      // minHeight kaldırıldı - doğal yükseklik kullanılacak
    }),
    []
  );

  const headerStyles = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      gap: 1,
      mb: 2,
    }),
    []
  );

  // Content styles - minHeight kaldırıldı
  const contentStyles = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: 0.75,
      mb: 1, // Content'ten sonra küçük margin
    }),
    []
  );

  // Memoized tag item - Hooks'ları conditional return'lerden önce tanımla
  const TagItem = useMemo(
    () =>
      React.memo(({ tag, index }) => {
        const tagStyles = useMemo(
          () => ({
            display: "inline-flex",
            alignItems: "center",
            gap: 0.25,
            height: 24,
            px: 0.5,
            borderRadius: 1.5,
            textDecoration: "none",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? alpha(tag.color, 0.12)
                : alpha(tag.color, 0.08),
            border: "1px solid",
            borderColor: (theme) =>
              theme.palette.mode === "dark"
                ? alpha(tag.color, 0.25)
                : alpha(tag.color, 0.2),
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background: `linear-gradient(90deg, transparent, ${alpha(
                tag.color,
                0.1
              )}, transparent)`,
              transition: "left 0.5s ease",
            },
            "&:hover": {
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? alpha(tag.color, 0.2)
                  : alpha(tag.color, 0.15),
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? alpha(tag.color, 0.4)
                  : alpha(tag.color, 0.35),
              transform: "translateY(-1px) scale(1.02)",
              boxShadow: `0 6px 20px ${alpha(tag.color, 0.2)}`,
              "&::before": {
                left: "100%",
              },
            },
            "&:active": {
              transform: "translateY(0) scale(1.01)",
            },
          }),
          [tag.color]
        );

        return (
          <Box component={Link} to={`/tag/${slugify(tag.name)}`} sx={tagStyles}>
            <Typography
              component="span"
              sx={{
                fontSize: "0.65rem",
                fontWeight: 600,
                color: "text.primary",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              #{tag.name}
            </Typography>
            <Box
              sx={{
                minWidth: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? alpha(tag.color, 0.3)
                    : alpha(tag.color, 0.2),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${alpha(tag.color, 0.4)}`,
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  color: tag.color,
                  lineHeight: 1,
                }}
              >
                {tag.count || 0}
              </Typography>
            </Box>
          </Box>
        );
      }),
    []
  );

  // Optimized fetch with better caching
  const fetchPopularTags = useCallback(
    async (force = false) => {
      // Improved cache logic
      if (
        !force &&
        cachedTags &&
        cacheTime &&
        Date.now() - cacheTime < CACHE_DURATION
      ) {
        if (mountedRef.current) {
          setTags(cachedTags);
          setLoading(false);
        }
        return;
      }

      try {
        if (mountedRef.current) {
          setLoading(true);
          setError(false);
        }

        // AbortController for cleanup
        const controller = new AbortController();
        const response = await axios.get(`${BASE_URL}/api/tags/popular`, {
          signal: controller.signal,
          timeout: 5000, // 5 second timeout
        });

        // Component hala mount edilmiş mi kontrol et
        if (!mountedRef.current) return;

        // Veri kontrolü
        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const tagsWithColors = response.data.map((tag, index) => ({
            ...tag,
            color: tagColors[index % tagColors.length],
          }));

          // Cache'e kaydet
          cachedTags = tagsWithColors;
          cacheTime = Date.now();

          if (mountedRef.current) {
            setTags(tagsWithColors);
          }
        } else {
          console.warn("Geçersiz veri formatı:", response.data);
          if (mountedRef.current) {
            setTags([]);
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Tags fetch error:", err);
          if (mountedRef.current) {
            setError(true);
            setTags([]);
          }
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [tagColors]
  );

  // İlk yüklemede ve route değişimlerinde
  useEffect(() => {
    fetchPopularTags();
  }, [fetchPopularTags]);

  // Route değişimlerinde cache'i kontrol et
  useEffect(() => {
    if (cachedTags && cachedTags.length > 0) {
      setTags(cachedTags);
      setLoading(false);
      setError(false);
    }
  }, [location.pathname]);

  // Retry fonksiyonu
  const handleRetry = useCallback(() => {
    cachedTags = null;
    cacheTime = null;
    fetchPopularTags(true);
  }, [fetchPopularTags]);

  // Loading skeleton - paperStyles'da minHeight yok artık
  if (loading && (!tags || tags.length === 0)) {
    return (
      <Paper elevation={0} sx={paperStyles}>
        <Box sx={headerStyles}>
          <Box
            sx={{
              width: 3,
              height: 16,
              borderRadius: 0.5,
              bgcolor: "primary.main",
            }}
          />
          <Typography
            component="h2"
            variant="h3"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              fontSize: "1rem",
            }}
          >
            Etiketler
          </Typography>
        </Box>

        <Box sx={contentStyles}>
          {Array.from({ length: 2 }).map((_, rowIndex) => (
            <Box
              key={rowIndex}
              sx={{ display: "flex", gap: 0.75, justifyContent: "flex-start" }}
            >
              {Array.from({ length: 3 }).map((_, colIndex) => (
                <Box
                  key={colIndex}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.25,
                    height: 24,
                    px: 0.5,
                    borderRadius: 1.5,
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                    border: (t) =>
                      `1px solid ${alpha(t.palette.primary.main, 0.2)}`,
                  }}
                >
                  <Skeleton
                    variant="text"
                    width={Math.random() * 20 + 25}
                    height={12}
                    sx={{ borderRadius: 1 }}
                  />
                  <Skeleton variant="circular" width={12} height={12} />
                </Box>
              ))}
            </Box>
          ))}
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            fontStyle: "italic",
            textAlign: "center",
            opacity: 0.4,
            // mt kaldırıldı
          }}
        >
          Yükleniyor...
        </Typography>
      </Paper>
    );
  }

  // Error state
  if (error && (!tags || tags.length === 0)) {
    return (
      <Paper elevation={0} sx={paperStyles}>
        <Box sx={headerStyles}>
          <Box
            sx={{
              width: 3,
              height: 16,
              borderRadius: 0.5,
              bgcolor: "primary.main",
            }}
          />
          <Typography
            component="h2"
            variant="h3"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              fontSize: "1rem",
            }}
          >
            Etiketler
          </Typography>
        </Box>

        <Box sx={{ ...contentStyles, justifyContent: "center" }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: "italic", mb: 1, textAlign: "center" }}
          >
            Etiketler yüklenemedi
          </Typography>
          <Typography
            variant="caption"
            color="primary.main"
            sx={{
              cursor: "pointer",
              textDecoration: "underline",
              textAlign: "center",
              "&:hover": { opacity: 0.8 },
            }}
            onClick={handleRetry}
          >
            Tekrar dene
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Empty state
  if (!tags || tags.length === 0) {
    return (
      <Paper elevation={0} sx={paperStyles}>
        <Box sx={headerStyles}>
          <Box
            sx={{
              width: 3,
              height: 16,
              borderRadius: 0.5,
              bgcolor: "primary.main",
            }}
          />
          <Typography
            component="h2"
            variant="h3"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              fontSize: "1rem",
            }}
          >
            Etiketler
          </Typography>
        </Box>

        <Box sx={{ ...contentStyles, justifyContent: "center" }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: "italic", textAlign: "center" }}
          >
            Henüz etiket bulunmuyor
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={paperStyles}>
      <Box sx={headerStyles}>
        <Box
          sx={{
            width: 3,
            height: 16,
            borderRadius: 0.5,
            bgcolor: "primary.main",
            transition: "all 0.3s ease",
          }}
        />
        <Typography
          component="h2"
          variant="h3"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            fontSize: "1rem",
          }}
        >
          Etiketler
        </Typography>
      </Box>

      <Box sx={contentStyles}>
        {/* İlk satır - 3 etiket */}
        <Box sx={{ display: "flex", gap: 0.75, justifyContent: "flex-start" }}>
          {tags.slice(0, 3).map((tag, index) => {
            if (!tag || !tag.name) {
              console.warn("Geçersiz tag verisi:", tag);
              return null;
            }

            return (
              <TagItem
                key={tag.id || tag._id || index}
                tag={tag}
                index={index}
              />
            );
          })}
        </Box>

        {/* İkinci satır - 3 etiket */}
        <Box sx={{ display: "flex", gap: 0.75, justifyContent: "flex-start" }}>
          {tags.slice(3, 6).map((tag, index) => {
            if (!tag || !tag.name) {
              console.warn("Geçersiz tag verisi:", tag);
              return null;
            }

            return (
              <TagItem
                key={tag.id || tag._id || `row2-${index}`}
                tag={tag}
                index={index}
              />
            );
          })}
        </Box>
      </Box>

      {/* Footer - direkt content'in altına yapışık */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",
          fontStyle: "italic",
          textAlign: "center",
          opacity: 0.8,
          // mt kaldırıldı - direkt content'in altına yapışacak
        }}
      >
        En çok kullanılan etiketler
      </Typography>
    </Paper>
  );
});

export default SidebarTags;
