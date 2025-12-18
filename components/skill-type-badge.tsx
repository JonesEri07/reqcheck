import { Badge } from "@/components/ui/badge";

interface SkillTypeBadgeProps {
  isLinked: boolean;
  className?: string;
}

/**
 * Badge component to display whether a skill is "Linked" (to global skill) or "Custom"
 * @param isLinked - Whether the skill is linked to a global skill taxonomy
 * @param className - Optional additional CSS classes
 */
export function SkillTypeBadge({ isLinked, className }: SkillTypeBadgeProps) {
  return (
    <Badge variant={isLinked ? "secondary" : "outline"} className={className}>
      {isLinked ? "Linked" : "Custom"}
    </Badge>
  );
}
