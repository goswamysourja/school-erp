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

import { createSubject }
    from "@/modules/subjects/api";

interface Tenant {
    id: string;
    name: string;
}

interface Class {
    id: string;

    name: string;

    section: string;

    tenantId: string;
}
interface Props {
    tenants: Tenant[];
    classes: Class[];
}

export function CreateSubjectForm({
    tenants,
    classes,
}: Props) {
    const [name, setName] =
        useState("");

    const [code, setCode] =
        useState("");

    const [
        description,
        setDescription,
    ] = useState("");

    const [tenantId, setTenantId] =
        useState("");

    const [classId, setClassId] =
        useState("");

    const filteredClasses =
        tenantId === ""
            ? []
            : classes.filter(
                (classItem) =>
                    classItem.tenantId ===
                    tenantId
            );

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

            await createSubject({
                name,
                code,
                description,
                tenantId,
                classId,
            });

            window.location.href =
                "/dashboard/subjects";
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to create subject"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <FormCard>
            <form
                onSubmit={
                    handleSubmit
                }
            >
                <Stack spacing={3}>
                    {error && (
                        <Alert severity="error">
                            {error}
                        </Alert>
                    )}

                    <TextField
                        label="Subject Name"
                        fullWidth
                        required
                        value={name}
                        onChange={(e) =>
                            setName(
                                e.target.value
                            )
                        }
                    />

                    <TextField
                        label="Subject Code"
                        fullWidth
                        required
                        value={code}
                        onChange={(e) =>
                            setCode(
                                e.target.value
                            )
                        }
                    />

                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        minRows={3}
                        value={description}
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                    />

                    <TextField
                        select
                        label="Tenant"
                        fullWidth
                        required
                        value={tenantId}
                        onChange={(e) => {
                            setTenantId(
                                e.target.value
                            );

                            setClassId("");
                        }}
                    >
                        {tenants.map(
                            (tenant) => (
                                <MenuItem
                                    key={
                                        tenant.id
                                    }
                                    value={
                                        tenant.id
                                    }
                                >
                                    {tenant.name}
                                </MenuItem>
                            )
                        )}
                    </TextField>

                    <TextField
                        select
                        label="Class"
                        disabled={!tenantId}
                        fullWidth
                        required
                        value={classId}
                        onChange={(e) =>
                            setClassId(
                                e.target.value
                            )
                        }
                    >
                        <MenuItem
                            value=""
                            disabled
                        >
                            Select Class
                        </MenuItem>
                        {filteredClasses.map(
                            (classItem) => (
                                <MenuItem
                                    key={
                                        classItem.id
                                    }
                                    value={
                                        classItem.id
                                    }
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
                            onClick={() =>
                                window.history.back()
                            }
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
                                : "Create Subject"}
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </FormCard>
    );
}