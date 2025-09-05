import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Bar,
  BarChart,
  RadialBarChart,
  RadialBar,
  Legend,
  ReferenceLine,
} from 'recharts';

// Enhanced color palettes for different themes
const colorPalettes = {
  energy: [
    'hsl(142, 76%, 36%)', // Emerald
    'hsl(158, 64%, 52%)', // Teal
    'hsl(173, 58%, 39%)', // Cyan
    'hsl(197, 37%, 24%)', // Slate
  ],
  performance: [
    'hsl(217, 91%, 60%)', // Blue
    'hsl(262, 83%, 58%)', // Purple
    'hsl(305, 85%, 40%)', // Fuchsia
    'hsl(336, 75%, 40%)', // Rose
  ],
  status: [
    'hsl(142, 76%, 36%)', // Success - Green
    'hsl(48, 96%, 53%)',  // Warning - Amber
    'hsl(0, 84%, 60%)',   // Critical - Red
    'hsl(215, 20%, 65%)', // Neutral - Gray
  ],
  gradient: [
    'hsl(217, 91%, 60%)',
    'hsl(142, 76%, 36%)',
    'hsl(48, 96%, 53%)',
    'hsl(305, 85%, 40%)',
  ],
};

type SeriesPoint = { x: string | number; y: number; [key: string]: any };
type ChartType = 'area' | 'line' | 'pie' | 'bar' | 'radial' | 'donut';

