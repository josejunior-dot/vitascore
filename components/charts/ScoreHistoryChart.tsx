"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ScoreData {
  month: string;
  score: number;
}

interface DiscountData {
  month: string;
  discount: number;
  average: number;
}

interface ScoreHistoryChartProps {
  data: ScoreData[];
  discountData?: DiscountData[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#1C1C1E] px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-medium text-white">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export default function ScoreHistoryChart({
  data,
  discountData,
}: ScoreHistoryChartProps) {
  const useDiscount = discountData && discountData.length > 0;
  const chartData: any[] = useDiscount ? discountData : data;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#ffffff", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#ffffff99", fontSize: 10 }}
        />
        <Tooltip content={<CustomTooltip />} />
        {useDiscount ? (
          <>
            <Line
              type="monotone"
              dataKey="discount"
              name="Você"
              stroke="#30D158"
              strokeWidth={2}
              dot={{ r: 4, fill: "#30D158" }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="average"
              name="Média"
              stroke="#FF9F0A"
              strokeWidth={2}
              dot={{ r: 4, fill: "#FF9F0A" }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
              animationDuration={800}
            />
          </>
        ) : (
          <Line
            type="monotone"
            dataKey="score"
            name="Score"
            stroke="#1877F2"
            strokeWidth={2}
            dot={{ r: 4, fill: "#1877F2" }}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
            animationDuration={800}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
