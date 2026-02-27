"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import type {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import type { ApiUsagePoint } from "@/lib/types";
import { formatCompactNumber } from "@/lib/formatters";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipContentProps<ValueType, NameType>) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border text-sm shadow-lg"
      style={{
        background: "var(--card)",
        borderColor: "oklch(1 0 0 / 0.12)",
        padding: "0.75rem",
      }}
    >
      <p className="font-medium mb-2" style={{ color: "var(--foreground)" }}>
        {label}
      </p>
      {payload.map((entry, i) => (
        <p
          key={i}
          className="flex items-center gap-2 text-xs"
          style={{ color: "var(--muted-foreground)" }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color as string }}
          />
          {entry.name === "requests"
            ? `API Requests: `
            : `Avg Latency: `}
          <span
            className="font-mono font-medium"
            style={{ color: "var(--foreground)" }}
          >
            {entry.name === "requests"
              ? formatCompactNumber(entry.value as number)
              : `${entry.value}ms`}
          </span>
        </p>
      ))}
    </div>
  );
};

export function ApiUsageChart({ data }: { data: ApiUsagePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="fillRequests" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.30} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="fillLatency" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="oklch(1 0 0 / 0.07)"
          strokeOpacity={1}
        />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="requests"
          orientation="left"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => formatCompactNumber(v as number)}
        />
        <YAxis
          yAxisId="latency"
          orientation="right"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}ms`}
        />
        <Tooltip content={(props) => <CustomTooltip {...props} />} />
        <Legend
          wrapperStyle={{ fontSize: "11px", color: "var(--muted-foreground)" }}
        />
        <Area
          yAxisId="requests"
          type="monotone"
          dataKey="requests"
          name="requests"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#fillRequests)"
          dot={false}
        />
        <Area
          yAxisId="latency"
          type="monotone"
          dataKey="latency"
          name="latency"
          stroke="var(--chart-2)"
          strokeWidth={2}
          fill="url(#fillLatency)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
