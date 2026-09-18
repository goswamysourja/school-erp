import { Role } from "@prisma/client";

export function requireUserRole<
  T extends { role: Role }
>(
  user: T,
  roles: Role | Role[],
): T {
  const allowedRoles = Array.isArray(roles)
    ? roles
    : [roles];

  if (!allowedRoles.includes(user.role)) {
    throw new Error("User does not have the required role.");
  }

  return user;
}