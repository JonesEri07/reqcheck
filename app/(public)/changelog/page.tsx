import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ChangelogPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Changelog</h1>
        <p className="text-lg text-muted-foreground">
          Recent updates and improvements to the platform.
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Version 1.0.0</CardTitle>
              <span className="text-sm text-muted-foreground">2024-01-01</span>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>Initial release</CardDescription>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
