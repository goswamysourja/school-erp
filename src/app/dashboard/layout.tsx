import { DashboardShell }
  from "@/components/layout/dashboard-shell";

import { getAuthUser }
  from "@/modules/auth/services/get-auth-user.service";

import { requireAuth }
  from "@/modules/auth/guards/require-auth.guard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  const user =
    await getAuthUser();

  if (!user) {
    return null;
  }

  return (
    <DashboardShell
      user={{
        name: user.name,
        role: user.role,
      }}
    >
      {children}
    </DashboardShell>
  );
}