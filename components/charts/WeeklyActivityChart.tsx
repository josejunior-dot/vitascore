"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface ActivityData {
  day: string;
  steps: number;
  goal: number;
}

interface WeeklyActivityChartProps {
  data: ActivityData[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#1C1C1E] px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-white">{label}</p>
      <p className="text-sm text-[#1877F2]">
        {payload[0].value.toLocaleString()} passos
      </p>
    </div>
  );
}

export default function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#ffffff", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#ffffff99", fontSize: 10 }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
        <ReferenceLine
          y={10000}
          stroke="#FF9F0A"
          strokeDasharray="6 3"
          strokeWidth={1.5}
          label={{
            value: "Meta",
            position: "right",
            fill: "#FF9F0A",
            fontSize: 11,
          }}
        />
        <Bar
          dataKey="steps"
          fill="#1877F2"
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
