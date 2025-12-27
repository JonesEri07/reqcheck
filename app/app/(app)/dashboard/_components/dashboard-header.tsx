interface DashboardHeaderProps {
  userName: string | null;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">
        {userName ? `Welcome back, ${userName}` : "Welcome back"}
      </h1>
      <p className="text-lg text-muted-foreground">
        Here's what's happening with your applications
      </p>
    </div>
  );
}
