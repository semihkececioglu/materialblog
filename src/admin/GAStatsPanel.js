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
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
  Button,
  IconButton,
} from "@mui/material";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import ArticleIcon from "@mui/icons-material/Article";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const StatsCard = ({ title, value, color, icon }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      borderRadius: "16px",
      border: "1px solid",
      borderColor: "divider",
      backgroundColor: (theme) =>
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.04)"
          : "rgba(255,255,255,0.95)",
      backdropFilter: "blur(20px)",
      minWidth: 220,
      display: "flex",
      alignItems: "center",
      gap: 2,
    }}
  >
    <Box
      sx={{
        p: 1.5,
        borderRadius: "12px",
        bgcolor: `${color}15`,
        display: "flex",
        alignItems: "center",
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography
        variant="h4"
        sx={{
          color: "text.primary",
          fontWeight: 700,
          fontSize: "1.75rem",
        }}
      >
        {value.toLocaleString()}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          fontWeight: 500,
          fontSize: "0.875rem",
        }}
      >
        {title}
      </Typography>
    </Box>
  </Paper>
);

const DateRangeSelector = ({ value, onChange, ranges }) => (
  <Box
    sx={{
      display: "flex",
      gap: 1,
      "& .MuiButton-root": {
        px: 3,
        py: 1,
        borderRadius: "12px",
        fontSize: "0.875rem",
        fontWeight: 500,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.04)"
            : "rgba(255,255,255,0.95)",
        "&.active": {
          bgcolor: "primary.main",
          color: "white",
          borderColor: "primary.main",
        },
      },
    }}
  >
    {Object.entries(ranges).map(([key, label]) => (
      <Button
        key={key}
        onClick={() => onChange(key)}
        className={value === key ? "active" : ""}
      >
        {label}
      </Button>
    ))}
  </Box>
);

const GAStatsPanel = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const gaOverview = useSelector(selectGaOverview);
  const gaTimeseries = useSelector(selectGaTimeseries);
  const gaTopPages = useSelector(selectGaTopPages);
  const gaLoading = useSelector(selectGaLoading);

  const [range, setRange] = useState("7daysAgo");
  const ranges = {
    "7daysAgo": "Son 7 Gün",
    "30daysAgo": "Son 30 Gün",
    "90daysAgo": "Son 90 Gün",
  };

  useEffect(() => {
    dispatch(fetchGaOverview({ startDate: range }));
    dispatch(fetchGaTimeseries({ startDate: range }));
    dispatch(fetchGaTopPages({ startDate: range }));
  }, [dispatch, range]);

  if (gaLoading && !gaOverview) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // ✅ Kutucuk verileri
  const totalUsers = gaOverview?.rows?.[0]?.metricValues?.[0]?.value || 0;
  const totalViews = gaOverview?.rows?.[0]?.metricValues?.[1]?.value || 0;

  // ✅ Tarih formatlama
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

  const chartData =
    gaTimeseries?.rows?.map((row) => ({
      date: formatDate(row.dimensionValues[0].value),
      users: parseInt(row.metricValues[0].value),
      views: parseInt(row.metricValues[1].value),
    })) || [];

  const topPages =
    gaTopPages?.rows?.map((row) => ({
      path: row.dimensionValues[0].value,
      views: row.metricValues[0].value,
    })) || [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Üst Kısım - Stats ve Filter */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 3,
        }}
      >
        {/* Stat Cards */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <StatsCard
            title="Aktif Kullanıcılar"
            value={totalUsers}
            color={theme.palette.primary.main}
            icon={<PersonIcon sx={{ color: theme.palette.primary.main }} />}
          />
          <StatsCard
            title="Sayfa Görüntülenme"
            value={totalViews}
            color={theme.palette.secondary.main}
            icon={
              <VisibilityIcon sx={{ color: theme.palette.secondary.main }} />
            }
          />
        </Box>

        {/* Date Range Selector */}
        <DateRangeSelector value={range} onChange={setRange} ranges={ranges} />
      </Box>

      {/* Grafik */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.95)",
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Kullanıcılar & Görüntülenme
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.palette.divider}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke={theme.palette.text.secondary}
              fontSize={12}
              tickMargin={10}
            />
            <YAxis
              stroke={theme.palette.text.secondary}
              fontSize={12}
              tickMargin={10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px",
                boxShadow: theme.shadows[3],
              }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              dot={false}
              name="Kullanıcılar"
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke={theme.palette.secondary.main}
              strokeWidth={2}
              dot={false}
              name="Görüntülenme"
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Top Pages Table - Updated */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.95)",
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          En Çok Görüntülenen Sayfalar
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  borderBottom: "2px solid",
                  borderColor: "divider",
                  py: 2,
                  color: "text.primary",
                  fontWeight: 600,
                }}
              >
                Sayfa
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  borderBottom: "2px solid",
                  borderColor: "divider",
                  py: 2,
                  color: "text.primary",
                  fontWeight: 600,
                }}
              >
                Görüntülenme
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topPages.map((page, i) => (
              <TableRow
                key={i}
                sx={{
                  "&:hover": {
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(0,0,0,0.02)",
                  },
                  cursor: "pointer",
                }}
              >
                <TableCell
                  sx={{
                    py: 2.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "8px",
                        bgcolor: `${theme.palette.info.main}12`,
                      }}
                    >
                      <ArticleIcon
                        sx={{
                          fontSize: 20,
                          color: theme.palette.info.main,
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {page.path}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    py: 2.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    color: "text.secondary",
                    fontWeight: 500,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <VisibilityIcon
                      sx={{ fontSize: 16, color: theme.palette.info.main }}
                    />
                    {parseInt(page.views).toLocaleString()}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default GAStatsPanel;
