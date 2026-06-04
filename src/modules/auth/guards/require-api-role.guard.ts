import { Role } from "@prisma/client";

import { getAuthUser } from "../services/get-auth-user.service";

export async function requireApiRole(
  allowedRoles: Role[]
) {
  const user =
    await getAuthUser();

  if (!user) {
    throw new Error(
      "Unauthenticated"
    );
  }

  if (
    !allowedRoles.includes(
      user.role
    )
  ) {
    throw new Error(
      "Unauthorized"
    );
  }

  return user;
}