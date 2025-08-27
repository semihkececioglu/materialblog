import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGaOverview,
  fetchGaTimeseries,
  fetchGaTopPages,
  selectGaOverview,
  selectGaTimeseries,
  selectGaTopPages,
  selectGaLoading,
} from "../redux/dashboardSlice";

import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Avatar,
  Stack,
  Chip,
  useTheme,
  alpha,
  Skeleton,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import ArticleIcon from "@mui/icons-material/Article";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const ModernStatsCard = ({
  title,
  value,
  color,
  icon,
  trend,
  loading = false,
}) => {
  const theme = useTheme();

  const getTrendIcon = () => {
    if (!trend || trend === 0) return null;
    return trend > 0 ? (
      <TrendingUpIcon sx={{ fontSize: 14 }} />
    ) : (
      <TrendingDownIcon sx={{ fontSize: 14 }} />
    );
  };

  const getTrendColor = () => {
    if (!trend || trend === 0) return "text.secondary";
    return trend > 0 ? "success.main" : "error.main";
  };

  const formatTrend = (trend) => {
    if (!trend || trend === 0) return "Değişim yok";
    const sign = trend > 0 ? "+" : "";
    return `${sign}${trend.toFixed(1)}%`;
  };

  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(145deg, ${alpha(
                theme.palette.background.paper,
                0.95
              )}, ${alpha(theme.palette.background.default, 0.8)})`
            : `linear-gradient(145deg, ${alpha("#fff", 0.98)}, ${alpha(
                "#f8fafc",
                0.95
              )})`,
        backdropFilter: "blur(20px)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 8px 32px ${alpha(color, 0.15)}`,
          border: `1px solid ${alpha(color, 0.2)}`,
        },
        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.6)})`,
        },
      }}
    >
      <Stack direction="row" spacing={2.5} alignItems="center">
        <Avatar
          sx={{
            bgcolor: alpha(color, 0.12),
            color: color,
            width: 56,
            height: 56,
            boxShadow: `0 8px 24px ${alpha(color, 0.25)}`,
          }}
        >
          {loading ? (
            <Skeleton variant="circular" width={28} height={28} />
          ) : (
            icon
          )}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          {loading ? (
            <>
              <Skeleton variant="text" width={80} height={32} />
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width={60} height={16} />
            </>
          ) : (
            <>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                  mb: 0.5,
                  background: `linear-gradient(135deg, ${
                    theme.palette.text.primary
                  }, ${alpha(color, 0.8)})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                {value.toLocaleString()}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
                sx={{ letterSpacing: "0.5px", mb: 1 }}
              >
                {title}
              </Typography>
              {trend !== null && trend !== undefined && (
                <Chip
                  size="small"
                  icon={getTrendIcon()}
                  label={formatTrend(trend)}
                  sx={{
                    height: 20,
                    fontSize: "0.7rem",
                    bgcolor: alpha(
                      getTrendColor() === "success.main"
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                      0.1
                    ),
                    color: getTrendColor(),
                  }}
                />
              )}
            </>
          )}
        </Box>
      </Stack>
    </Card>
  );
};

const DateRangeSelector = ({ value, onChange, ranges }) => {
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={1}>
      {Object.entries(ranges).map(([key, label]) => (
        <Chip
          key={key}
          label={label}
          onClick={() => onChange(key)}
          variant={value === key ? "filled" : "outlined"}
          sx={{
            borderRadius: 3,
            fontWeight: 600,
            transition: "all 0.2s ease",
            cursor: "pointer",
            ...(value === key && {
              bgcolor: "primary.main",
              color: "white",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }),
            ...(value !== key && {
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                borderColor: "primary.main",
              },
            }),
          }}
        />
      ))}
    </Stack>
  );
};

