"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react"
import { useMemo } from "react"

// Enhanced types for better type safety
type SeriesPoint = { x: string | number; y: number; [key: string]: any }
type ChartType = "area" | "line" | "pie"

// Trend calculation helper
const calculateTrend = (data: SeriesPoint[], seriesKey: string): "up" | "down" | "neutral" => {
  if (data.length < 2) return "neutral"
  const firstValue = data[0]?.[seriesKey] || 0
  const lastValue = data[data.length - 1]?.[seriesKey] || 0
  const diff = lastValue - firstValue
  if (Math.abs(diff) < firstValue * 0.05) return "neutral" // 5% threshold
  return diff > 0 ? "up" : "down"
}

// Vibrant color palettes for light and dark themes
const VIBRANT_COLORS = {
  light: [
    "#6366f1", // Indigo
    "#ec4899", // Pink  
    "#06b6d4", // Cyan
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Violet
    "#14b8a6", // Teal
  ],
  dark: [
    "#818cf8", // Light Indigo
    "#f472b6", // Light Pink
    "#22d3ee", // Light Cyan
    "#34d399", // Light Emerald
    "#fbbf24", // Light Amber
    "#f87171", // Light Red
    "#a78bfa", // Light Violet
    "#2dd4bf", // Light Teal
  ]
}

// Get theme-appropriate colors
const getThemeColors = () => {
  // In a real app, you'd detect theme from context or CSS custom properties
  // For now, we'll use CSS custom properties that work with both themes
  return [
    "hsl(239 84% 67%)", // Modern Indigo
    "hsl(330 81% 60%)", // Vibrant Pink
    "hsl(188 94% 43%)", // Electric Cyan
    "hsl(160 84% 39%)", // Fresh Green
    "hsl(43 96% 56%)",  // Golden Yellow
    "hsl(0 84% 60%)",   // Coral Red
    "hsl(256 92% 76%)", // Purple
    "hsl(173 80% 40%)", // Teal
  ]
}

