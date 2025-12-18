import { NextRequest, NextResponse } from "next/server";
import { getTeamForUser } from "@/lib/db/queries";
import {
  uploadImageToSupabase,
  generateChallengeImagePath,
} from "@/lib/storage/supabase";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const team = await getTeamForUser();
    if (!team) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const questionId = formData.get("questionId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Generate path (use temporary ID if questionId not provided yet)
    const tempId = questionId || `temp-${Date.now()}`;
    const path = generateChallengeImagePath(team.id, tempId, file.name);

    // Upload to Supabase
    const result = await uploadImageToSupabase(file, path);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      url: result.url,
      path: result.path,
    });
  } catch (error: any) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
