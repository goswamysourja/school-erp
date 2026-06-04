import { LogoutButton } from "@/components/layout/logout-button";
import { requireAuth } from "@/modules/auth/guards/require-auth.guard";

export default async function DashboardPage() {
  const user =
    await requireAuth();

  return (
    <main>
      <h1>Dashboard</h1>

      <p>
        Welcome {user.name}
      </p>

      <p>
        Email: {user.email}
      </p>

      <p>
        Role: {user.role}
      </p>

      <LogoutButton />
    </main>
  );
}