import type { Certificate } from "@prisma/client";

export async function getCertificateById(
  id: string,
): Promise<Certificate> {
  const response = await fetch(
    `/api/certificates/${id}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to fetch certificate.",
    );
  }

  return data;
}