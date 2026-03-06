"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from "recharts"

interface Result {
  submitted_at: string
  metric_values: Record<string, number>
  model_name?: string
}

interface Metric {
  name: string
  higher_is_better: boolean
}

interface ChartPoint {
  date: string
  value: number
  label: string
  isBest: boolean
}

interface Props {
  results: Result[]
  metric: Metric
}

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
}

export default function PerformanceChart({ results, metric }: Props) {
  // Sort by date ascending
  const sorted = [...results]
    .filter((r) => r.metric_values[metric.name] !== undefined)
    .sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime())

  if (sorted.length < 2) return null

  // Compute running best
  const points: ChartPoint[] = []
  let runningBest: number | null = null

  for (const r of sorted) {
    const val = r.metric_values[metric.name]
    const isBetter =
      runningBest === null ||
      (metric.higher_is_better ? val > runningBest : val < runningBest)

    if (isBetter) runningBest = val

    points.push({
      date: formatDateLabel(r.submitted_at),
      value: runningBest!,
      label: r.model_name ?? "",
      isBest: isBetter,
    })
  }

  // Y-axis domain with a little padding
  const values = points.map((p) => p.value)
  const minVal = Math.min(...values)
  const maxVal = Math.max(...values)
  const pad = (maxVal - minVal) * 0.15 || maxVal * 0.1
  const yMin = metric.higher_is_better
    ? Math.max(0, minVal - pad)
    : Math.max(0, minVal - pad)
  const yMax = maxVal + pad

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={points} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            width={48}
            tickFormatter={(v: number) =>
              Number.isInteger(v) ? String(v) : v.toFixed(3)
            }
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            formatter={(value: number | undefined) => [
              value === undefined ? "—" : Number.isInteger(value) ? value : value.toFixed(4),
              metric.name,
            ]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={<Dot r={4} fill="#3b82f6" stroke="#fff" strokeWidth={2} />}
            activeDot={{ r: 6, fill: "#1a56db" }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-center mt-1">
        <span className="text-xs text-gray-400 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
          Best result per paper
        </span>
      </div>
    </div>
  )
}
