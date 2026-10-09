import { prisma } from "@/lib/prisma/client";

export async function getCertificateGenerationData(
  id: string,
  tenantId: string,
) {
  const certificate =
    await prisma.certificate.findUnique({
      where: { id },
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
        tenant: true,
      },
    });

  if (!certificate) {
    throw new Error("Certificate not found.");
  }

  if (certificate.tenantId !== tenantId) {
    throw new Error(
      "Certificate belongs to another tenant.",
    );
  }

  return {
    certificateNumber:
      certificate.certificateNumber,

    purpose:
      certificate.purpose,

    certificateType:
      certificate.certificateType,

    issueDate:
      certificate.issueDate,

    eventName:
      certificate.eventName,

    eventDate:
      certificate.eventDate,

    position:
      certificate.position,

    achievement:
      certificate.achievement,

    details:
      certificate.details,

    student: {
      id: certificate.student.id,
      admissionNumber:
        certificate.student.admissionNumber,
      firstName:
        certificate.student.firstName,
      lastName:
        certificate.student.lastName,
      gender:
        certificate.student.gender,
      dateOfBirth:
        certificate.student.dateOfBirth,
      guardianName:
        certificate.student.guardianName,
      address:
        certificate.student.address,

      section:
        certificate.student.section
          ? {
              name:
                certificate.student.section.name,

              className:
                certificate.student.section.class
                  .name,

              academicYear:
                certificate.student.section
                  .class
                  .academicYearRecord
                  ?.name ?? null,
            }
          : null,
    },

    tenant: {
      id: certificate.tenant.id,
      name: certificate.tenant.name,
    },
  };
}