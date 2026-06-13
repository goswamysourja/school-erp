import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/verify-token";
import { getCurrentUser } from "./get-current-user.service";

export async function getAuthUser() {
  const cookieStore =
    await cookies();

  const token =
    cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload =
      verifyToken(token);

    const user =
      await getCurrentUser(
        payload.userId
      );

    return user;
  } catch {
    return null;
  }
}