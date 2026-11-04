import {
  NextRequest,
  NextResponse,
} from "next/server";

import { requestOtp } from "@/modules/auth/services/request-otp.service";

import { requestOtpSchema } from "@/modules/auth/validators/request-otp.validator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = requestOtpSchema.parse(body);

    await requestOtp(validatedData.phone);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      { status: 400 },
    );
  }
}