const ModernTopPagesCard = ({ pages, loading }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          background:
            theme.palette.mode === "dark"
              ? `linear-gradient(145deg, ${alpha(
                  theme.palette.background.paper,
                  0.95
                )}, ${alpha(theme.palette.background.default, 0.8)})`
              : `linear-gradient(145deg, ${alpha("#fff", 0.98)}, ${alpha(
                  "#f8fafc",
                  0.95
                )})`,
          backdropFilter: "blur(20px)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Skeleton variant="text" width={200} height={32} sx={{ mb: 3 }} />
          <Stack spacing={2}>
            {[...Array(5)].map((_, index) => (
              <Box
                key={index}
                sx={{ display: "flex", gap: 2, alignItems: "center" }}
              >
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="70%" height={20} />
                  <Skeleton variant="text" width="30%" height={16} />
                </Box>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(145deg, ${alpha(
                theme.palette.background.paper,
                0.95
              )}, ${alpha(theme.palette.background.default, 0.8)})`
            : `linear-gradient(145deg, ${alpha("#fff", 0.98)}, ${alpha(
                "#f8fafc",
                0.95
              )})`,
        backdropFilter: "blur(20px)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 8px 32px ${alpha(theme.palette.info.main, 0.15)}`,
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.info.main, 0.1),
                color: "info.main",
                width: 36,
                height: 36,
              }}
            >
              <ArticleIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography variant="h6" fontWeight={700}>
              En Çok Görüntülenen Sayfalar
            </Typography>
          </Stack>
          <Tooltip title="Google Analytics'te Aç">
            <IconButton
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.info.main, 0.1),
                color: "info.main",
                "&:hover": {
                  bgcolor: alpha(theme.palette.info.main, 0.2),
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack spacing={2}>
          {pages.slice(0, 5).map((page, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                background: "transparent",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                "&:hover": {
                  bgcolor: alpha(theme.palette.info.main, 0.04),
                  transform: "translateX(8px)",
                  boxShadow: `0 4px 20px ${alpha(
                    theme.palette.info.main,
                    0.15
                  )}`,
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                },
                "&:before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 3,
                  background: `linear-gradient(180deg, ${
                    theme.palette.info.main
                  }, ${alpha(theme.palette.info.main, 0.6)})`,
                  transform: "scaleY(0)",
                  transition: "transform 0.3s ease",
                },
                "&:hover:before": {
                  transform: "scaleY(1)",
                },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor:
                      index < 3
                        ? "warning.main"
                        : alpha(theme.palette.info.main, 0.2),
                    color: index < 3 ? "white" : "info.main",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    noWrap
                    sx={{ mb: 0.5, color: "text.primary" }}
                  >
                    {page.path}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <VisibilityIcon
                      sx={{ fontSize: 12, color: "text.secondary" }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.7rem" }}
                    >
                      {parseInt(page.views).toLocaleString()} görüntülenme
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

const GAStatsPanel = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const gaOverview = useSelector(selectGaOverview);
  const gaTimeseries = useSelector(selectGaTimeseries);
  const gaTopPages = useSelector(selectGaTopPages);
  const gaLoading = useSelector(selectGaLoading);

  const [range, setRange] = useState("7daysAgo");
  const [previousData, setPreviousData] = useState(null);

  const ranges = {
    today: "Bugün",
    yesterday: "Dün",
    "7daysAgo": "Son 7 Gün",
    "30daysAgo": "Son 30 Gün",
    "90daysAgo": "Son 90 Gün",
  };

  useEffect(() => {
    dispatch(fetchGaOverview({ startDate: range }));
    dispatch(fetchGaTimeseries({ startDate: range }));
    dispatch(fetchGaTopPages({ startDate: range }));

    // Önceki dönem verilerini al (trend hesaplaması için)
    if (range !== "today" && range !== "yesterday") {
      const getPreviousRange = (currentRange) => {
        switch (currentRange) {
          case "7daysAgo":
            return "14daysAgo";
          case "30daysAgo":
            return "60daysAgo";
          case "90daysAgo":
            return "180daysAgo";
          default:
            return "7daysAgo";
        }
      };

      dispatch(fetchGaOverview({ startDate: getPreviousRange(range) })).then(
        (result) => {
          if (result.payload) {
            setPreviousData(result.payload);
          }
        }
      );
    }
  }, [dispatch, range]);

  // Trend hesaplama fonksiyonu
  const calculateTrend = (current, previous) => {
    if (!previous || previous === 0) return null;
    return ((current - previous) / previous) * 100;
  };

  if (gaLoading && !gaOverview) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
        }}
      >
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  const totalUsers = parseInt(
    gaOverview?.rows?.[0]?.metricValues?.[0]?.value || 0
  );
  const totalViews = parseInt(
    gaOverview?.rows?.[0]?.metricValues?.[1]?.value || 0
  );

  // Önceki dönem verileri
  const previousUsers = parseInt(
    previousData?.rows?.[0]?.metricValues?.[0]?.value || 0
  );
  const previousViews = parseInt(
    previousData?.rows?.[0]?.metricValues?.[1]?.value || 0
  );

  // Trend hesaplamaları
  const usersTrend = calculateTrend(totalUsers, previousUsers);
  const viewsTrend = calculateTrend(totalViews, previousViews);

  const formatDate = (val) => {
    if (!val) return "";
    const year = val.substring(0, 4);
    const month = val.substring(4, 6);
    const day = val.substring(6, 8);
    return new Date(`${year}-${month}-${day}`).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "short",
    });
  };

  // Chart verilerini tarih sırasına göre sırala
  const chartData =
    gaTimeseries?.rows
      ?.map((row) => ({
        date: formatDate(row.dimensionValues[0].value),
        dateValue: row.dimensionValues[0].value, // Sıralama için
        users: parseInt(row.metricValues[0].value),
        views: parseInt(row.metricValues[1].value),
      }))
      ?.sort((a, b) => a.dateValue.localeCompare(b.dateValue)) || // Tarih sırasına göre sırala
    [];

  const topPages =
    gaTopPages?.rows?.map((row) => ({
      path: row.dimensionValues[0].value,
      views: row.metricValues[0].value,
    })) || [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              width: 36,
              height: 36,
            }}
          >
            <AnalyticsIcon sx={{ fontSize: 20 }} />
          </Avatar>
          <Typography variant="h6" fontWeight={700}>
            Google Analytics
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Web sitenizin performans istatistikleri
        </Typography>
      </Box>

      {/* Stats Cards ve Date Selector */}
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={3}
        alignItems={{ xs: "stretch", lg: "flex-start" }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          sx={{ flex: 1 }}
        >
          <ModernStatsCard
            title="Aktif Kullanıcılar"
            value={totalUsers}
            color={theme.palette.primary.main}
            icon={<PersonIcon sx={{ fontSize: 28 }} />}
            trend={usersTrend}
            loading={gaLoading}
          />
          <ModernStatsCard
            title="Sayfa Görüntülenme"
            value={totalViews}
            color={theme.palette.secondary.main}
            icon={<VisibilityIcon sx={{ fontSize: 28 }} />}
            trend={viewsTrend}
            loading={gaLoading}
          />
        </Stack>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CalendarTodayIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <DateRangeSelector
            value={range}
            onChange={setRange}
            ranges={ranges}
          />
        </Box>
      </Stack>

      {/* Chart */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          background:
            theme.palette.mode === "dark"
              ? `linear-gradient(145deg, ${alpha(
                  theme.palette.background.paper,
                  0.95
                )}, ${alpha(theme.palette.background.default, 0.8)})`
              : `linear-gradient(145deg, ${alpha("#fff", 0.98)}, ${alpha(
                  "#f8fafc",
                  0.95
                )})`,
          backdropFilter: "blur(20px)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 4 }}>
            Zaman Serisi Analizi
          </Typography>

          {gaLoading ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={300}
              sx={{ borderRadius: 2 }}
            />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={theme.palette.primary.main}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={theme.palette.primary.main}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={theme.palette.secondary.main}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={theme.palette.secondary.main}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={alpha(theme.palette.divider, 0.3)}
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke={theme.palette.text.secondary}
                  fontSize={12}
                  tickMargin={12}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke={theme.palette.text.secondary}
                  fontSize={12}
                  tickMargin={12}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    borderRadius: "12px",
                    boxShadow: theme.shadows[8],
                    backdropFilter: "blur(20px)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke={theme.palette.primary.main}
                  strokeWidth={3}
                  fill="url(#colorUsers)"
                  name="Kullanıcılar"
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke={theme.palette.secondary.main}
                  strokeWidth={3}
                  fill="url(#colorViews)"
                  name="Görüntülenme"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Top Pages */}
      <ModernTopPagesCard pages={topPages} loading={gaLoading} />
    </Box>
  );
};

export default GAStatsPanel;
