import React, { useEffect, useMemo } from "react";
import {
  Typography,
  List,
  ListItem,
  Paper,
  Box,
  alpha,
  Skeleton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/categoriesSlice";
import {
  Category as CategoryIcon,
  Folder as FolderIcon,
  Star as StarIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Sports as SportsIcon,
  LibraryMusic as MusicIcon,
  Camera as CameraIcon,
  Book as BookIcon,
  Code as CodeIcon,
  CardTravel as TravelIcon,
  Restaurant as RestaurantIcon,
  Science as ScienceIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  HealthAndSafety as HealthIcon,
  Nature as NatureIcon,
  Brush as ArtIcon,
  Games as GamesIcon,
  Movie as MovieIcon,
  Build as BuildIcon,
  DirectionsCar as DirectionsCarIcon,
  LocalLibrary as LocalLibraryIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

// AdminCategoriesPage ile aynı icon mapping'i kullan
const AVAILABLE_ICONS = {
  Category: CategoryIcon,
  Folder: FolderIcon,
  Star: StarIcon,
  Home: HomeIcon,
  Work: WorkIcon,
  Sports: SportsIcon,
  Music: MusicIcon,
  Camera: CameraIcon,
  Book: BookIcon,
  Code: CodeIcon,
  Travel: TravelIcon,
  Restaurant: RestaurantIcon,
  Science: ScienceIcon,
  School: SchoolIcon,
  Business: BusinessIcon,
  Health: HealthIcon,
  Nature: NatureIcon,
  Art: ArtIcon,
  Games: GamesIcon,
  Movie: MovieIcon,
  Build: BuildIcon,
  DirectionsCar: DirectionsCarIcon,
  LocalLibrary: LocalLibraryIcon,
};

const CategoryList = React.memo(() => {
  const dispatch = useDispatch();
  const { items: categories = [], loading } = useSelector(
    (state) => state.categories
  );

  // Sadece featured: true olan kategorileri filtrele
  const featuredCategories = categories.filter(
    (category) => category.featured === true
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // İkon component'ini al - AdminCategoriesPage ile aynı mantık
  const getIconComponent = (iconName) => {
    if (iconName && AVAILABLE_ICONS[iconName]) {
      return AVAILABLE_ICONS[iconName];
    }
    return CategoryIcon; // Default icon
  };

  // Loading skeleton component - yeni düzene uygun
  const CategorySkeleton = () => (
    <ListItem disablePadding sx={{ mb: 0.75 }}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          p: 1.5,
          borderRadius: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          bgcolor: (theme) => alpha(theme.palette.background.default, 0.3),
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Icon skeleton */}
        <Skeleton
          variant="rounded"
          width={40}
          height={40}
          sx={{ borderRadius: 2 }}
        />

        {/* Text content skeleton */}
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="75%" height={18} sx={{ mb: 0.25 }} />
          <Skeleton variant="text" width="45%" height={14} />
        </Box>

        {/* Arrow skeleton */}
        <Skeleton variant="circular" width={16} height={16} />
      </Paper>
    </ListItem>
  );

  // "Tüm Kategoriler" button skeleton
  const AllCategoriesSkeleton = () => (
    <Box sx={{ mt: 1.5 }}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          p: 1.5,
          borderRadius: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          bgcolor: (theme) => alpha(theme.palette.background.default, 0.3),
          border: "1px dashed",
          borderColor: "divider",
        }}
      >
        <Skeleton variant="circular" width={18} height={18} />
        <Skeleton variant="text" width={100} height={16} />
        <Skeleton variant="circular" width={16} height={16} />
      </Paper>
    </Box>
  );

  // Memoized styles
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

  // Memoized category item renderer
  const CategoryItem = useMemo(
    () =>
      React.memo(({ category, index }) => {
        const IconComponent = getIconComponent(category.icon);
        const categoryColor = category.color || "#6366f1";

        const itemStyles = useMemo(
          () => ({
            width: "100%",
            p: 1.5,
            borderRadius: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            textDecoration: "none",
            color: "text.primary",
            bgcolor: alpha(categoryColor, 0.06),
            border: "1px solid",
            borderColor: alpha(categoryColor, 0.12),
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              bgcolor: alpha(categoryColor, 0.12),
              transform: "translateX(8px) scale(1.02)",
              borderColor: alpha(categoryColor, 0.25),
              boxShadow: `0 8px 25px ${alpha(categoryColor, 0.2)}`,
              "&:before": {
                width: 4,
              },
              "& .category-arrow": {
                opacity: 1,
                transform: "translateX(0)",
              },
            },
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: 0,
              bgcolor: categoryColor,
              transition: "width 0.3s ease",
              borderRadius: "0 4px 4px 0",
            },
          }),
          [categoryColor]
        );

        return (
          <ListItem disablePadding sx={{ mb: 0.75 }}>
            <Paper
              component={Link}
              to={`/category/${category.slug}`}
              elevation={0}
              sx={itemStyles}
            >
              {/* İkon container */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  bgcolor: alpha(categoryColor, 0.15),
                  color: categoryColor,
                  position: "relative",
                  zIndex: 1,
                  boxShadow: `0 2px 8px ${alpha(categoryColor, 0.2)}`,
                }}
              >
                <IconComponent sx={{ fontSize: 20 }} />
              </Box>

              {/* Kategori bilgileri */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 650,
                    mb: 0.25,
                    fontSize: "0.9rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    letterSpacing: "-0.25px",
                  }}
                >
                  {category.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  {category.postCount || 0} yazı
                </Typography>
              </Box>

              {/* Arrow icon */}
              <ArrowForwardIcon
                className="category-arrow"
                sx={{
                  fontSize: 16,
                  color: categoryColor,
                  opacity: 0,
                  transform: "translateX(-8px)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  zIndex: 1,
                }}
              />
            </Paper>
          </ListItem>
        );
      }),
    []
  );

  return (
    <Paper elevation={0} sx={paperStyles}>
      {/* Başlık - orijinal hali */}
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
          Kategoriler
        </Typography>
      </Box>

      <List sx={{ mx: -0.5 }}>
        {/* Loading skeletons */}
        {loading && (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <CategorySkeleton key={`skeleton-${index}`} />
            ))}
            <AllCategoriesSkeleton />
          </>
        )}

        {/* Empty state - öne çıkan kategori yoksa */}
        {!loading && featuredCategories.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              opacity: 0.7,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: (theme) => alpha(theme.palette.text.disabled, 0.1),
                mx: "auto",
                mb: 2,
              }}
            >
              <CategoryIcon
                sx={{
                  fontSize: 32,
                  color: "text.disabled",
                }}
              />
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
            >
              Henüz kategori bulunmuyor
            </Typography>
          </Box>
        )}

        {/* Featured kategoriler listesi */}
        {!loading &&
          featuredCategories.map((category, index) => {
            const IconComponent = getIconComponent(category.icon);
            const categoryColor = category.color || "#6366f1"; // modern fallback color

            return (
              <CategoryItem
                key={category._id}
                category={category}
                index={index}
              />
            );
          })}
      </List>

      {/* Tüm kategorileri görme linki */}
      {!loading && featuredCategories.length > 0 && (
        <Box sx={{ mt: 1.5 }}>
          <Paper
            component={Link}
            to="/categories"
            elevation={0}
            sx={{
              width: "100%",
              p: 1.5,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              textDecoration: "none",
              color: "text.secondary",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
              border: "1px dashed",
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
                borderColor: (theme) => alpha(theme.palette.primary.main, 0.4),
                borderStyle: "solid",
                transform: "translateY(-1px)",
                boxShadow: (theme) =>
                  `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
                "& .all-categories-arrow": {
                  transform: "translateX(4px)",
                },
              },
              "&:before": {
                content: '""',
                position: "absolute",
                inset: 0,
                background: (theme) =>
                  `linear-gradient(45deg, ${alpha(
                    theme.palette.primary.main,
                    0.02
                  )} 25%, transparent 25%), 
                   linear-gradient(-45deg, ${alpha(
                     theme.palette.primary.main,
                     0.02
                   )} 25%, transparent 25%)`,
                backgroundSize: "8px 8px",
                opacity: 0.5,
              },
            }}
          >
            <CategoryIcon
              sx={{ fontSize: 18, position: "relative", zIndex: 1 }}
            />
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "0.85rem",
                position: "relative",
                zIndex: 1,
              }}
            >
              Tüm Kategoriler
            </Typography>
            <ArrowForwardIcon
              className="all-categories-arrow"
              sx={{
                fontSize: 16,
                transition: "transform 0.3s ease",
                position: "relative",
                zIndex: 1,
              }}
            />
          </Paper>
        </Box>
      )}
    </Paper>
  );
});

export default CategoryList;
