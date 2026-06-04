import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma/client";
import { verifyToken } from "@/lib/auth/verify-token";

export async function getAuthUser() {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload =
      verifyToken(token);

    const user =
      await prisma.user.findUnique({
        where: {
          id: payload.userId,
        },
      });

    return user;
  } catch {
    return null;
  }
}