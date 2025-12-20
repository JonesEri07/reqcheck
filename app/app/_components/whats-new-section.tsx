import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export function WhatsNewSection() {
  const updates: {
    id: string;
    title: string;
    description: string;
    date: string;
  }[] = [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>What's New</CardTitle>
        </div>
        <CardDescription>
          Recent updates and improvements to reqCHECK
        </CardDescription>
      </CardHeader>
      <CardContent>
        {updates.length > 0 ? (
          <ul className="space-y-4">
            {updates.map((update) => (
              <li
                key={update.id}
                className="border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {update.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {update.description}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(update.date).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Check back regularly for new updates and improvements!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
