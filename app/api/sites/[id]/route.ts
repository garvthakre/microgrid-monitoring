import { mockSiteDetail } from "@/lib/mock"

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  return Response.json(mockSiteDetail(id))
}
