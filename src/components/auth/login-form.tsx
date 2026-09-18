"use client";

import { useState } from "react";

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

export function LoginForm() {
    const [phone, setPhone] =
        useState("");

    const [otp, setOtp] =
        useState("");

    const [
        otpRequested,
        setOtpRequested,
    ] = useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    async function handleRequestOtp(
        e: React.FormEvent,
    ) {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response =
                await fetch(
                    "/api/auth/request-otp",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            phone,
                        }),
                    },
                );

            const data =
                await response.json();

            if (!data.success) {
                throw new Error(
                    data.message,
                );
            }

            setOtpRequested(true);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to request OTP",
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleVerifyOtp() {
        try {
            setLoading(true);
            setError("");

            const response =
                await fetch(
                    "/api/auth/verify-otp",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            phone,
                            otp,
                        }),
                    },
                );

            const data =
                await response.json();

            if (!data.success) {
                throw new Error(
                    data.message,
                );
            }

            window.location.href =
                "/dashboard";
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Verification failed",
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
                                sx={{
                                    fontWeight: 600,
                                }}
                            >
                                School ERP
                            </Typography>

                            <Typography color="text.secondary">
                                Sign in with OTP
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error">
                                {error}
                            </Alert>
                        )}

                        <TextField
                            label="Phone Number"
                            type="tel"
                            fullWidth
                            value={phone}
                            onChange={(e) =>
                                setPhone(
                                    e.target.value,
                                )
                            }
                            placeholder="+919674567809"
                        />

                        {!otpRequested ? (
                            <Button
                                variant="contained"
                                size="large"
                                disabled={
                                    loading ||
                                    !phone.trim()
                                }
                                onClick={
                                    handleRequestOtp
                                }
                            >
                                {loading ? (
                                    <CircularProgress
                                        size={20}
                                    />
                                ) : (
                                    "Request OTP"
                                )}
                            </Button>
                        ) : (
                            <>
                                <Alert severity="success">
                                    OTP sent successfully.
                                </Alert>

                                <TextField
                                    label="OTP"
                                    type="text"
                                    fullWidth
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    slotProps={{
                                        htmlInput: {
                                            maxLength: 6,
                                        },
                                    }}
                                />

                                <Button
                                    variant="contained"
                                    size="large"
                                    disabled={
                                        loading ||
                                        !otp.trim()
                                    }
                                    onClick={
                                        handleVerifyOtp
                                    }
                                >
                                    {loading ? (
                                        <CircularProgress
                                            size={20}
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