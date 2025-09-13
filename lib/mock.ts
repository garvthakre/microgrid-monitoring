export type Site = {
  id: string
  name: string
  health: "good" | "warning" | "critical"
  coords: { x: number; y: number }
}

// Chhattisgarh sites (approximate positions on placeholder map as percentages)
export const SITES: Site[] = [
  { id: "OR-001", name: "Raghurajpur Crafts Village", health: "good", coords: { x: 75, y: 58 } },
  { id: "OR-002", name: "Babeijoda Tribal Settlement", health: "warning", coords: { x: 80, y: 25 } },
  { id: "OR-003", name: "Bhuban Metal Crafts Village", health: "critical", coords: { x: 62, y: 40 } },
  { id: "OR-004", name: "Nuapatna Weaving Cluster", health: "good", coords: { x: 68, y: 50 } },
  { id: "OR-005", name: "R. Udayagiri Power Project", health: "good", coords: { x: 85, y: 70 } },
  { id: "OR-006", name: "Danguria Tribal Village", health: "warning", coords: { x: 55, y: 85 } },
  { id: "OR-007", name: "Fategarh Agri Hub", health: "good", coords: { x: 70, y: 65 } },
  { id: "OR-008", name: "Pipili Artisan Market", health: "good", coords: { x: 73, y: 60 } },
  { id: "OR-009", name: "Khalana Rural Electrification", health: "critical", coords: { x: 66, y: 45 } },
  { id: "OR-010", name: "Serango Farm Collective", health: "warning", coords: { x: 88, y: 72 } },
];

export function randomWalk(prev: number, step = 2, min = 0, max = 100) {
  const next = prev + (Math.random() * step * 2 - step)
  return Math.max(min, Math.min(max, next))
}

export function makeSeries(n = 24, start = 50, min = 0, max = 100) {
  const out: { x: string; y: number }[] = []
  let v = start
  for (let i = 0; i < n; i++) {
    v = randomWalk(v, 8, min, max)
    out.push({ x: `${i}`, y: Math.round(v * 10) / 10 })
  }
  return out
}

function solarCurve(hour: number, sunrise = 6, sunset = 18, peak = 100) {
  if (hour < sunrise || hour > sunset) return 0
  const t = (hour - sunrise) / (sunset - sunrise) // 0..1
  // Smooth midday peak
  return Math.sin(Math.PI * t) * peak
}

function loadCurve(hour: number, base = 40, morningPeak = 14, eveningPeak = 18) {
  // Morning bump around 8, evening bump around 19
  const m = Math.exp(-0.5 * Math.pow((hour - 8) / 2.2, 2)) * morningPeak
  const e = Math.exp(-0.5 * Math.pow((hour - 19) / 2.2, 2)) * eveningPeak
  return base + m + e
}

function makeDiurnalSeries(n = 24, genScale = 1, loadScale = 1) {
  const gen: { x: string; y: number }[] = []
  const load: { x: string; y: number }[] = []
  const soc: { x: string; y: number }[] = []
  let stateSoc = 65 + Math.random() * 10
  for (let h = 0; h < n; h++) {
    const g = Math.max(0, Math.min(100, solarCurve(h, 6, 18, 90) * genScale + (Math.random() * 10 - 5)))
    const l = Math.max(10, Math.min(100, loadCurve(h) * 0.8 * loadScale + (Math.random() * 6 - 3)))
    // Simple SOC integration (bounded)
    stateSoc = Math.max(10, Math.min(100, stateSoc + (g - l) * 0.05))
    gen.push({ x: `${h}`, y: Math.round(g * 10) / 10 })
    load.push({ x: `${h}`, y: Math.round(l * 10) / 10 })
    soc.push({ x: `${h}`, y: Math.round(stateSoc) })
  }
  return { generation: gen, consumption: load, soc }
}

export function mockSiteDetail(id: string) {
  const base = SITES.find((s) => s.id === id) || SITES[0]
  // Site-specific scaling to vary profiles subtly
  const genScale = 0.9 + Math.random() * 0.3
  const loadScale = 0.9 + Math.random() * 0.3
  const series = makeDiurnalSeries(24, genScale, loadScale)
  const lastG = series.generation.at(-1)?.y ?? 50
  const lastL = series.consumption.at(-1)?.y ?? 45
  const lastSoc = series.soc.at(-1)?.y ?? 70

  return {
    id,
    name: base.name,
    health: base.health,
    kpis: {
      gen: +lastG.toFixed(1),
      load: +lastL.toFixed(1),
      soc: +lastSoc.toFixed(0),
      soh: +(80 + Math.random() * 10).toFixed(0),
      cycles: +(900 + Math.random() * 200).toFixed(0),
      carbon: +(lastG * 0.03 + Math.random() * 0.2).toFixed(2),
      dieselOffset: +(lastG * 0.08 + Math.random() * 0.7).toFixed(1),
    },
    series,
  }
}

export function mockFleetSummary() {
  const totalSites = SITES.length
  const good = SITES.filter((s) => s.health === "good").length
  const warning = SITES.filter((s) => s.health === "warning").length
  const critical = SITES.filter((s) => s.health === "critical").length
  return { totalSites, good, warning, critical }
}

export function expectedVsActual() {
  const exp = makeDiurnalSeries(24, 1, 1).generation
  const act = exp.map((p) => ({
    x: p.x,
    y: Math.max(0, Math.min(100, p.y + (Math.random() * 8 - 4))),
  }))
  return { expected: exp, actual: act }
}
