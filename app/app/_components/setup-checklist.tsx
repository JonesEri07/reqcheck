import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";
import { BillingPlan } from "@/lib/db/schema";

interface SetupChecklistProps {
  companyId: number;
  billingPlan: BillingPlan;
}

export function SetupChecklist({
  companyId,
  billingPlan,
}: SetupChecklistProps) {
  // TODO: Implement actual checklist items based on company setup status
  // For now, showing a placeholder structure
  const checklistItems = [
    {
      id: "payment",
      label: "Add payment method",
      completed: billingPlan !== BillingPlan.FREE,
    },
    {
      id: "domain",
      label: "Configure domain whitelist",
      completed: false,
    },
    {
      id: "skills",
      label: "Add your first skill",
      completed: false,
    },
    {
      id: "job",
      label: "Create your first job",
      completed: false,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Setup Checklist</CardTitle>
        <CardDescription>
          Complete these steps to get the most out of reqCHECK
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {checklistItems.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              {item.completed ? (
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
              <span
                className={
                  item.completed
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                }
              >
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