export function ChartCard({
  title,
  data,
  type = "area",
  seriesKey = "y",
  xKey = "x",
  colors = getThemeColors(),
  height,
  showTrend = true,
  showLegend = false,
  loading = false,
  error,
  subtitle,
  className = "",
}: {
  title: string
  data: SeriesPoint[] | any[]
  type?: ChartType
  seriesKey?: string
  xKey?: string
  colors?: string[]
  height?: number
  showTrend?: boolean
  showLegend?: boolean
  loading?: boolean
  error?: string
  subtitle?: string
  className?: string
}) {
  // Responsive height calculation
  const responsiveHeight = height || (type === "pie" ? 280 : 320)
  
  // Memoized calculations for performance
  const { trend, totalValue, hasData } = useMemo(() => {
    const hasData = Array.isArray(data) && data.length > 0
    if (!hasData) {
      return { trend: "neutral" as const, totalValue: 0, hasData: false }
    }

    const trend = type !== "pie" ? calculateTrend(data as SeriesPoint[], seriesKey) : "neutral"
    const totalValue = type === "pie" 
      ? (data as any[]).reduce((sum, item) => sum + (item[seriesKey] || 0), 0)
      : (data as SeriesPoint[])[data.length - 1]?.[seriesKey] || 0

    return { trend, totalValue, hasData }
  }, [data, seriesKey, type])

  // Enhanced styling with colors and effects
  const gridColor = "hsl(var(--border) / 0.3)"
  const mutedColor = "hsl(var(--muted-foreground) / 0.7)"
  const compact = new Intl.NumberFormat(undefined, { 
    notation: "compact", 
    maximumFractionDigits: 2 
  })

  // Dynamic trend styling with colors and effects
  const trendConfig = {
    up: { 
      icon: TrendingUp, 
      color: "text-emerald-500 dark:text-emerald-400", 
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-200 dark:border-emerald-800/50"
    },
    down: { 
      icon: TrendingDown, 
      color: "text-rose-500 dark:text-rose-400", 
      bg: "bg-rose-50 dark:bg-rose-950/30",
      border: "border-rose-200 dark:border-rose-800/50"
    },
    neutral: { 
      icon: Minus, 
      color: "text-amber-500 dark:text-amber-400", 
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-800/50"
    }
  }

  const currentTrend = trendConfig[trend]
  const TrendIcon = currentTrend.icon

  // Enhanced tooltip formatter with colors
  const tooltipFormatter = (value: any, name: any) => [
    typeof value === "number" ? compact.format(value) : String(value),
    name || title
  ]

  // Beautiful loading state with gradient animation
  if (loading) {
    return (
      <Card className={`h-full overflow-hidden relative ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
        <CardHeader className="pb-3 relative z-10">
          <div className="h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg w-3/4 animate-pulse opacity-30" />
          {subtitle && <div className="h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded w-1/2 mt-2 animate-pulse opacity-20" />}
        </CardHeader>
        <CardContent className="pt-0 relative z-10">
          <div 
            style={{ height: `${responsiveHeight}px` }}
            className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 rounded-xl border border-purple-200/50 dark:border-purple-800/30 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-shimmer" />
            <div className="absolute top-4 left-4">
              <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Colorful error state
  if (error) {
    return (
      <Card className={`h-full border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20 ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-rose-700 dark:text-rose-400">{title}</CardTitle>
          {subtitle && <p className="text-xs text-rose-600/70 dark:text-rose-400/70 mt-1">{subtitle}</p>}
        </CardHeader>
        <CardContent className="pt-0 flex items-center justify-center" style={{ height: `${responsiveHeight}px` }}>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center">
              <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Colorful no data state
  if (!hasData) {
    return (
      <Card className={`h-full border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</CardTitle>
          {subtitle && <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{subtitle}</p>}
        </CardHeader>
        <CardContent className="pt-0 flex items-center justify-center" style={{ height: `${responsiveHeight}px` }}>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center border border-blue-200/50 dark:border-blue-800/30">
              <svg className="w-8 h-8 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">No data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`h-full transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/5 hover:-translate-y-1 border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-900/95 dark:to-indigo-950/20 ${className}`}>
      <CardHeader className="pb-3 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200 text-pretty leading-tight line-clamp-2">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                {subtitle}
              </p>
            )}
          </div>
          
          {showTrend && type !== "pie" && (
            <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full border ${currentTrend.bg} ${currentTrend.border} shrink-0 shadow-sm`}>
              <TrendIcon className={`h-3.5 w-3.5 ${currentTrend.color}`} />
              <span className={`text-xs font-semibold ${currentTrend.color}`}>
                {compact.format(totalValue)}
              </span>
            </div>
          )}
          
          {type === "pie" && (
            <div className="text-right shrink-0 px-3 py-2 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border border-indigo-200/50 dark:border-indigo-800/50">
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 block">Total</span>
              <div className="text-sm font-bold text-indigo-700 dark:text-indigo-300">{compact.format(totalValue)}</div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div
          style={{ height: `${responsiveHeight}px` }}
          className="w-full rounded-xl bg-gradient-to-br from-white/80 via-blue-50/50 to-indigo-50/30 dark:from-slate-900/80 dark:via-slate-800/50 dark:to-indigo-950/30 border border-blue-200/30 dark:border-slate-700/50 p-2 shadow-inner"
          role="img"
          aria-label={`${title} ${type} chart`}
        >
          <ChartContainer 
            config={{ 
              series: { 
                label: title, 
                color: colors[0] 
              } 
            }} 
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              {type === "pie" ? (
                <PieChart margin={{ top: 15, right: 15, bottom: 15, left: 15 }}>
                  <defs>
                    {colors.map((color, i) => (
                      <linearGradient key={i} id={`pieGradient${i}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={data as any[]}
                    dataKey={seriesKey}
                    nameKey={xKey}
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="82%"
                    cornerRadius={6}
                    padAngle={4}
                    stroke="hsl(var(--background))"
                    strokeWidth={3}
                  >
                    {(data as any[]).map((_, i) => (
                      <Cell 
                        key={i} 
                        fill={`url(#pieGradient${i % colors.length})`}
                        className="hover:opacity-80 transition-all duration-200 drop-shadow-sm"
                        style={{ 
                          filter: `drop-shadow(0 2px 4px ${colors[i % colors.length]}20)` 
                        }}
                      />
                    ))}
                  </Pie>
                  {showLegend && (
                    <Legend 
                      verticalAlign="bottom" 
                      height={40}
                      iconSize={10}
                      wrapperStyle={{ 
                        fontSize: "12px", 
                        fontWeight: "500",
                        color: "hsl(var(--foreground))"
                      }}
                    />
                  )}
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={tooltipFormatter}
                        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border border-blue-200/50 dark:border-slate-700/50 shadow-2xl rounded-xl"
                      />
                    }
                  />
                </PieChart>
              ) : type === "line" ? (
                <LineChart 
                  data={data as any[]} 
                  margin={{ top: 15, right: 15, bottom: 15, left: 15 }}
                >
                  <defs>
                    <linearGradient id={`lineGlow`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={colors[0]} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={colors[1] || colors[0]} stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="2 4" 
                    stroke={gridColor} 
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis
                    dataKey={xKey}
                    axisLine={false}
                    tickLine={false}
                    tickMargin={12}
                    minTickGap={35}
                    fontSize={11}
                    fill={mutedColor}
                    interval="preserveStartEnd"
                    className="font-medium"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickMargin={12}
                    width={45}
                    fontSize={11}
                    fill={mutedColor}
                    tickFormatter={(value) => compact.format(value)}
                    className="font-medium"
                  />
                  <ChartTooltip
                    cursor={{ 
                      stroke: colors[0], 
                      strokeDasharray: "4 4", 
                      strokeWidth: 2,
                      strokeOpacity: 0.5
                    }}
                    content={
                      <ChartTooltipContent
                        formatter={tooltipFormatter}
                        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border border-blue-200/50 dark:border-slate-700/50 shadow-2xl rounded-xl"
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey={seriesKey}
                    stroke={`url(#lineGlow)`}
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ 
                      r: 6, 
                      strokeWidth: 3, 
                      stroke: colors[0],
                      fill: "hsl(var(--background))",
                      style: { 
                        filter: `drop-shadow(0 0 8px ${colors[0]}40)` 
                      }
                    }}
                    style={{ 
                      filter: `drop-shadow(0 2px 6px ${colors[0]}30)` 
                    }}
                  />
                </LineChart>
              ) : (
                <AreaChart 
                  data={data as any[]}
                  margin={{ top: 15, right: 15, bottom: 15, left: 15 }}
                >
                  <defs>
                    <linearGradient id={`areaGradient-${seriesKey}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors[0]} stopOpacity={0.4} />
                      <stop offset="50%" stopColor={colors[1] || colors[0]} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={colors[0]} stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id={`areaStroke`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={colors[0]} stopOpacity={0.9} />
                      <stop offset="50%" stopColor={colors[1] || colors[0]} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={colors[2] || colors[0]} stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="2 4" 
                    stroke={gridColor}
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis
                    dataKey={xKey}
                    axisLine={false}
                    tickLine={false}
                    tickMargin={12}
                    minTickGap={35}
                    fontSize={11}
                    fill={mutedColor}
                    interval="preserveStartEnd"
                    className="font-medium"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickMargin={12}
                    width={45}
                    fontSize={11}
                    fill={mutedColor}
                    tickFormatter={(value) => compact.format(value)}
                    className="font-medium"
                  />
                  <ChartTooltip
                    cursor={{ 
                      stroke: colors[0], 
                      strokeDasharray: "4 4", 
                      strokeWidth: 2,
                      strokeOpacity: 0.5
                    }}
                    content={
                      <ChartTooltipContent
                        formatter={tooltipFormatter}
                        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border border-blue-200/50 dark:border-slate-700/50 shadow-2xl rounded-xl"
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey={seriesKey}
                    stroke={`url(#areaStroke)`}
                    strokeWidth={3}
                    fill={`url(#areaGradient-${seriesKey})`}
                    dot={false}
                    activeDot={{ 
                      r: 6, 
                      strokeWidth: 3, 
                      stroke: colors[0],
                      fill: "hsl(var(--background))",
                      style: { 
                        filter: `drop-shadow(0 0 8px ${colors[0]}50)` 
                      }
                    }}
                    style={{ 
                      filter: `drop-shadow(0 2px 8px ${colors[0]}20)` 
                    }}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}