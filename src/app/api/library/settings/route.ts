
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";

import { getAuthUser } from "@/modules/auth/services/get-auth-user.service";
import { authorizeLibraryApiAccess } from "@/modules/library/guards/authorize-library-api.guard";
import { getLibrarySettings } from "@/modules/library/services/get-library-settings.service";
import { updateLibrarySettings } from "@/modules/library/services/update-library-settings.service";

const settingFields = [
  "maxBooksPerStudent",
  "loanPeriodDays",
  "renewalLimit",
  "gracePeriodDays",
  "finePerDay",
  "lostBookCharge",
  "damagedBookCharge",
] as const;

type SettingField = (typeof settingFields)[number];

function isSettingField(value: string): value is SettingField {
  return (settingFields as readonly string[]).includes(value);
}

export async function GET() {
  try {
    const access = await authorizeLibraryApiAccess();

    if (!access.authorized) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status },
      );
    }

    const settings = await getLibrarySettings({
      tenantId: access.tenantId,
    });

    return NextResponse.json(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (
      message === "Tenant not found." ||
      message === "Tenant is inactive."
    ) {
      return NextResponse.json(
        { error: message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch library settings." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await getAuthUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    if (currentUser.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Only administrators can update library settings." },
        { status: 403 },
      );
    }

    if (!currentUser.tenantId) {
      return NextResponse.json(
        { error: "Tenant assignment missing." },
        { status: 400 },
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
    const keys = Object.keys(payload);

    if (keys.length === 0) {
      return NextResponse.json(
        { error: "Provide at least one setting to update." },
        { status: 400 },
      );
    }

    const unknownFields = keys.filter(
      (key) => !isSettingField(key),
    );

    if (unknownFields.length > 0) {
      return NextResponse.json(
        {
          error: "The request contains unsupported settings.",
          fields: unknownFields,
        },
        { status: 400 },
      );
    }

    for (const field of settingFields) {
      const value = payload[field];

      if (value === undefined) {
        continue;
      }

      if (typeof value !== "number" || !Number.isFinite(value)) {
        return NextResponse.json(
          { error: `${field} must be a valid number.` },
          { status: 400 },
        );
      }
    }

    const settingsInput: {
      tenantId: string;
      maxBooksPerStudent?: number;
      loanPeriodDays?: number;
      renewalLimit?: number;
      gracePeriodDays?: number;
      finePerDay?: number;
      lostBookCharge?: number;
      damagedBookCharge?: number;
    } = {
      tenantId: currentUser.tenantId,
    };

    for (const field of settingFields) {
      const value = payload[field];

      if (typeof value === "number") {
        settingsInput[field] = value;
      }
    }

    const settings = await updateLibrarySettings(settingsInput);

    return NextResponse.json(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    const validationErrors = [
      "Tenant not found.",
      "Tenant is inactive.",
      "Maximum books per student must be a positive integer.",
      "Loan period must be a positive integer.",
      "Renewal limit must be a non-negative integer.",
      "Grace period must be a non-negative integer.",
      "finePerDay must be a non-negative number.",
      "lostBookCharge must be a non-negative number.",
      "damagedBookCharge must be a non-negative number.",
      "At least one setting must be provided.",
    ];

    if (validationErrors.includes(message)) {
      return NextResponse.json(
        { error: message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update library settings." },
      { status: 500 },
    );
  }
}
