import { prisma } from "@/lib/prisma/client";

export async function requestOtp(
  email: string
) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const code = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const expiresAt = new Date(
    Date.now() + 5 * 60 * 1000
  );

  await prisma.otp.create({
    data: {
      userId: user.id,
      code,
      expiresAt,
    },
  });

  console.log(
    `OTP for ${email}: ${code}`
  );

  return {
    success: true,
  };
}