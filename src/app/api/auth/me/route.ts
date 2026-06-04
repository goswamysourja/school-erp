import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { verifyToken } from "@/lib/auth/verify-token";
import { getCurrentUser } from "@/modules/auth/services/get-current-user.service";

export async function GET() {
  try {
    const cookieStore =
      await cookies();

    const token =
      cookieStore.get("token")
        ?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unauthenticated",
        },
        {
          status: 401,
        }
      );
    }

    const payload =
      verifyToken(token);

    const user =
      await getCurrentUser(
        payload.userId
      );

    return NextResponse.json({
      success: true,
      user,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Unauthenticated",
      },
      {
        status: 401,
      }
    );
  }
}