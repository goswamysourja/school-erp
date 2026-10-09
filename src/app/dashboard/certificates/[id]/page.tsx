import { CertificatePurpose, Role } from "@prisma/client";
import Link from "next/link";

import { PageHeader } from "@/components/ui/page-header";
import { getCertificateById } from "@/modules/certificates/services/get-certificate-by-id.service";
import { requireRole } from "@/modules/auth/guards/require-role.guard";

function getPurposeLabel(purpose: CertificatePurpose) {
  switch (purpose) {
    case CertificatePurpose.TRANSFER:
      return "Transfer Certificate";
    case CertificatePurpose.COMPETITION_WINNER:
      return "Competition Winner";
    case CertificatePurpose.COMPETITION_PARTICIPANT:
      return "Competition Participant";
    case CertificatePurpose.ACHIEVEMENT:
      return "Achievement";
    case CertificatePurpose.PARTICIPATION:
      return "Participation";
    default:
      return purpose;
  }
}

export default async function CertificateDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const currentUser = await requireRole([Role.ADMIN]);

  if (!currentUser.tenantId) {
    throw new Error("Tenant assignment missing.");
  }

  const { id } = await params;

  const certificate = await getCertificateById(
    id,
    currentUser.tenantId,
  );

  if (!certificate) {
    return (
      <>
        <PageHeader
          title="Certificate"
          subtitle="Certificate details"
        />
        <p>Certificate not found.</p>
      </>
    );
  }

  const student = certificate.student;

  return (
    <>
      <PageHeader
        title="Certificate Details"
        subtitle="View certificate information."
      />

      {/* --- ADDED DOWNLOAD BUTTON --- */}
      <div style={{ marginBottom: "2rem" }}>
        <a 
          href={`/api/certificates/${certificate.id}/download`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button style={{
            padding: "8px 16px",
            backgroundColor: "#1A365D",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontWeight: 600,
            cursor: "pointer"
          }}>
            Download Official PDF
          </button>
        </a>
      </div>

      <div>
        <p>
          <strong>Certificate Number:</strong>{" "}
          {certificate.certificateNumber}
        </p>

        <p>
          <strong>Purpose:</strong>{" "}
          {getPurposeLabel(certificate.purpose)}
        </p>

        <p>
          <strong>Certificate Type:</strong>{" "}
          {certificate.certificateType}
        </p>

        <p>
          <strong>Issue Date:</strong>{" "}
          {certificate.issueDate.toLocaleDateString()}
        </p>

        <p>
          <strong>Student:</strong>{" "}
          {student.firstName} {student.lastName}
        </p>

        <p>
          <strong>Admission Number:</strong>{" "}
          {student.admissionNumber}
        </p>

        {student.section && (
          <>
            <p>
              <strong>Class:</strong>{" "}
              {student.section.class.name}
            </p>

            <p>
              <strong>Section:</strong>{" "}
              {student.section.name}
            </p>

            {student.section.class.academicYearRecord && (
              <p>
                <strong>Academic Year:</strong>{" "}
                {student.section.class.academicYearRecord.name}
              </p>
            )}
          </>
        )}

        {certificate.eventName && (
          <p>
            <strong>Event:</strong>{" "}
            {certificate.eventName}
          </p>
        )}

        {certificate.eventDate && (
          <p>
            <strong>Event Date:</strong>{" "}
            {certificate.eventDate.toLocaleDateString()}
          </p>
        )}

        {certificate.position && (
          <p>
            <strong>Position:</strong>{" "}
            {certificate.position}
          </p>
        )}

        {certificate.achievement && (
          <p>
            <strong>Achievement:</strong>{" "}
            {certificate.achievement}
          </p>
        )}

        {certificate.details && (
          <p>
            <strong>Details:</strong>{" "}
            {certificate.details}
          </p>
        )}
      </div>
    </>
  );
}