"use client";

import { useState } from "react";

import {
    Alert,
    Button,
    MenuItem,
    Stack,
    TextField,
} from "@mui/material";

import { FormCard }
    from "@/components/ui/form-card";

interface Tenant {
    id: string;
    name: string;
}

interface ClassItem {
    id: string;
    name: string;
    section: string;
}

interface Props {
    tenants: Tenant[];
    classes: ClassItem[];
}

export function CreateStudentForm({
    tenants,
    classes,
}: Props) {
    const [
        admissionNumber,
        setAdmissionNumber,
    ] = useState("");

    const [
        firstName,
        setFirstName,
    ] = useState("");

    const [
        lastName,
        setLastName,
    ] = useState("");

    const [gender, setGender] =
        useState("MALE");

    const [
        dateOfBirth,
        setDateOfBirth,
    ] = useState("");

    const [
        guardianName,
        setGuardianName,
    ] = useState("");

    const [phone, setPhone] =
        useState("");

    const [address, setAddress] =
        useState("");

    const [tenantId, setTenantId] =
        useState("");

    const [classId, setClassId] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response =
                await fetch(
                    "/api/students",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            admissionNumber,
                            firstName,
                            lastName,
                            gender,
                            dateOfBirth,
                            guardianName,
                            phone,
                            address,
                            tenantId,
                            classId,
                        }),
                    }
                );

            const data =
                await response.json();

            if (!data.success) {
                throw new Error(
                    data.message
                );
            }

            window.location.href =
                "/dashboard/students";
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to create student"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <FormCard>
            <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    {error && (
                        <Alert severity="error">
                            {error}
                        </Alert>
                    )}

                    <TextField
                        label="Admission Number"
                        value={admissionNumber}
                        onChange={(e) =>
                            setAdmissionNumber(
                                e.target.value
                            )
                        }
                        fullWidth
                    />

                    <TextField
                        label="First Name"
                        value={firstName}
                        onChange={(e) =>
                            setFirstName(
                                e.target.value
                            )
                        }
                        fullWidth
                    />

                    <TextField
                        label="Last Name"
                        value={lastName}
                        onChange={(e) =>
                            setLastName(
                                e.target.value
                            )
                        }
                        fullWidth
                    />

                    <TextField
                        select
                        label="Gender"
                        value={gender}
                        onChange={(e) =>
                            setGender(
                                e.target.value
                            )
                        }
                        fullWidth
                    >
                        <MenuItem value="MALE">
                            Male
                        </MenuItem>

                        <MenuItem value="FEMALE">
                            Female
                        </MenuItem>

                        <MenuItem value="OTHER">
                            Other
                        </MenuItem>
                    </TextField>

                    <TextField
                        type="date"
                        label="Date Of Birth"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        fullWidth
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />

                    <TextField
                        label="Guardian Name"
                        value={guardianName}
                        onChange={(e) =>
                            setGuardianName(
                                e.target.value
                            )
                        }
                        fullWidth
                    />

                    <TextField
                        label="Phone"
                        value={phone}
                        onChange={(e) =>
                            setPhone(
                                e.target.value
                            )
                        }
                        fullWidth
                    />

                    <TextField
                        label="Address"
                        value={address}
                        onChange={(e) =>
                            setAddress(
                                e.target.value
                            )
                        }
                        fullWidth
                        multiline
                        rows={3}
                    />

                    <TextField
                        select
                        label="Tenant"
                        value={tenantId}
                        onChange={(e) =>
                            setTenantId(
                                e.target.value
                            )
                        }
                        fullWidth
                    >
                        {tenants.map(
                            (tenant) => (
                                <MenuItem
                                    key={tenant.id}
                                    value={tenant.id}
                                >
                                    {tenant.name}
                                </MenuItem>
                            )
                        )}
                    </TextField>

                    <TextField
                        select
                        label="Class"
                        value={classId}
                        onChange={(e) =>
                            setClassId(
                                e.target.value
                            )
                        }
                        fullWidth
                    >
                        {classes.map(
                            (classItem) => (
                                <MenuItem
                                    key={classItem.id}
                                    value={classItem.id}
                                >
                                    {classItem.name}
                                    {" - "}
                                    {classItem.section}
                                </MenuItem>
                            )
                        )}
                    </TextField>

                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        <Button
                            variant="outlined"
                            href="/dashboard/students"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating..."
                                : "Create Student"}
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </FormCard>
    );
}