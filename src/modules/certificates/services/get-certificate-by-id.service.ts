import { prisma } from "@/lib/prisma/client";

export async function getCertificateById(
  id: string,
  tenantId: string,
) {
  const certificate =
    await prisma.certificate.findUnique({
      where: {
        id,
      },

      include: {
        student: {
          include: {
            section: {
              include: {
                class: {
                  include: {
                    academicYearRecord: true,
                  },
                },
              },
            },
          },
        },
      },
    });

  if (!certificate) {
    return null;
  }

  if (
    certificate.tenantId !==
    tenantId
  ) {
    return null;
  }

  return certificate;
}