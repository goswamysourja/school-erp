import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";
import { createCertificate } from "@/modules/certificates/services/create-certificate.service";
import { getCertificates } from "@/modules/certificates/services/get-certificates.service";
import { createCertificateSchema } from "@/modules/certificates/validators/create-certificate";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await requireRole([Role.ADMIN]);

    if (!currentUser.tenantId) {
      return NextResponse.json(
        { error: "Tenant assignment missing." },
        { status: 400 },
      );
    }

    const searchParams = request.nextUrl.searchParams;

    const certificates = await getCertificates({
      tenantId: currentUser.tenantId,
      studentId:
        searchParams.get("studentId") || undefined,
      fromDate:
        searchParams.get("fromDate") || undefined,
      toDate:
        searchParams.get("toDate") || undefined,
    });

    return NextResponse.json(certificates);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch certificates.";

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireRole([Role.ADMIN]);

    if (!currentUser.tenantId) {
      return NextResponse.json(
        { error: "Tenant assignment missing." },
        { status: 400 },
      );
    }

    const body = await request.json();

    const validation =
      createCertificateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid certificate data.",
          details: validation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const certificate =
      await createCertificate({
        ...validation.data,
        tenantId: currentUser.tenantId,
      });

    return NextResponse.json(
      certificate,
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create certificate.";

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}