interface ChartCardProps {
  title: string;
  data: SeriesPoint[] | any[];
  type?: ChartType;
  seriesKey?: string;
  xKey?: string;
  colors?: string[];
  height?: number;
  palette?: keyof typeof colorPalettes;
  showGrid?: boolean;
  showLegend?: boolean;
  animated?: boolean;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

// Custom tooltip with enhanced styling
const CustomTooltip = ({ active, payload, label, valueFormatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-md border border-border/50 rounded-lg shadow-lg p-3 min-w-[120px]">
        {label && (
          <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        )}
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">
              {entry.name}: 
            </span>
            <span className="text-sm font-semibold text-foreground">
              {valueFormatter ? valueFormatter(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Enhanced grid component
const EnhancedGrid = ({ showGrid }: { showGrid: boolean }) => {
  if (!showGrid) return null;
  return (
    <CartesianGrid 
      strokeDasharray="2 4" 
      stroke="hsl(var(--border))" 
      strokeOpacity={0.3}
      horizontal={true}
      vertical={false}
    />
  );
};

// Trend indicator component
const TrendIndicator = ({ trend }: { trend?: 'up' | 'down' | 'neutral' }) => {
  if (!trend || trend === 'neutral') return null;
  
  const trendConfig = {
    up: { color: 'text-green-500', icon: '↗', bg: 'bg-green-50 dark:bg-green-950' },
    down: { color: 'text-red-500', icon: '↘', bg: 'bg-red-50 dark:bg-red-950' },
  };
  
  const config = trendConfig[trend];
  
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ${config.bg}`}>
      <span className={`${config.color} font-semibold`}>{config.icon}</span>
      <span className={config.color}>Trending {trend}</span>
    </div>
  );
};

export function ChartCard({
  title,
  data,
  type = 'area',
  seriesKey = 'y',
  xKey = 'x',
  colors,
  height = 280,
  palette = 'energy',
  showGrid = true,
  showLegend = false,
  animated = true,
  subtitle,
  trend,
  className = '',
}: ChartCardProps) {
  const selectedColors = colors || colorPalettes[palette];
  const compact = new Intl.NumberFormat(undefined, { 
    notation: 'compact', 
    maximumFractionDigits: 2 
  });

  const formatValue = (value: any) => {
    if (typeof value === 'number') {
      return compact.format(value);
    }
    return String(value);
  };

  const renderChart = () => {
    const commonProps = {
      data: data as any[],
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
    };

    switch (type) {
      case 'pie':
      case 'donut':
        return (
          <PieChart>
            <Pie
              data={data as any[]}
              dataKey={seriesKey}
              nameKey={xKey}
              innerRadius={type === 'donut' ? '60%' : 0}
              outerRadius="85%"
              cornerRadius={6}
              padAngle={3}
              stroke="transparent"
              strokeWidth={0}
            >
              {(data as any[]).map((_, i) => (
                <Cell 
                  key={i} 
                  fill={selectedColors[i % selectedColors.length]}
                  className="transition-all duration-300 hover:brightness-110"
                />
              ))}
            </Pie>
            {showLegend && (
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
              />
            )}
            <CustomTooltip valueFormatter={formatValue} />
          </PieChart>
        );

      case 'radial':
        return (
          <RadialBarChart {...commonProps} innerRadius="20%" outerRadius="90%">
            <RadialBar
              dataKey={seriesKey}
              fill={selectedColors[0]}
              cornerRadius={8}
              background={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
            />
            <CustomTooltip valueFormatter={formatValue} />
          </RadialBarChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <EnhancedGrid showGrid={showGrid} />
            <XAxis 
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickMargin={12}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickMargin={8}
              width={50}
            />
            <Bar
              dataKey={seriesKey}
              fill={selectedColors[0]}
              radius={[4, 4, 0, 0]}
              className="transition-all duration-300 hover:brightness-110"
            />
            <CustomTooltip valueFormatter={formatValue} />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <defs>
              <linearGradient id="lineGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={selectedColors[0]} stopOpacity={0.8} />
                <stop offset="100%" stopColor={selectedColors[0]} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <EnhancedGrid showGrid={showGrid} />
            <XAxis 
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickMargin={12}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickMargin={8}
              width={50}
            />
            <Line
              type="monotone"
              dataKey={seriesKey}
              stroke={selectedColors[0]}
              strokeWidth={3}
              dot={{ fill: selectedColors[0], strokeWidth: 0, r: 4 }}
              activeDot={{ 
                r: 6, 
                strokeWidth: 0, 
                fill: selectedColors[0],
                className: "drop-shadow-lg"
              }}
              isAnimationActive={animated}
            />
            <CustomTooltip valueFormatter={formatValue} />
          </LineChart>
        );

      case 'area':
      default:
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={selectedColors[0]} stopOpacity={0.4} />
                <stop offset="50%" stopColor={selectedColors[0]} stopOpacity={0.2} />
                <stop offset="100%" stopColor={selectedColors[0]} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <EnhancedGrid showGrid={showGrid} />
            <XAxis 
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickMargin={12}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickMargin={8}
              width={50}
            />
            <Area
              type="monotone"
              dataKey={seriesKey}
              stroke={selectedColors[0]}
              strokeWidth={2.5}
              fill="url(#areaGradient)"
              isAnimationActive={animated}
              dot={{ fill: selectedColors[0], strokeWidth: 0, r: 3 }}
              activeDot={{ 
                r: 5, 
                strokeWidth: 0, 
                fill: selectedColors[0],
                className: "drop-shadow-lg"
              }}
            />
            <CustomTooltip valueFormatter={formatValue} />
          </AreaChart>
        );
    }
  };

  return (
    <Card className={`group transition-all duration-300 hover:shadow-lg border-border/50 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <TrendIndicator trend={trend} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div 
          style={{ height }} 
          role="region" 
          aria-label={`${title} chart`}
          className="h-full w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Demo component showing various chart types
export default function ChartShowcase() {
  // Sample data for demonstrations
  const timeSeriesData = [
    { x: '00:00', y: 45 },
    { x: '04:00', y: 32 },
    { x: '08:00', y: 68 },
    { x: '12:00', y: 89 },
    { x: '16:00', y: 76 },
    { x: '20:00', y: 54 },
  ];

  const distributionData = [
    { x: 'Solar', y: 65 },
    { x: 'Wind', y: 25 },
    { x: 'Battery', y: 10 },
  ];

  const performanceData = [
    { x: 'Jan', y: 85 },
    { x: 'Feb', y: 92 },
    { x: 'Mar', y: 78 },
    { x: 'Apr', y: 96 },
    { x: 'May', y: 88 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-background">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Enhanced Chart Components</h1>
        <p className="text-muted-foreground">Modern, interactive charts with improved design and animations</p>
      </div>

      {/* Energy Generation Charts */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EnhancedChartCard
          title="Real-time Generation"
          subtitle="Solar & wind output today"
          data={timeSeriesData}
          type="area"
          palette="energy"
          trend="up"
          height={240}
        />
        
        <EnhancedChartCard
          title="Energy Mix"
          subtitle="Current distribution"
          data={distributionData}
          type="donut"
          palette="energy"
          showLegend={true}
          height={240}
        />

        <EnhancedChartCard
          title="Performance Trend"
          subtitle="Monthly efficiency"
          data={performanceData}
          type="line"
          palette="performance"
          trend="up"
          height={240}
        />
      </div>

      {/* Status and Analytics */}
      <div className="grid md:grid-cols-2 gap-6">
        <EnhancedChartCard
          title="System Load"
          subtitle="Current consumption patterns"
          data={timeSeriesData.map(d => ({ ...d, y: d.y * 0.8 }))}
          type="bar"
          palette="status"
          height={300}
        />

        <EnhancedChartCard
          title="Battery Health"
          subtitle="State of charge indicator"
          data={[{ x: 'SoC', y: 78 }]}
          type="radial"
          palette="performance"
          height={300}
        />
      </div>

      {/* Large Analytics Chart */}
      <div className="w-full">
        <EnhancedChartCard
          title="Fleet-wide Analytics"
          subtitle="Comprehensive view of all microgrid sites"
          data={Array.from({ length: 24 }, (_, i) => ({
            x: `${i.toString().padStart(2, '0')}:00`,
            y: 40 + Math.sin(i * 0.5) * 20 + Math.random() * 10,
          }))}
          type="area"
          palette="gradient"
          trend="up"
          height={350}
          className="col-span-full"
        />
      </div>
    </div>
  );
}