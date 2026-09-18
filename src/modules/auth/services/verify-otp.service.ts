import { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

import { generateToken } from "@/lib/auth/jwt";

import { getCurrentUser } from "@/modules/auth/services/get-current-user.service";

export async function verifyOtp(
  phone: string,
  otp: string,
) {
  const user =
    await prisma.user.findUnique({
      where: {
        phone,
      },
      include: {
        administeredTenant: true,
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
    throw new Error(
      "OTP not found.",
    );
  }

  if (latestOtp.code !== otp) {
    throw new Error(
      "Invalid OTP.",
    );
  }

  if (
    latestOtp.expiresAt <
    new Date()
  ) {
    throw new Error(
      "OTP expired.",
    );
  }

  await prisma.$transaction(
    async (tx) => {
      if (
        user.role === Role.ADMIN &&
        user.administeredTenant?.status ===
          "PENDING_ADMIN"
      ) {
        await tx.tenant.update({
          where: {
            id: user.administeredTenant.id,
          },
          data: {
            status: "ACTIVE",
          },
        });
      }

      await tx.otp.delete({
        where: {
          id: latestOtp.id,
        },
      });
    },
  );

  const currentUser =
    await getCurrentUser(
      user.id,
    );

  const token =
    generateToken(user.id);

  return {
    token,
    user: currentUser,
  };
}