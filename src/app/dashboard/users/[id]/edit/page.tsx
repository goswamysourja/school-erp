import { Role } from "@prisma/client";

import { requireRole }
  from "@/modules/auth/guards/require-role.guard";

import { getUserById }
  from "@/modules/users/services/get-user-by-id.service";

import { EditUserForm }
  from "@/components/users/edit-user-form";

import { PageHeader }
  from "@/components/ui/page-header";

export default async function EditUserPage(
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const currentUser =
    await requireRole([
      Role.ADMIN,
    ]);

  if (!currentUser.tenantId) {
    throw new Error(
      "Tenant assignment missing."
    );
  }

  const { id } =
    await params;

  const user =
    await getUserById({
      id,
      tenantId:
        currentUser.tenantId,
    });

  if (!user) {
    return (
      <h1>
        User not found
      </h1>
    );
  }

  return (
    <>
      <PageHeader
        title="Edit Teacher"
        subtitle="Update teacher user details"
      />

      <EditUserForm
        id={user.id}
        initialName={
          user.name
        }
      />
    </>
  );
}