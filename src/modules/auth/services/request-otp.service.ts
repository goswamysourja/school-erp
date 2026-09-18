import { prisma } from "@/lib/prisma/client";

export async function requestOtp(
  phone: string,
) {
  const user =
    await prisma.user.findUnique({
      where: {
        phone,
      },
    });

  if (!user) {
    throw new Error(
      "Account not provisioned. Contact your school administrator.",
    );
  }

  if (!user.isActive) {
    throw new Error(
      "User account is inactive.",
    );
  }

  const code =
    Math.floor(
      100000 +
        Math.random() * 900000,
    ).toString();

  const expiresAt =
    new Date(
      Date.now() +
        5 * 60 * 1000,
    );

  await prisma.otp.create({
    data: {
      userId: user.id,
      code,
      expiresAt,
    },
  });

  console.log(
    `OTP for ${phone}: ${code}`,
  );

  return {
    success: true,
  };
}