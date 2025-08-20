import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGaOverview,
  fetchGaTimeseries,
  fetchGaTopPages,
  selectGaOverview,
  selectGaTimeseries,
  selectGaTopPages,
  selectDashboardLoading,
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

const GAStatsPanel = () => {
  const dispatch = useDispatch();
  const gaOverview = useSelector(selectGaOverview);
  const gaTimeseries = useSelector(selectGaTimeseries);
  const gaTopPages = useSelector(selectGaTopPages);
  const loading = useSelector(selectDashboardLoading);

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

  if (loading && !gaOverview) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Kutucuk verileri
  const totalUsers = gaOverview?.rows?.[0]?.metricValues?.[0]?.value || 0;
  const totalViews = gaOverview?.rows?.[0]?.metricValues?.[1]?.value || 0;

  // Grafik verileri
  const chartData =
    gaTimeseries?.rows?.map((row) => ({
      date: row.dimensionValues[0].value,
      users: parseInt(row.metricValues[0].value),
      views: parseInt(row.metricValues[1].value),
    })) || [];

  // Top pages tablosu
  const topPages =
    gaTopPages?.rows?.map((row) => ({
      path: row.dimensionValues[0].value,
      views: row.metricValues[0].value,
    })) || [];

  return (
    <Box sx={{ mt: 4 }}>
      {/* Kutular */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
          <Typography variant="h6">Aktif Kullanıcılar</Typography>
          <Typography variant="h4">{totalUsers}</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
          <Typography variant="h6">Sayfa Görüntülenme</Typography>
          <Typography variant="h4">{totalViews}</Typography>
        </Paper>
      </Box>

      {/* Tarih filtreleri */}
      <ToggleButtonGroup
        value={range}
        exclusive
        onChange={(e, val) => val && setRange(val)}
        sx={{ mb: 3 }}
      >
        {Object.entries(ranges).map(([key, label]) => (
          <ToggleButton key={key} value={key}>
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* Grafik */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Aktif Kullanıcılar & Görüntülenme
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#8884d8"
              name="Kullanıcılar"
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#82ca9d"
              name="Görüntülenme"
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Top Pages Tablosu */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          En Çok Görüntülenen Sayfalar
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sayfa</TableCell>
              <TableCell>Görüntülenme</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topPages.map((page, i) => (
              <TableRow key={i}>
                <TableCell>{page.path}</TableCell>
                <TableCell>{page.views}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default GAStatsPanel;
