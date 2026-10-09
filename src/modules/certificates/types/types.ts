import type { Prisma } from "@prisma/client";

export type CertificateResponse =
  Prisma.CertificateGetPayload<{
    include: {
      student: {
        include: {
          section: {
            include: {
              class: {
                include: {
                  academicYearRecord: true;
                };
              };
            };
          };
        };
      };
    };
  }>;