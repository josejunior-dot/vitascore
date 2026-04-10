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
    <div className="rounded-lg border border-white/10 bg-[#1C1C1E] px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-white">{label}</p>
      <p className="text-sm text-[#1877F2]">
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
            <stop offset="0%" stopColor="#1877F2" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#1877F2" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#ffffff", fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
          y={7}
          stroke="rgba(255,255,255,0.3)"
          strokeDasharray="6 3"
          strokeWidth={1}
          label={{
            value: "7h",
            position: "right",
            fill: "rgba(255,255,255,0.5)",
            fontSize: 11,
          }}
        />
        <Area
          type="monotone"
          dataKey="hours"
          stroke="#1877F2"
          strokeWidth={2}
          fill="url(#sleepGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
