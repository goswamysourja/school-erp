export async function downloadCertificatePdf(
  id: string,
): Promise<Blob> {
  const response = await fetch(
    `/api/certificates/${id}/pdf`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    let message = "Failed to generate certificate PDF.";

    try {
      const data = await response.json();

      if (data.error) {
        message = data.error;
      }
    } catch {
      // Ignore JSON parsing errors.
    }

    throw new Error(message);
  }

  return response.blob();
}