import { prisma } from "@/lib/prisma/client";
import { generateToken } from "@/lib/auth/jwt";
import { getCurrentUser }
  from "@/modules/auth/services/get-current-user.service";
export async function verifyOtp(
  email: string,
  otp: string
) {
const user = await prisma.user.findUnique({
  where: {
    email,
  },
});

if (!user) {
  throw new Error("User not found");
}

await getCurrentUser(
  user.id
);

  const latestOtp =
    await prisma.otp.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  if (!latestOtp) {
    throw new Error("OTP not found");
  }

  if (latestOtp.code !== otp) {
    throw new Error("Invalid OTP");
  }

  if (
    latestOtp.expiresAt <
    new Date()
  ) {
    throw new Error("OTP expired");
  }

  const token = generateToken(
    user.id
  );

  return {
    token,
    user,
  };
}