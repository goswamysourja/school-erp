import { CertificatePurpose } from "@prisma/client";
import { z } from "zod";

export const createCertificateSchema = z
  .object({
    certificateNumber: z
      .string()
      .trim()
      .min(1, "Certificate number is required."),

    purpose: z.nativeEnum(CertificatePurpose),

    certificateType: z
      .string()
      .trim()
      .min(1, "Certificate type is required."),

    issueDate: z
      .string()
      .min(1, "Issue date is required."),

    studentId: z
      .string()
      .min(1, "Student is required."),

    eventName: z
      .string()
      .trim()
      .optional(),

    eventDate: z
      .string()
      .optional(),

    position: z
      .string()
      .trim()
      .optional(),

    achievement: z
      .string()
      .trim()
      .optional(),

    details: z
      .string()
      .trim()
      .optional(),
  })
  .superRefine((data, ctx) => {
    const eventRequired =
      data.purpose ===
        CertificatePurpose.COMPETITION_WINNER ||
      data.purpose ===
        CertificatePurpose.COMPETITION_PARTICIPANT ||
      data.purpose ===
        CertificatePurpose.PARTICIPATION;

    if (eventRequired && !data.eventName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["eventName"],
        message: "Event name is required.",
      });
    }

    if (eventRequired && !data.eventDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["eventDate"],
        message: "Event date is required.",
      });
    }

    if (
      data.purpose ===
        CertificatePurpose.COMPETITION_WINNER &&
      !data.position
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["position"],
        message: "Position is required.",
      });
    }

    if (
      data.purpose ===
        CertificatePurpose.ACHIEVEMENT &&
      !data.achievement
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["achievement"],
        message: "Achievement is required.",
      });
    }

    if (
      data.purpose ===
        CertificatePurpose.ACHIEVEMENT &&
      !data.eventDate
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["eventDate"],
        message: "Achievement date is required.",
      });
    }

    if (
      data.purpose ===
        CertificatePurpose.TRANSFER &&
      !data.details
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["details"],
        message: "Transfer details are required.",
      });
    }
  });

export type CreateCertificateInput =
  z.infer<typeof createCertificateSchema>;