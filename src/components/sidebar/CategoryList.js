import React, { useEffect } from "react";
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

const CategoryList = () => {
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

  // Loading skeleton component
  const CategorySkeleton = () => (
    <ListItem disablePadding sx={{ mb: 0.75 }}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          p: 1.5,
          borderRadius: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor: (theme) => alpha(theme.palette.background.default, 0.3),
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Skeleton
          variant="rounded"
          width={32}
          height={32}
          sx={{ borderRadius: 1 }}
        />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" height={16} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="50%" height={12} />
        </Box>
      </Paper>
    </ListItem>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mt: 3,
        borderRadius: 2,
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.4)
            : alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(12px)",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <Box
          sx={{
            width: 3,
            height: 16,
            borderRadius: 0.5,
            bgcolor: "primary.main",
          }}
        />
        <Typography
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
          </>
        )}

        {/* Empty state - öne çıkan kategori yoksa */}
        {!loading && featuredCategories.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 3,
              opacity: 0.6,
            }}
          >
            <CategoryIcon
              sx={{
                fontSize: 32,
                color: "text.disabled",
                mb: 1,
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: "0.75rem",
                display: "block",
                lineHeight: 1.4,
              }}
            >
              Henüz kategori bulunmuyor
            </Typography>
          </Box>
        )}

        {/* Featured kategoriler listesi */}
        {!loading &&
          featuredCategories.map((category) => {
            const IconComponent = getIconComponent(category.icon);
            const categoryColor = category.color || "#999999"; // fallback color

            return (
              <ListItem key={category._id} disablePadding sx={{ mb: 0.75 }}>
                <Paper
                  component={Link}
                  to={`/category/${category.slug}`}
                  elevation={0}
                  sx={{
                    width: "100%",
                    p: 1.5,
                    borderRadius: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    textDecoration: "none",
                    color: "text.primary",
                    bgcolor: alpha(categoryColor, 0.08),
                    border: "1px solid",
                    borderColor: alpha(categoryColor, 0.15),
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      bgcolor: alpha(categoryColor, 0.12),
                      transform: "translateX(4px)",
                      borderColor: alpha(categoryColor, 0.25),
                      boxShadow: `0 4px 12px ${alpha(categoryColor, 0.15)}`,
                      "&:before": {
                        transform: "translateX(0)",
                      },
                    },
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: 3,
                      bgcolor: categoryColor,
                      transform: "translateX(-100%)",
                      transition: "transform 0.25s ease",
                    },
                  }}
                >
                  {/* İkon container */}
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 1,
                      bgcolor: alpha(categoryColor, 0.15),
                      color: categoryColor,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <IconComponent sx={{ fontSize: 18 }} />
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
                        fontWeight: 600,
                        mb: 0.25,
                        fontSize: "0.875rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {category.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      {category.postCount || 0} yazı
                    </Typography>
                  </Box>
                </Paper>
              </ListItem>
            );
          })}
      </List>

      {/* Tüm kategorileri görme linki */}
      {!loading && featuredCategories.length > 0 && (
        <Box
          sx={{
            mt: 2,
            pt: 1.5,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Paper
            component={Link}
            to="/categories"
            elevation={0}
            sx={{
              width: "100%",
              p: 1.5,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              textDecoration: "none",
              color: "text.secondary",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
              border: "1px solid",
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.1),
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                color: "primary.main",
                borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <CategoryIcon sx={{ fontSize: 16 }} />
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "0.8rem",
              }}
            >
              Tüm Kategoriler
            </Typography>
          </Paper>
        </Box>
      )}
    </Paper>
  );
};

export default CategoryList;
