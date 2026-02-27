"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { oddsHistory } from "@/data/mock-data";

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffD >= 1) return `-${diffD}d`;
  if (diffH >= 1) return `-${diffH}h`;
  return "Now";
}

const chartData = oddsHistory.map((pt) => ({
  time: formatTimestamp(pt.timestamp),
  Home: pt.homeOdds,
  Draw: pt.drawOdds,
  Away: pt.awayOdds,
}));

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-card p-3 shadow-sm text-sm space-y-1">
      <p className="text-xs text-muted-foreground font-mono mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: entry.color }}
            />
            <span className="text-muted-foreground text-xs">{entry.name}</span>
          </div>
          <span className="font-mono font-semibold text-xs">{entry.value.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

export function OddsHistoryChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" vertical={false} />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 10, fill: "oklch(0.60 0 0)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={["auto", "auto"]}
          tick={{ fontSize: 10, fill: "oklch(0.60 0 0)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => v.toFixed(1)}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
          iconType="circle"
          iconSize={7}
        />
        <Line
          type="monotone"
          dataKey="Home"
          stroke="oklch(0.72 0.22 145)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
        <Line
          type="monotone"
          dataKey="Draw"
          stroke="oklch(0.75 0.16 85)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
        <Line
          type="monotone"
          dataKey="Away"
          stroke="oklch(0.65 0.15 200)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
