import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";
import { getCertificateById } from "@/modules/certificates/services/get-certificate-by-id.service";

export async function GET(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
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

    const certificate = await getCertificateById(
      id,
      currentUser.tenantId,
    );

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(certificate);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch certificate.";

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}