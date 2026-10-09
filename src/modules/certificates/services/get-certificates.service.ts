import { prisma } from "@/lib/prisma/client";

interface GetCertificatesInput {
  tenantId: string;
  studentId?: string;
  fromDate?: string;
  toDate?: string;
}

export async function getCertificates({
  tenantId,
  studentId,
  fromDate,
  toDate,
}: GetCertificatesInput) {
  return prisma.certificate.findMany({
    where: {
      tenantId,

      ...(studentId
        ? {
            studentId,
          }
        : {}),

      ...(fromDate || toDate
        ? {
            issueDate: {
              ...(fromDate
                ? {
                    gte: new Date(
                      fromDate,
                    ),
                  }
                : {}),

              ...(toDate
                ? {
                    lte: new Date(
                      toDate,
                    ),
                  }
                : {}),
            },
          }
        : {}),
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

    orderBy: {
      issueDate: "desc",
    },
  });
}