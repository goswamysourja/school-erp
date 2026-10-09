"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import type { AcademicYearResponse } from "../types/types";
import type { AcademicPeriodResponse } from "../types/period.types";

import {
    deleteAcademicPeriod,
    updateMarksWindow,
} from "../api/api";

interface AcademicYearDetailProps {
    academicYear: AcademicYearResponse;
    periods: AcademicPeriodResponse[];
}

interface PeriodActionsProps {
    academicYearId: string;
    period: AcademicPeriodResponse;
}

function PeriodActions({
    academicYearId,
    period,
}: PeriodActionsProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    async function handleMarksAction(
        action: "open" | "lock"
    ) {
        const message =
            action === "open"
                ? period.marksLockedAt
                    ? "Re-open marks upload for this period?"
                    : "Open marks upload for this period?"
                : "Lock marks upload for this period?";

        if (!window.confirm(message)) {
            return;
        }

        setIsLoading(true);

        try {
            await updateMarksWindow(
                academicYearId,
                period.id,
                action
            );

            router.refresh();
        } catch (error) {
            window.alert(
                error instanceof Error
                    ? error.message
                    : "Failed to update marks window."
            );
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete() {
        if (
            !window.confirm(
                `Delete "${period.name}"? This action cannot be undone.`
            )
        ) {
            return;
        }

        setIsLoading(true);

        try {
            await deleteAcademicPeriod(
                academicYearId,
                period.id
            );

            router.refresh();
        } catch (error) {
            window.alert(
                error instanceof Error
                    ? error.message
                    : "Failed to delete academic period."
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                justifyContent: "flex-end",
            }}
        >
            <Button
                component={Link}
                href={`/dashboard/academic-years/${academicYearId}/periods/${period.id}/edit`}
                variant="outlined"
                size="small"
                disabled={isLoading}
            >
                Edit
            </Button>

            {period.marksUploadOpen ? (
                <Button
                    variant="outlined"
                    color="warning"
                    size="small"
                    onClick={() =>
                        handleMarksAction("lock")
                    }
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <CircularProgress size={18} />
                    ) : (
                        "Lock Marks"
                    )}
                </Button>
            ) : (
                <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    onClick={() =>
                        handleMarksAction("open")
                    }
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <CircularProgress size={18} />
                    ) : period.marksLockedAt ? (
                        "Re-open Marks"
                    ) : (
                        "Open Marks"
                    )}
                </Button>
            )}

            <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleDelete}
                disabled={isLoading}
            >
                {isLoading ? (
                    <CircularProgress size={18} />
                ) : (
                    "Delete"
                )}
            </Button>
        </Box>
    );
}

export function AcademicYearDetail({
    academicYear,
    periods,
}: AcademicYearDetailProps) {
    return (
        <Stack spacing={3}>
            <Stack spacing={1}>
                <Typography variant="h5">
                    {academicYear.name}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Manage this academic year and its terms and exams.
                </Typography>
            </Stack>

            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={3}
                        >
                            <Stack spacing={0.5}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Start Date
                                </Typography>

                                <Typography>
                                    {academicYear.startDate.toLocaleDateString(
                                        "en-IN"
                                    )}
                                </Typography>
                            </Stack>

                            <Stack spacing={0.5}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    End Date
                                </Typography>

                                <Typography>
                                    {academicYear.endDate.toLocaleDateString(
                                        "en-IN"
                                    )}
                                </Typography>
                            </Stack>

                            <Stack spacing={0.5}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Status
                                </Typography>

                                <Chip
                                    label={
                                        academicYear.isActive
                                            ? "Active"
                                            : "Inactive"
                                    }
                                    color={
                                        academicYear.isActive
                                            ? "success"
                                            : "default"
                                    }
                                    size="small"
                                />
                            </Stack>
                        </Stack>

                        <Stack
                            direction="row"
                            spacing={2}
                        >
                            <Button
                                component={Link}
                                href={`/dashboard/academic-years/${academicYear.id}/edit`}
                                variant="outlined"
                            >
                                Edit Academic Year
                            </Button>

                            <Button
                                component={Link}
                                href="/dashboard/academic-years"
                                variant="text"
                            >
                                Back
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Stack spacing={3}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <Box>
                                <Typography variant="h6">
                                    Terms & Exams
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Academic periods for this academic year.
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                component={Link}
                                href={`/dashboard/academic-years/${academicYear.id}/periods/create`}
                            >
                                Add Period
                            </Button>
                        </Box>

                        <Divider />

                        {periods.length === 0 ? (
                            <Typography color="text.secondary">
                                No terms or exams have been created yet.
                            </Typography>
                        ) : (
                            <Stack spacing={2}>
                                {periods.map((period) => (
                                    <Card
                                        key={period.id}
                                        variant="outlined"
                                    >
                                        <CardContent>
                                            <Stack spacing={1.5}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "flex-start",
                                                        gap: 2,
                                                    }}
                                                >
                                                    <Stack spacing={0.5}>
                                                        <Typography variant="subtitle1">
                                                            {period.name}
                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            {period.type === "EXAM"
                                                                ? "Exam"
                                                                : "Term"}
                                                        </Typography>
                                                    </Stack>

                                                    <Chip
                                                        label={
                                                            period.marksUploadOpen
                                                                ? "Marks Open"
                                                                : period.marksLockedAt
                                                                    ? "Locked"
                                                                    : "Marks Closed"
                                                        }
                                                        color={
                                                            period.marksUploadOpen
                                                                ? "success"
                                                                : "default"
                                                        }
                                                        size="small"
                                                    />
                                                </Box>

                                                <Typography variant="body2">
                                                    {period.startDate.toLocaleDateString(
                                                        "en-IN"
                                                    )}{" "}
                                                    —{" "}
                                                    {period.endDate.toLocaleDateString(
                                                        "en-IN"
                                                    )}
                                                </Typography>

                                                <Divider />

                                                <PeriodActions
                                                    academicYearId={
                                                        academicYear.id
                                                    }
                                                    period={period}
                                                />
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    );
}