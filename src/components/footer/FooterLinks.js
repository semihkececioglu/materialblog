import React, { useEffect } from "react";
import { Box, Typography, Link, Chip } from "@mui/material";
import {
  Home,
  Info,
  ContactMail,
  Code,
  Javascript,
  Palette,
  ChevronRight,
  Category as CategoryIcon,
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
import { alpha } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/categoriesSlice";

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
  Code: Code,
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
  Javascript: Javascript,
  Palette: Palette,
};

const FooterLinks = () => {
  const dispatch = useDispatch();
  const { items: categories = [], loading } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // İkon component'ini al
  const getIconComponent = (iconName) => {
    if (iconName && AVAILABLE_ICONS[iconName]) {
      return AVAILABLE_ICONS[iconName];
    }
    return CategoryIcon;
  };

  // Footer'da gösterilecek kategorileri al (featured olanlar ya da en popüler 3)
  const getFooterCategories = () => {
    if (loading || categories.length === 0) {
      // Loading durumunda default kategoriler
      return [
        { label: "React", href: "/category/react", count: 0, icon: Code },
        {
          label: "Javascript",
          href: "/category/javascript",
          count: 0,
          icon: Javascript,
        },
        {
          label: "Tasarım",
          href: "/category/tasarim",
          count: 0,
          icon: Palette,
        },
      ];
    }

    // Önce featured kategorileri al
    const featuredCategories = categories.filter(
      (cat) => cat.featured === true
    );

    // Eğer featured kategori varsa onları kullan, yoksa en popüler 3'ü al
    const categoriesToShow =
      featuredCategories.length > 0
        ? featuredCategories.slice(0, 3)
        : categories
            .sort((a, b) => (b.postCount || 0) - (a.postCount || 0))
            .slice(0, 3);

    return categoriesToShow.map((cat) => ({
      label: cat.name,
      href: `/category/${cat.slug}`,
      count: cat.postCount || 0,
      icon: getIconComponent(cat.icon),
    }));
  };

  const linkGroups = [
    {
      title: "Linkler",
      links: [
        { label: "Ana Sayfa", href: "/", icon: Home, isNew: false },
        { label: "Hakkımızda", href: "/about", icon: Info, isNew: false },
        {
          label: "İletişim",
          href: "/contact",
          icon: ContactMail,
          isNew: false,
        },
      ],
    },
    {
      title: "Kategoriler",
      links: getFooterCategories(),
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        height: "100%",
      }}
    >
      {linkGroups.map((group, groupIndex) => (
        <Box key={group.title}>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontWeight: 600,
              fontSize: "1rem",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -4,
                left: 0,
                width: 24,
                height: 2,
                background: "linear-gradient(45deg, #2196F3, #21CBF3)",
                borderRadius: 1,
              },
            }}
          >
            {group.title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            {group.links.map((link) => (
              <Box
                key={link.label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 0.5,
                  px: 1,
                  mx: -1,
                  borderRadius: 1,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: alpha("#2196F3", 0.04),
                    transform: "translateX(4px)",
                  },
                }}
              >
                <Link
                  href={link.href}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "text.secondary",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: 400,
                    transition: "color 0.2s ease-in-out",
                    "&:hover": {
                      color: "primary.main",
                      textDecoration: "none",
                    },
                  }}
                >
                  {link.icon && (
                    <link.icon
                      sx={{
                        fontSize: 16,
                        opacity: 0.7,
                      }}
                    />
                  )}
                  {link.label}
                  {link.isNew && (
                    <Chip
                      label="YENİ"
                      size="small"
                      sx={{
                        height: 16,
                        fontSize: "0.625rem",
                        fontWeight: 600,
                        background: "linear-gradient(45deg, #FF6B6B, #FF8E8E)",
                        color: "white",
                        "& .MuiChip-label": {
                          px: 0.5,
                        },
                      }}
                    />
                  )}
                </Link>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {link.count !== undefined && (
                    <Chip
                      label={loading ? "..." : link.count}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 20,
                        fontSize: "0.625rem",
                        borderColor: alpha("#2196F3", 0.3),
                        color: "text.secondary",
                        "& .MuiChip-label": {
                          px: 0.5,
                        },
                      }}
                    />
                  )}
                  <ChevronRight
                    sx={{
                      fontSize: 14,
                      opacity: 0.4,
                      transition: "all 0.2s ease-in-out",
                      ".MuiBox-root:hover &": {
                        opacity: 0.8,
                        transform: "translateX(2px)",
                      },
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ))}

      {/* Quick Actions */}
      <Box
        sx={{
          mt: "auto",
          p: 1.5,
          borderRadius: 2,
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 203, 243, 0.05) 100%)"
              : "linear-gradient(135deg, rgba(33, 150, 243, 0.02) 0%, rgba(33, 203, 243, 0.02) 100%)",
          border: (theme) =>
            `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            display: "block",
            fontWeight: 500,
            mb: 0.5,
            color: "text.secondary",
          }}
        >
          Hızlı Erişim
        </Typography>

        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {getFooterCategories()
            .slice(0, 3)
            .map((category) => (
              <Chip
                key={category.label}
                label={category.label}
                size="small"
                clickable
                component={Link}
                href={category.href}
                sx={{
                  height: 24,
                  fontSize: "0.625rem",
                  backgroundColor: alpha("#2196F3", 0.08),
                  color: "primary.main",
                  border: "none",
                  textDecoration: "none",
                  "&:hover": {
                    backgroundColor: alpha("#2196F3", 0.12),
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              />
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default FooterLinks;
