import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";
import { generateCertificatePdf } from "@/modules/certificates/services/generate-certificate-pdf.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await requireRole([Role.ADMIN]);

    if (!currentUser.tenantId) {
      return NextResponse.json(
        { error: "Tenant assignment missing." },
        { status: 400 },
      );
    }

    const { id } = await params;

    const pdfBuffer = await generateCertificatePdf(
      id,
      currentUser.tenantId,
    );

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificate-${id}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate certificate PDF.";

    const status =
      message === "Certificate not found." ||
      message === "Certificate belongs to another tenant."
        ? 404
        : 500;

    return NextResponse.json(
      { error: message },
      { status },
    );
  }
}