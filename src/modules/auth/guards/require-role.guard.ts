import { redirect } from "next/navigation";

import { Role } from "@prisma/client";

import { getAuthUser } from "../services/get-auth-user.service";

export async function requireRole(
  allowedRoles: Role[]
) {
  const user =
    await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  if (
    !allowedRoles.includes(
      user.role
    )
  ) {
    redirect("/unauthorized");
  }

  return user;
}