import type { CertificatePurpose } from "@prisma/client";

interface CreateCertificateInput {
  certificateNumber: string;
  purpose: CertificatePurpose;
  certificateType: string;
  issueDate: string;
  studentId: string;
  eventName?: string;
  eventDate?: string;
  position?: string;
  achievement?: string;
  details?: string;
}

export async function createCertificate(
  input: CreateCertificateInput,
) {
  const response = await fetch("/api/certificates", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to create certificate.",
    );
  }

  return data;
}