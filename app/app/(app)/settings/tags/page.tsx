import { redirect } from "next/navigation";
import { getTeamForUser } from "@/lib/db/queries";
import { getTeamTags } from "@/lib/tags/queries";
import { Page } from "@/components/page";
import { TagsManagement } from "./_components/tags-management";

export default async function TagsPage() {
  const team = await getTeamForUser();

  if (!team) {
    redirect("/pricing");
  }

  const tags = await getTeamTags(team.id);

  return (
    <Page>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tags</h1>
          <p className="text-muted-foreground mt-2">
            Manage tags for organizing your challenge questions
          </p>
        </div>

        <TagsManagement initialTags={tags} />
      </div>
    </Page>
  );
}
