import { redirect } from "next/navigation";

import { getAuthUser } from "../services/get-auth-user.service";

export async function requireAuth() {
  const user =
    await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}