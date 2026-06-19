import { Role } from "@prisma/client";

import { requireRole }
  from "@/modules/auth/guards/require-role.guard";

import { getUsers }
  from "@/modules/users/services/get-users.service";

import { UserCard }
  from "@/components/users/user-card";

import { PageHeader }
  from "@/components/ui/page-header";

import { SectionContainer }
  from "@/components/ui/section-container";

  import Link from "next/link";

import {
  Button,
  Stack,
} from "@mui/material";

export default async function UsersPage() {
  await requireRole([
    Role.SUPER_ADMIN,
  ]);

  const users =
    await getUsers();

  return (
    <>
      <PageHeader
        title="Users"
        subtitle="Manage platform users"
      />

      <Link href="/dashboard/users/create">
  <Button
    variant="contained"
    sx={{ mb: 3 }}
  >
    Create User
  </Button>
</Link>

      <SectionContainer>
        {users.map(
          (user) => (
            <UserCard
              key={user.id}
              user={user}
            />
          )
        )}
      </SectionContainer>
    </>
  );
}