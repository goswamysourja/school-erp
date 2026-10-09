import { CertificatePurpose } from "@prisma/client";
import { prisma } from "@/lib/prisma/client";

export interface CreateCertificateInput {
  certificateNumber: string;
  purpose: CertificatePurpose;
  certificateType: string;
  issueDate: string;
  studentId: string;
  tenantId: string;
  eventName?: string;
  eventDate?: string;
  position?: string;
  achievement?: string;
  details?: string;
}

export async function createCertificate(
  input: CreateCertificateInput,
) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: input.tenantId },
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  if (tenant.status !== "ACTIVE") {
    throw new Error("Tenant is inactive.");
  }

  const student = await prisma.student.findUnique({
    where: { id: input.studentId },
  });

  if (!student) {
    throw new Error("Student not found.");
  }

  if (student.tenantId !== input.tenantId) {
    throw new Error("Student belongs to another tenant.");
  }

  const existingCertificate =
    await prisma.certificate.findUnique({
      where: {
        tenantId_certificateNumber: {
          tenantId: input.tenantId,
          certificateNumber: input.certificateNumber,
        },
      },
    });

  if (existingCertificate) {
    throw new Error(
      "Certificate number already exists in this institution.",
    );
  }

  return prisma.certificate.create({
    data: {
      certificateNumber: input.certificateNumber,
      purpose: input.purpose,
      certificateType: input.certificateType,
      issueDate: new Date(input.issueDate),
      studentId: input.studentId,
      tenantId: input.tenantId,
      eventName: input.eventName || null,
      eventDate: input.eventDate
        ? new Date(input.eventDate)
        : null,
      position: input.position || null,
      achievement: input.achievement || null,
      details: input.details || null,
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
}