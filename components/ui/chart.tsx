"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> })
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

type ChartContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  config?: Record<
    string,
    {
      label?: string
      color?: string // hsl color value
    }
  >
}

export function ChartContainer({ children, className, config = {}, ...props }: ChartContainerProps) {
  const styleVars: React.CSSProperties = {}
  // Map series keys to CSS vars for Recharts stroke="var(--color-{key})"
  for (const key of Object.keys(config)) {
    const cssVarName = `--color-${key}`
    ;(styleVars as any)[cssVarName as any] = config[key]?.color
  }

  return (
    <div className={cn("relative", className)} style={styleVars} {...props}>
      {children}
    </div>
  )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, config]) => config.theme || config.color)

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  )
}

type TooltipContentProps = {
  indicator?: "line" | "dot"
  labelFormatter?: (label: any) => React.ReactNode
  valueFormatter?: (value: any, name: string) => React.ReactNode
  className?: string
}

export function ChartTooltip({
  content,
  cursor,
}: {
  content: React.ReactNode
  cursor?: any
}) {
  // This is a thin wrapper expected by Recharts in your chart components
  // Intentionally left as-is if your implementation already wraps Recharts' Tooltip
  return (
    // @ts-expect-error - Recharts Tooltip is injected at usage site
    <RechartsPrimitive.Tooltip content={content} cursor={cursor} />
  )
}

export function ChartTooltipContent({
  indicator = "line",
  labelFormatter,
  valueFormatter,
  className,
}: TooltipContentProps) {
  // The actual content is injected by Recharts with payload props; keep types broad for compatibility
  // @ts-expect-error - Recharts injects these
  return function RenderTooltip({ active, label, payload }) {
    if (!active || !payload || payload.length === 0) return null

    const renderLabel = labelFormatter ? labelFormatter(label) : label

    return (
      <div
        className={cn("rounded-md border bg-popover p-3 text-popover-foreground shadow-lg", "min-w-[180px]", className)}
        role="dialog"
        aria-label="Chart details"
      >
        <div className="mb-2 text-xs font-medium text-muted-foreground">{renderLabel}</div>
        <div className="space-y-1">
          {payload.map((entry: any) => {
            const name = entry.name
            const color = entry.color
            const value = entry.value

            return (
              <div key={name} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-block h-2 w-2 rounded-full",
                      indicator === "line" ? "ring-1 ring-offset-1" : "",
                    )}
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                  />
                  <span className="text-xs text-muted-foreground">{name}</span>
                </div>
                <div className="text-sm font-medium">{valueFormatter ? valueFormatter(value, name) : value}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> &
  Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
    hideIcon?: boolean
    nameKey?: string
  }) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}>
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`
        const itemConfig = getPayloadConfigFromPayload(config, item, key)

        return (
          <div
            key={item.value}
            className={cn("[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3")}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig?.label}
          </div>
        )
      })}
    </div>
  )
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload && typeof payload.payload === "object" && payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (key in payload && typeof payload[key as keyof typeof payload] === "string") {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string
  }

  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config]
}

export { ChartLegend, ChartLegendContent, ChartStyle }
