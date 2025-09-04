import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function NotAuthorized() {
  return (
    <Card className="max-w-lg mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-balance">Access restricted</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          You do not have permission to view this section with your current role. Please switch roles if you have
          authorization.
        </p>
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="default">Go to Overview</Button>
          </Link>
          <Link href="/govt">
            <Button variant="outline">Public View</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
