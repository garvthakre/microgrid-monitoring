import type { NextRequest } from "next/server"
import { SITES } from "@/lib/mock"

export async function GET() {
  return Response.json(SITES)
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  return Response.json({ ok: true, received: body })
}
