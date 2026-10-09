import type { CertificateResponse } from "@/modules/certificates/types/types";

interface GetCertificatesParams {
  studentId?: string;
  fromDate?: string;
  toDate?: string;
}

export async function getCertificates(
  params: GetCertificatesParams = {},
): Promise<CertificateResponse[]> {
  const searchParams = new URLSearchParams();

  if (params.studentId) {
    searchParams.set("studentId", params.studentId);
  }

  if (params.fromDate) {
    searchParams.set("fromDate", params.fromDate);
  }

  if (params.toDate) {
    searchParams.set("toDate", params.toDate);
  }

  const query = searchParams.toString();

  const response = await fetch(
    `/api/certificates${query ? `?${query}` : ""}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to fetch certificates.",
    );
  }

  return data;
}