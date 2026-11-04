
import {
  LibraryPaymentMethod,
  LibraryPaymentType,
  Prisma,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { authorizeLibraryApiAccess } from "@/modules/library/guards/authorize-library-api.guard";
import { recordLibraryPayment } from "@/modules/library/services/record-library-payment.service";

export async function POST(request: NextRequest) {
  try {
    const access = await authorizeLibraryApiAccess();

    if (!access.authorized) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 },
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    const payload = body as Record<string, unknown>;

    const allowedFields = [
      "loanId",
      "type",
      "amount",
      "method",
      "reference",
      "notes",
    ];

    if (
      Object.keys(payload).some(
        (field) => !allowedFields.includes(field),
      )
    ) {
      return NextResponse.json(
        { error: "The request contains unsupported fields." },
        { status: 400 },
      );
    }

    if (
      typeof payload.loanId !== "string" ||
      !payload.loanId.trim()
    ) {
      return NextResponse.json(
        { error: "A valid loan ID is required." },
        { status: 400 },
      );
    }

    if (
      typeof payload.type !== "string" ||
      !Object.values(LibraryPaymentType).includes(
        payload.type as LibraryPaymentType,
      )
    ) {
      return NextResponse.json(
        { error: "Payment type must be FINE or REPLACEMENT." },
        { status: 400 },
      );
    }

    if (
      typeof payload.method !== "string" ||
      !Object.values(LibraryPaymentMethod).includes(
        payload.method as LibraryPaymentMethod,
      )
    ) {
      return NextResponse.json(
        { error: "Invalid payment method." },
        { status: 400 },
      );
    }

    if (
      typeof payload.amount !== "number" ||
      !Number.isFinite(payload.amount)
    ) {
      return NextResponse.json(
        { error: "Payment amount must be a valid number." },
        { status: 400 },
      );
    }

    for (const field of ["reference", "notes"] as const) {
      if (
        payload[field] !== undefined &&
        payload[field] !== null &&
        typeof payload[field] !== "string"
      ) {
        return NextResponse.json(
          { error: `${field} must be a string.` },
          { status: 400 },
        );
      }
    }

    const result = await recordLibraryPayment({
      tenantId: access.tenantId,
      loanId: payload.loanId.trim(),
      receivedByUserId: access.user.id,
      type: payload.type as LibraryPaymentType,
      amount: payload.amount,
      method: payload.method as LibraryPaymentMethod,
      reference:
        typeof payload.reference === "string"
          ? payload.reference
          : undefined,
      notes:
        typeof payload.notes === "string"
          ? payload.notes
          : undefined,
    });

    return NextResponse.json(
      {
        message: "Library payment recorded successfully.",
        ...result,
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    ) {
      return NextResponse.json(
        {
          error:
            "A concurrent payment transaction conflicted. Refresh the balance and try again.",
        },
        { status: 409 },
      );
    }

    const message = error instanceof Error ? error.message : "";

    if (message === "Loan not found in this institution.") {
      return NextResponse.json(
        { error: message },
        { status: 404 },
      );
    }

    const conflictErrors = [
      "There is no outstanding balance for this payment type.",
      "Payment amount exceeds the outstanding balance.",
    ];

    if (conflictErrors.includes(message)) {
      return NextResponse.json(
        { error: message },
        { status: 409 },
      );
    }

    const validationErrors = [
      "Payment amount must be positive and have at most two decimal places.",
      "Tenant not found.",
      "Tenant is inactive.",
    ];

    if (validationErrors.includes(message)) {
      return NextResponse.json(
        { error: message },
        { status: 400 },
      );
    }

    const authorizationErrors = [
      "Payment receiver does not belong to this institution.",
      "Payment receiver is not an active teacher in this institution.",
      "Only assigned library staff can record payments.",
    ];

    if (authorizationErrors.includes(message)) {
      return NextResponse.json(
        { error: message },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { error: "Failed to record library payment." },
      { status: 500 },
    );
  }
}
