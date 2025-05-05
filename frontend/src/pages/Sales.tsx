
import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, CircularProgress } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Sale = { month: string; sales: number };

// list of products to show
const productOptions = ["T-Shirts", "Jeans", "Shoes", "Hoodies", "Accessories"];

export default function SalesPage() {
  // raw per-product data
  const [raw, setRaw] = useState<Record<string, Sale[]>>({});
  const [loading, setLoading] = useState(true);

  // which series are visible in the chart
  const [visibleKeys, setVisibleKeys] = useState<string[]>([]);

  // fetch each products series in parallel
  useEffect(() => {
    setLoading(true);
    Promise.all(
      productOptions.map((prod) =>
        fetch(
          `http://localhost:8080/sales?products=${encodeURIComponent(prod)}`
        )
          .then((r) => r.json() as Promise<Sale[]>)
          .then((arr) => [prod, arr] as [string, Sale[]])
      )
    )
      .then((pairs) => {
        const obj: Record<string, Sale[]> = {};
        pairs.forEach(([prod, arr]) => {
          obj[prod] = arr;
        });
        setRaw(obj);
        // default: show all lines
        setVisibleKeys(Object.keys(obj));
      })
      .finally(() => setLoading(false));
  }, []);

  // combine raw into chartData: one object per month, keyed by product
  const chartData = React.useMemo(() => {
    // collect all months in order from the first product
    const months = raw[productOptions[0]]?.map((s) => s.month) || [];
    return months.map((month) => {
      const point: Record<string, string | number> = { month };
      for (const prod of productOptions) {
        const entry = raw[prod]?.find((s) => s.month === month);
        point[prod] = entry ? entry.sales : 0;
      }
      return point;
    });
  }, [raw]);
// disable TS/ESLint error for explicit any here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLegendClick = (data: any) => {
    const key = data.dataKey as string | undefined;
    if (key) {
      setVisibleKeys((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      );
    }
  };

  if (loading)
    return (
      <Container sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );

  return (
    <Container sx={{ height: "100%" }}>
      <Typography
        sx={{
        }}
        variant="h4"
        gutterBottom
      >
        Sales Overview
      </Typography>
      <Paper
        sx={{
          p: 2,
          height: 450,
          pt: 5,
          pb: 10,

          borderRadius: 5,
          boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.06)",
        }}
      >

<ResponsiveContainer width="100%" height="100%">
  <LineChart
    data={chartData}
    margin={{ top: 0, right: 30, left: 0, bottom: 5 }}
  >
    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />

    <Legend
      onClick={handleLegendClick}
      verticalAlign="top"
      // align="left"
      height={60}
      
      formatter={(value) => (
        <span style={{ margin: '10px 16px' }}>{value}</span>
      )}
    />
      <div style={{margin:"40px"}}>hello</div>

    {productOptions.map((prod, i) => (
      <Line
        key={prod}
        dataKey={prod}
        stroke={["#1976d2", "#dc004e", "#ff8f00", "#388e3c", "#7b1fa2"][i % 5]}
        type="monotone"
        dot
        activeDot={{ r: 6 }}
        hide={!visibleKeys.includes(prod)}
      />
    ))}
  </LineChart>
</ResponsiveContainer>

      </Paper>
    </Container>
  );
}
