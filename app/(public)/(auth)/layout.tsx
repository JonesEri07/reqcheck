import { getUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (user) {
    redirect("/app/dashboard");
  }
  return (
    <div className="min-h-[100dvh] flex flex-col justify-center bg-gray-50">
      {children}
    </div>
  );
}
