import { NextResponse } from "next/server";
// import { requireAdmin } from "@/lib/auth/admin";
// import { getGlobalSkillById } from "@/lib/db/admin-queries";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // await requireAdmin();
  const { id } = await params;
  // const skill = await getGlobalSkillById(id);

  // if (!skill) {
  //   return NextResponse.json({ error: "Not found" }, { status: 404 });
  // }

  // return NextResponse.json(skill);
}
