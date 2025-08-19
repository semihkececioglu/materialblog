// GAStatsPanel.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Paper,
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  fetchGaOverview,
  fetchGaTimeseries,
  fetchGaTopPages,
} from "../redux/dashboardSlice";

const rangeToDates = (range) => {
  const end = dayjs().format("YYYY-MM-DD");
  const start = (
    range === "7d"
      ? dayjs().subtract(6, "day")
      : range === "28d"
      ? dayjs().subtract(27, "day")
      : dayjs().subtract(89, "day")
  ).format("YYYY-MM-DD");
  return { startDate: start, endDate: end };
};

export default function GAStatsPanel() {
  const dispatch = useDispatch();
  const [range, setRange] = useState("7d");

  // ── Güvenli seçim: farklı isimler ve boş değerler
  const dash = useSelector((s) => s.dashboard ?? {});
  const loading = Boolean(dash.loading);

  // timeseries raw: series | gaTimeseries | timeseries
  const rawSeries = dash.series ?? dash.gaTimeseries ?? dash.timeseries ?? [];

  // top pages raw: topPages | gaTopPages
  const rawTopPages = dash.topPages ?? dash.gaTopPages ?? [];

  // Normalize + fallback (undefined.map hatasını önler)
  const normSeries = Array.isArray(rawSeries)
    ? rawSeries
    : Array.isArray(rawSeries?.rows)
    ? rawSeries.rows
    : [];

  const normTopPages = Array.isArray(rawTopPages)
    ? rawTopPages
    : Array.isArray(rawTopPages?.rows)
    ? rawTopPages.rows
    : [];

  // Backend veri şekli farklıysa güvenli map
  const series = useMemo(
    () =>
      normSeries.map((p) => ({
        date: p.date ?? p.day ?? p.dimension ?? p[0] ?? "",
        value: Number(p.value ?? p.activeUsers ?? p.users ?? p[1] ?? 0),
      })),
    [normSeries]
  );

  const topPages = useMemo(
    () =>
      normTopPages.map((p) => ({
        path: p.path ?? p.pagePath ?? p.url ?? p[0] ?? "-",
        title: p.title ?? p.pageTitle ?? p[1] ?? "",
        views: Number(p.views ?? p.pageViews ?? p.count ?? p[2] ?? 0),
      })),
    [normTopPages]
  );

  const { startDate, endDate } = useMemo(() => rangeToDates(range), [range]);

  useEffect(() => {
    dispatch(fetchGaOverview({ startDate, endDate }));
    dispatch(fetchGaTimeseries({ startDate, endDate, metric: "activeUsers" }));
    dispatch(fetchGaTopPages({ startDate, endDate, limit: 10 }));
  }, [dispatch, startDate, endDate]);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Ziyaretçi Trendleri</Typography>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={range}
          onChange={(_, v) => v && setRange(v)}
        >
          <ToggleButton value="7d">7G</ToggleButton>
          <ToggleButton value="28d">28G</ToggleButton>
          <ToggleButton value="90d">90G</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Paper sx={{ p: 2, height: 320 }}>
        {loading && series.length === 0 ? (
          <Box
            sx={{
              height: 280,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Area type="monotone" dataKey="value" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Paper>

      <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>
        En Çok Görüntülenen Sayfalar
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Sayfa</TableCell>
              <TableCell>Başlık</TableCell>
              <TableCell align="right">Görüntüleme</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topPages.map((p, i) => (
              <TableRow key={i}>
                <TableCell
                  sx={{
                    maxWidth: 360,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.path}
                </TableCell>
                <TableCell
                  sx={{
                    maxWidth: 360,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.title}
                </TableCell>
                <TableCell align="right">
                  {Number(p.views ?? 0).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
            {topPages.length === 0 && (
              <TableRow>
                <TableCell colSpan={3}>Veri bulunamadı.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
