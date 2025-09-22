import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/categoriesSlice";
import {
  Container,
  Card,
  Typography,
  Box,
  Skeleton,
  Fade,
  Zoom,
  Paper,
} from "@mui/material";
import { Category as CategoryIcon } from "@mui/icons-material";
import * as Icons from "@mui/icons-material";
import { Link } from "react-router-dom";

const AllCategoriesPage = () => {
  const dispatch = useDispatch();
  const {
    items: categories,
    loading,
    error,
  } = useSelector((state) => state.categories);

  useEffect(() => {
    // Sayfa başına scroll
    window.scrollTo(0, 0);

    dispatch(fetchCategories());
  }, [dispatch]);

  const skeletonCount = 12;

  // Kategori adını iki kelimeye böl
  const formatCategoryName = (name) => {
    if (!name) return "İsimsiz Kategori";
    const words = name.split(" ");
    if (words.length >= 2) {
      return (
        <Box>
          <Box component="span">{words[0]}</Box>
          <br />
          <Box component="span">{words.slice(1).join(" ")}</Box>
        </Box>
      );
    }
    return name;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        py: { xs: 4, sm: 6, md: 8 },
        px: 2,
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Error Display */}
        {error && (
          <Paper
            elevation={0}
            sx={{
              textAlign: "center",
              py: 3,
              mb: 4,
              background: "rgba(255, 59, 48, 0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 59, 48, 0.2)",
              borderRadius: 3,
            }}
          >
            <Typography
              color="error"
              sx={{
                fontWeight: 500,
              }}
            >
              Hata: {error}
            </Typography>
          </Paper>
        )}

        {/* Main Content Paper */}
        <Paper
          elevation={0}
          sx={{
            background:
              "linear-gradient(135deg, #e0c3fc 0%, #9bb5ff 25%, #a8e6cf 50%, #ffd3a5 75%, #fda085 100%)",
            borderRadius: 6,
            p: { xs: 3, sm: 4, md: 6 },
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              textAlign: "center",
              mb: { xs: 4, sm: 5, md: 6 },
              position: "relative",
              zIndex: 1,
            }}
          >
            <Fade in timeout={800}>
              <Box>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: "#333",
                    textShadow: "0 2px 8px rgba(255, 255, 255, 0.8)",
                    fontSize: { xs: "1.8rem", sm: "2.2rem", md: "3rem" },
                  }}
                >
                  Tüm Kategorileri Keşfet
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#555",
                    maxWidth: 500,
                    mx: "auto",
                    fontStyle: "italic",
                    lineHeight: 1.5,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    textShadow: "0 1px 3px rgba(255, 255, 255, 0.8)",
                  }}
                >
                  İçeriklerimizi kategorilere göre keşfedin ve size en uygun
                  konulardaki yazılara kolayca ulaşın
                </Typography>
              </Box>
            </Fade>
          </Box>

          {/* Categories Flex Container */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: { xs: 2, sm: 3, md: 4 },
              position: "relative",
              zIndex: 1,
              maxWidth: "1200px",
              mx: "auto",
            }}
          >
            {loading
              ? // Skeleton Loading
                Array.from(new Array(skeletonCount)).map((_, i) => (
                  <Card
                    key={i}
                    sx={{
                      borderRadius: 3,
                      width: { xs: 280, sm: 300, md: 320 },
                      height: { xs: 110, sm: 120, md: 130 },
                      display: "flex",
                      alignItems: "center",
                      p: { xs: 2, sm: 2.5, md: 3 },
                      background: "rgba(255, 255, 255, 0.25)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.18)",
                      boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
                    }}
                  >
                    <Skeleton
                      variant="circular"
                      width={{ xs: 40, sm: 45, md: 50 }}
                      height={{ xs: 40, sm: 45, md: 50 }}
                      sx={{
                        mr: 2,
                        bgcolor: "rgba(255, 255, 255, 0.3)",
                      }}
                    />
                    <Skeleton
                      variant="text"
                      width={100}
                      height={28}
                      sx={{ bgcolor: "rgba(255, 255, 255, 0.3)" }}
                    />
                  </Card>
                ))
              : categories.length > 0
              ? // Categories
                categories.map((cat, index) => {
                  const IconComponent = Icons[cat.icon] || CategoryIcon;

                  return (
                    <Zoom in timeout={300 + index * 100} key={cat._id || index}>
                      <Card
                        component={Link}
                        to={`/category/${cat.slug || cat._id}`}
                        sx={{
                          textDecoration: "none",
                          background: "rgba(255, 255, 255, 0.25)",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(255, 255, 255, 0.18)",
                          color: "#333",
                          borderRadius: 3,
                          p: { xs: 2, sm: 2.5, md: 3 },
                          width: { xs: 280, sm: 300, md: 320 },
                          height: { xs: 110, sm: 120, md: 130 },
                          display: "flex",
                          alignItems: "center",
                          position: "relative",
                          overflow: "hidden",
                          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "translateY(-4px) scale(1.02)",
                            boxShadow: "0 12px 40px rgba(31, 38, 135, 0.4)",
                            backdropFilter: "blur(30px)",
                            background: "rgba(255, 255, 255, 0.35)",
                            "& .category-icon": {
                              transform: "scale(1.1)",
                            },
                            "& .category-shine": {
                              opacity: 1,
                              transform: "translateX(100%)",
                            },
                          },
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                          },
                          "&:hover::before": {
                            opacity: 1,
                          },
                        }}
                      >
                        {/* Shine Effect */}
                        <Box
                          className="category-shine"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: "-100%",
                            width: "100%",
                            height: "100%",
                            background:
                              "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
                            opacity: 0,
                            transform: "translateX(-100%)",
                            transition: "all 0.6s ease",
                            pointerEvents: "none",
                          }}
                        />

                        {/* Icon Container */}
                        <Box
                          className="category-icon"
                          sx={{
                            width: { xs: 45, sm: 50, md: 60 },
                            height: { xs: 45, sm: 50, md: 60 },
                            borderRadius: "50%",
                            background: "rgba(255, 255, 255, 0.4)",
                            backdropFilter: "blur(15px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: { xs: 2, sm: 2.5, md: 3 },
                            transition: "all 0.3s ease",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                            boxShadow:
                              "inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 4px 16px rgba(31, 38, 135, 0.2)",
                            position: "relative",
                            zIndex: 2,
                          }}
                        >
                          <IconComponent
                            sx={{
                              fontSize: { xs: 20, sm: 24, md: 28 },
                              color: "#333",
                              position: "relative",
                              zIndex: 1,
                            }}
                          />
                        </Box>

                        {/* Content */}
                        <Box sx={{ flex: 1, position: "relative", zIndex: 2 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              fontSize: {
                                xs: "0.9rem",
                                sm: "1rem",
                                md: "1.1rem",
                              },
                              lineHeight: 1.2,
                              textAlign: "left",
                              color: "#333",
                              textShadow: "0 1px 2px rgba(255, 255, 255, 0.8)",
                            }}
                          >
                            {formatCategoryName(cat.name)}
                          </Typography>
                        </Box>
                      </Card>
                    </Zoom>
                  );
                })
              : // No categories
                !loading && (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: { xs: 6, sm: 8 },
                      background: "rgba(255, 255, 255, 0.25)",
                      backdropFilter: "blur(20px)",
                      borderRadius: 3,
                      border: "1px solid rgba(255, 255, 255, 0.18)",
                      boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
                      width: "100%",
                    }}
                  >
                    <CategoryIcon
                      sx={{
                        fontSize: { xs: 60, sm: 80 },
                        color: "#666",
                        mb: 2,
                      }}
                    />
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#333",
                        fontWeight: 600,
                        mb: 1,
                        fontSize: { xs: "1.2rem", sm: "1.5rem" },
                        textShadow: "0 1px 2px rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      Henüz kategori bulunmuyor
                    </Typography>
                    <Typography
                      sx={{
                        color: "#555",
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        textShadow: "0 1px 2px rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      Yönetici panelinden kategoriler eklenebilir
                    </Typography>
                  </Box>
                )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AllCategoriesPage;
