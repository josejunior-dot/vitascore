"use client";

import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface SleepData {
  date: string;
  hours: number;
  quality: number;
}

interface SleepQualityChartProps {
  data: SleepData[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#DADCE0] bg-white border-[#DADCE0] px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-[#202124]">{label}</p>
      <p className="text-sm text-[#1A73E8]">
        {payload[0].value.toFixed(1)}h de sono
      </p>
    </div>
  );
}

export default function SleepQualityChart({ data }: SleepQualityChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A73E8" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#1A73E8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#202124", fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
          y={7}
          stroke="#DADCE0"
          strokeDasharray="6 3"
          strokeWidth={1}
          label={{
            value: "7h",
            position: "right",
            fill: "#5F6368",
            fontSize: 11,
          }}
        />
        <Area
          type="monotone"
          dataKey="hours"
          stroke="#1A73E8"
          strokeWidth={2}
          fill="url(#sleepGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
