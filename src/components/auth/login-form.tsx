"use client";

import { useState } from "react";

import type {
  CountryCode,
} from "libphonenumber-js";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { PhoneNumberInput } from "@/components/ui/phone-number-input";
import { toE164PhoneNumber } from "@/lib/phone";

export function LoginForm() {
  const [countryCode, setCountryCode] =
    useState<CountryCode>("IN");

  const [phone, setPhone] = useState("");
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const internationalPhone = toE164PhoneNumber(
    phone,
    countryCode,
  );

  async function handleRequestOtp() {
    if (!internationalPhone) {
      setError("Please enter a valid phone number.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: internationalPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Failed to request OTP.");
      }

      setVerifiedPhone(internationalPhone);
      setOtpRequested(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to request OTP.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid six-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: verifiedPhone,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Verification failed.");
      }

      window.location.href = "/dashboard";
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Verification failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          width: "100%",
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600 }}
              >
                School ERP
              </Typography>

              <Typography color="text.secondary">
                Sign in with OTP
              </Typography>
            </Box>

            {error && (
              <Alert
                severity="error"
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            {!otpRequested ? (
              <>
                <PhoneNumberInput
                  countryCode={countryCode}
                  onCountryChange={setCountryCode}
                  phone={phone}
                  onPhoneChange={setPhone}
                  disabled={loading}
                  label="Phone Number"
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Select your country and enter your local phone number.
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  disabled={loading || !internationalPhone}
                  onClick={handleRequestOtp}
                >
                  {loading ? (
                    <CircularProgress
                      size={20}
                      color="inherit"
                    />
                  ) : (
                    "Request OTP"
                  )}
                </Button>
              </>
            ) : (
              <>
                <Alert severity="success">
                  OTP sent successfully to {verifiedPhone}.
                </Alert>

                <TextField
                  label="OTP"
                  type="text"
                  fullWidth
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, ""))
                  }
                  disabled={loading}
                  slotProps={{
                    htmlInput: {
                      maxLength: 6,
                      inputMode: "numeric",
                      autoComplete: "one-time-code",
                    },
                  }}
                />

                <Button
                  variant="contained"
                  size="large"
                  disabled={loading || otp.length !== 6}
                  onClick={handleVerifyOtp}
                >
                  {loading ? (
                    <CircularProgress
                      size={20}
                      color="inherit"
                    />
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}