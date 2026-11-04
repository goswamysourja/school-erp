import {
  NextRequest,
  NextResponse,
} from "next/server";

import { verifyOtp } from "@/modules/auth/services/verify-otp.service";

import { verifyOtpSchema } from "@/modules/auth/validators/verify-otp.validator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = verifyOtpSchema.parse(body);

    const result = await verifyOtp(
      validatedData.phone,
      validatedData.otp,
    );

    const response = NextResponse.json({
      success: true,
      user: result.user,
    });

    response.cookies.set({
      name: "token",
      value: result.token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Verification failed",
      },
      { status: 400 },
    );
  }
}