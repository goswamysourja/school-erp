import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getUsers } from "@/modules/users/services/get-users.service";

import { UserCard } from "@/components/users/user-card";

export default async function UsersPage() {
  await requireRole([
    Role.SUPER_ADMIN,
  ]);

  const users =
    await getUsers();

  return (
    <main>
      <h1>
        Users
      </h1>

      {users.map(
        (user) => (
          <UserCard
            key={user.id}
            user={user}
          />
        )
      )}
    </main>
  );
}