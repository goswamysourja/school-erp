import Link from "next/link";

import {
  Button,
  Stack,
} from "@mui/material";

import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getTenantUsers } from "@/modules/users/services/get-tenant-users.service";

import { UserCard } from "@/components/users/user-card";

import { PageHeader } from "@/components/ui/page-header";

import { SectionContainer } from "@/components/ui/section-container";

export default async function UsersPage() {
  const currentUser =
    await requireRole([
      Role.ADMIN,
    ]);

  if (!currentUser.tenantId) {
    throw new Error(
      "Tenant assignment missing.",
    );
  }

  const users =
    await getTenantUsers({
      tenantId:
        currentUser.tenantId,
    });

  return (
    <>
      <PageHeader
        title="Users"
        subtitle="Manage users for your school."
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
        <Stack spacing={2}>
          {users.map(
            (user) => (
              <UserCard
                key={user.id}
                user={user}
              />
            )
          )}
        </Stack>
      </SectionContainer>
    </>
  );
}