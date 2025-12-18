import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RoadmapPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Roadmap</h1>
        <p className="text-lg text-muted-foreground">
          See what we're building and what's coming next.
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              We're working on exciting new features. Check back soon!
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
