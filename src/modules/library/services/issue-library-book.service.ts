import { Prisma, Role } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

interface IssueLibraryBookInput {
  tenantId: string;
  studentId: string;
  bookCopyId: string;
  issuedByUserId: string;
}

export async function issueLibraryBook(
  input: IssueLibraryBookInput,
) {
  return prisma.$transaction(
    async (tx) => {
      const tenant = await tx.tenant.findUnique({
        where: {
          id: input.tenantId,
        },
        select: {
          id: true,
          status: true,
        },
      });

      if (!tenant) {
        throw new Error("Tenant not found.");
      }

      if (tenant.status !== "ACTIVE") {
        throw new Error("Tenant is inactive.");
      }

      const issuer = await tx.user.findFirst({
        where: {
          id: input.issuedByUserId,
          tenantId: input.tenantId,
          isActive: true,
          role: {
            in: [Role.ADMIN, Role.STAFF, Role.TEACHER],
          },
        },
      });

      if (!issuer) {
        throw new Error(
          "Issuing user does not belong to this institution.",
        );
      }

      if (issuer.role !== Role.ADMIN) {
        const assignment =
          await tx.libraryStaffAssignment.findUnique({
            where: {
              tenantId_userId: {
                tenantId: input.tenantId,
                userId: issuer.id,
              },
            },
            select: {
              isActive: true,
            },
          });

        if (!assignment?.isActive) {
          throw new Error(
            "Only assigned library staff can issue books.",
          );
        }
      }

      const student = await tx.student.findFirst({
        where: {
          id: input.studentId,
          tenantId: input.tenantId,
          isActive: true,
        },
        select: {
          id: true,
          admissionNumber: true,
          firstName: true,
          lastName: true,
        },
      });

      if (!student) {
        throw new Error(
          "Active student not found in this institution.",
        );
      }

      const copy = await tx.libraryBookCopy.findFirst({
        where: {
          id: input.bookCopyId,
          tenantId: input.tenantId,
          book: {
            tenantId: input.tenantId,
            isActive: true,
          },
        },
        include: {
          book: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      if (!copy) {
        throw new Error(
          "Book copy not found in this institution.",
        );
      }

      if (copy.status !== "AVAILABLE") {
        throw new Error("Book copy is not available for issue.");
      }

      const settings = await tx.librarySettings.upsert({
        where: {
          tenantId: input.tenantId,
        },
        update: {},
        create: {
          tenantId: input.tenantId,
        },
      });

      const activeLoanCount = await tx.libraryLoan.count({
        where: {
          tenantId: input.tenantId,
          studentId: student.id,
          status: "ACTIVE",
        },
      });

      if (activeLoanCount >= settings.maxBooksPerStudent) {
        throw new Error(
          "Student has reached the maximum borrowing limit.",
        );
      }

      const claimedCopy = await tx.libraryBookCopy.updateMany({
        where: {
          id: copy.id,
          tenantId: input.tenantId,
          status: "AVAILABLE",
        },
        data: {
          status: "ISSUED",
        },
      });

      if (claimedCopy.count !== 1) {
        throw new Error(
          "Book copy is no longer available for issue.",
        );
      }

      const issuedAt = new Date();
      const dueAt = new Date(issuedAt);

      dueAt.setDate(dueAt.getDate() + settings.loanPeriodDays);

      const loan = await tx.libraryLoan.create({
        data: {
          tenantId: input.tenantId,
          bookCopyId: copy.id,
          studentId: student.id,
          issuedByUserId: issuer.id,
          issuedAt,
          dueAt,
          status: "ACTIVE",
        },
        include: {
          student: {
            select: {
              id: true,
              admissionNumber: true,
              firstName: true,
              lastName: true,
            },
          },
          bookCopy: {
            include: {
              book: {
                select: {
                  id: true,
                  title: true,
                },
              },
              rack: true,
            },
          },
          issuedByUser: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return loan;
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    },
  );
}