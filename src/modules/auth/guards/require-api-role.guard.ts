import { Role } from "@prisma/client";

import { getAuthUser } from "../services/get-auth-user.service";

export async function requireApiRole(
  allowedRoles: Role | Role[],
) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("Unauthenticated");
  }

  const roles = Array.isArray(allowedRoles)
    ? allowedRoles
    : [allowedRoles];

  if (!roles.includes(user.role)) {
    throw new Error("Unauthorized");
  }

  return user;
}