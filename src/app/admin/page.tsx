import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

export default async function AdminPage() {
  const user =
    await requireRole([
      Role.SUPER_ADMIN,
    ]);

  return (
    <main>
      <h1>
        Admin Area
      </h1>

      <p>
        Welcome {user.name}
      </p>
    </main>
  );
}