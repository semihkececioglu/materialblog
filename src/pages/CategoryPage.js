import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import {
  Container,
  Typography,
  Box,
  useTheme,
  Pagination,
  CircularProgress,
  Avatar,
  Badge,
  alpha,
  Skeleton,
} from "@mui/material";
import {
  Article as ArticleIcon,
  Category as CategoryIcon,
  Code as CodeIcon,
  Folder as FolderIcon,
  Star as StarIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Sports as SportsIcon,
  LibraryMusic as MusicIcon,
  Camera as CameraIcon,
  Book as BookIcon,
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

// Redux
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/postSlice";
import { fetchCategories } from "../redux/categoriesSlice";

const POSTS_PER_PAGE = 6;

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

function CategoryPage() {
  const { kategoriAdi, pageNumber } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();

  const page = parseInt(pageNumber) || 1;

  // Posts state'i
  const {
    posts,
    totalPages,
    loading: postsLoading,
    totalPosts,
  } = useSelector((state) => state.posts);

  // Categories state'i
  const { items: categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }

    dispatch(
      fetchPosts({
        category: decodeURIComponent(kategoriAdi),
        page,
        limit: POSTS_PER_PAGE,
      })
    );
  }, [dispatch, kategoriAdi, page, categories.length]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handlePageChange = (event, value) => {
    const pageUrl =
      value === 1
        ? `/category/${kategoriAdi}`
        : `/category/${kategoriAdi}/page/${value}`;
    navigate(pageUrl);
  };

  // Kategori bilgilerini bul
  const currentCategory = categories.find(
    (cat) =>
      cat.slug === decodeURIComponent(kategoriAdi) ||
      cat.name.toLowerCase().replace(/\s+/g, "-") ===
        decodeURIComponent(kategoriAdi)
  );

  const formattedCategoryName =
    currentCategory?.name ||
    decodeURIComponent(kategoriAdi)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

  const categoryColor = currentCategory?.color || theme.palette.primary.main;
  const categoryDescription = currentCategory?.description || "";
  const postCount = totalPosts || posts.length;

  // AdminCategoriesPage ile aynı icon belirleme mantığı
  const getCategoryIcon = () => {
    if (currentCategory?.icon && AVAILABLE_ICONS[currentCategory.icon]) {
      return AVAILABLE_ICONS[currentCategory.icon];
    }
    return CategoryIcon; // Default icon
  };

  const IconComponent = getCategoryIcon();
  const loading = postsLoading || categoriesLoading;

  // Header Skeleton Component
  const HeaderSkeleton = () => (
    <Box
      sx={{
        mb: 5,
        textAlign: "center",
        py: 4,
      }}
    >
      <Skeleton
        variant="circular"
        width={80}
        height={80}
        sx={{ mx: "auto", mb: 2 }}
      />
      <Skeleton
        variant="text"
        width="40%"
        height={60}
        sx={{ mx: "auto", mb: 1.5 }}
      />
      <Skeleton variant="text" width="60%" height={30} sx={{ mx: "auto" }} />
    </Box>
  );

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      {/* Header - Loading ya da Normal */}
      {loading ? (
        <HeaderSkeleton />
      ) : (
        <Box
          sx={{
            mb: 5,
            textAlign: "center",
            py: 4,
          }}
        >
          {/* Icon with Badge */}
          <Badge
            badgeContent={postCount}
            max={999}
            sx={{
              mb: 2,
              "& .MuiBadge-badge": {
                backgroundColor: categoryColor,
                color: "white",
                fontWeight: 700,
                fontSize: "0.75rem",
                minWidth: "22px",
                height: "22px",
                borderRadius: "11px",
                border: `2px solid ${theme.palette.background.default}`,
                boxShadow: `0 2px 8px ${alpha(categoryColor, 0.4)}`,
                top: 8,
                right: 8,
              },
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                backgroundColor: categoryColor,
                boxShadow: `0 8px 24px ${alpha(categoryColor, 0.3)}`,
                border: `3px solid ${alpha(categoryColor, 0.2)}`,
                mx: "auto",
              }}
            >
              <IconComponent
                sx={{
                  fontSize: 40,
                  color: "white",
                }}
              />
            </Avatar>
          </Badge>

          {/* Category Name - UPPERCASE */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              fontWeight: 800,
              color: categoryColor,
              lineHeight: 1.1,
              mb: 1.5,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
            }}
          >
            {formattedCategoryName}
          </Typography>

          {/* Category Description */}
          {categoryDescription && (
            <Box sx={{ maxWidth: "600px", mx: "auto" }}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: 400,
                  color: theme.palette.text.secondary,
                  lineHeight: 1.6,
                  fontStyle: "italic",
                }}
              >
                "{categoryDescription}"
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Posts Grid - Loading ya da Normal */}
      {loading ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 3 }}>
          {Array.from(new Array(6)).map((_, index) => (
            <Box
              key={index}
              sx={{
                flex: "1 1 calc(33.333% - 20px)",
                minWidth: "250px",
              }}
            >
              <Skeleton
                variant="rectangular"
                height={200}
                sx={{ borderRadius: 2, mb: 2 }}
              />
              <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={20} />
            </Box>
          ))}
        </Box>
      ) : (
        <>
          {/* Posts Grid */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 3 }}>
            {posts.map((post) => (
              <Box
                key={post._id}
                sx={{
                  flex: "1 1 calc(33.333% - 20px)",
                  minWidth: "250px",
                }}
              >
                <PostCard post={post} />
              </Box>
            ))}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default CategoryPage;
