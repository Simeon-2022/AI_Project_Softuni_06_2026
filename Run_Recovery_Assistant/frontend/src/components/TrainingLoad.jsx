import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "../services/api";

const DEMO_USER_ID = "demo-user-id";

const FALLBACK_DATA = [
  { week: "Week -3", km: 0 },
  { week: "Week -2", km: 0 },
  { week: "Week -1", km: 0 },
  { week: "This week", km: 0 },
];

export default function TrainingLoad() {
  const [chartData, setChartData] = useState(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/training/load/${DEMO_USER_ID}`)
      .then((res) => {
        const raw = res.data.weekly_load || {};
        const data = Object.entries(raw).map(([week, km]) => ({
          week,
          km: parseFloat(km),
        }));
        setChartData(data.length > 0 ? data : FALLBACK_DATA);
      })
      .catch(() => setChartData(FALLBACK_DATA))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card">
      <h2>Weekly Training Load</h2>
      {loading ? (
        <p className="loading">Loading chart…</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `${v}km`} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v) => [`${v} km`, "Distance"]}
              contentStyle={{ borderRadius: "8px", fontSize: "0.85rem" }}
            />
            <Bar dataKey="km" fill="#2ecc71" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
