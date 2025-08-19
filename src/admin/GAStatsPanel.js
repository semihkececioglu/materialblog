import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGaOverview,
  fetchGaTimeseries,
  fetchGaTopPages,
  selectGaOverview,
  selectGaSeries,
  selectGaTopPages,
  selectDashboardLoading,
} from "../redux/dashboardSlice";
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
  const loading = useSelector(selectDashboardLoading);
  const overview = useSelector(selectGaOverview);
  const series = useSelector(selectGaSeries);
  const topPages = useSelector(selectGaTopPages);

  const [dateRange, setDateRange] = useState({
    startDate: "2024-08-01",
    endDate: "2024-08-31",
  });
  const [metric, setMetric] = useState("activeUsers");

  useEffect(() => {
    dispatch(fetchGaOverview(dateRange));
    dispatch(fetchGaTimeseries({ ...dateRange, metric }));
    dispatch(fetchGaTopPages({ ...dateRange, limit: 5 }));
  }, [dispatch, dateRange, metric]);

  return (
    <Box mt={4}>
      <Typography variant="h6" mb={2}>
        Google Analytics
      </Typography>

      {loading && <CircularProgress />}

      {/* Metric toggle */}
      <ToggleButtonGroup
        value={metric}
        exclusive
        onChange={(e, val) => val && setMetric(val)}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="activeUsers">Kullanıcılar</ToggleButton>
        <ToggleButton value="screenPageViews">Sayfa Görüntüleme</ToggleButton>
      </ToggleButtonGroup>

      {/* Timeseries chart */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={series}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Top Pages */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" mb={2}>
          En Çok Görüntülenen Sayfalar
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Path</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Views</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topPages.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.path}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.views}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default GAStatsPanel;
