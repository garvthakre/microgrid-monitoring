export type EnergyUnit = "kWh" | "MJ"
export type TempUnit = "C" | "F"
export type Currency = "INR" | "USD"

export const kWhToMJ = (kwh: number) => kwh * 3.6
export const MJToKWh = (mj: number) => mj / 3.6
export const cToF = (c: number) => (c * 9) / 5 + 32
export const fToC = (f: number) => ((f - 32) * 5) / 9
export const inrToUsd = (inr: number, rate = 0.012) => inr * rate
export const usdToInr = (usd: number, rate = 83) => usd * rate
