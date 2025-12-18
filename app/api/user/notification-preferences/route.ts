import { getUser } from "@/lib/db/queries";
import { NotificationType } from "@/lib/db/schema";

export async function GET() {
  const user = await getUser();
  
  if (!user) {
    return Response.json(null);
  }

  // Get notification preferences from user record
  const preferences = (user.notificationPreferences as Record<string, boolean>) || {};
  
  // Ensure all notification types have a value (default to true if not set)
  const allPreferences: Record<string, boolean> = {};
  Object.values(NotificationType).forEach((type) => {
    allPreferences[type] = preferences[type] ?? true;
  });

  return Response.json(allPreferences);
}

