
"use client";

import { useState } from "react";

import {
    Box,
    Button,
    Card,
    Chip,
    InputAdornment,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import ViewListIcon from "@mui/icons-material/ViewList";

interface ClassItem {
    id: string;
    name: string;
    isActive: boolean;
    academicYear?: {
        name: string;
    } | string;
}

interface ClassesListClientProps {
    initialClasses: ClassItem[];
}

export function ClassesListClient({
    initialClasses,
}: ClassesListClientProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const query = searchQuery.trim().toLowerCase();

    const filteredClasses = initialClasses.filter((classItem) => {
        const className = classItem.name?.toLowerCase() ?? "";

        const academicYear =
            typeof classItem.academicYear === "string"
                ? classItem.academicYear.toLowerCase()
                : classItem.academicYear?.name?.toLowerCase() ?? "";

        return (
            className.includes(query) ||
            academicYear.includes(query)
        );
    });

    return (
        <Card
            elevation={0}
            sx={{
                width: "100%",
                border: 1,
                borderColor: "divider",
                borderRadius: 3,
                overflow: "hidden",
                bgcolor: "background.paper",
            }}
        >
            {/* Search */}
            <Box
                sx={{
                    p: { xs: 2, sm: 2.5 },
                    borderBottom: 1,
                    borderColor: "divider",
                }}
            >
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search by class name or academic year..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon
                                        fontSize="small"
                                        color="action"
                                    />
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={{
                        maxWidth: 520,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                        },
                    }}
                />
            </Box>

            {/* Table */}
            <TableContainer>
                <Table
                    sx={{
                        minWidth: 760,
                    }}
                >
                    <TableHead>
                        <TableRow
                            sx={{
                                bgcolor: "action.hover",
                            }}
                        >
                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    color: "text.primary",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Class Name
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    color: "text.primary",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Academic Year
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    color: "text.primary",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Status
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    color: "text.primary",
                                    whiteSpace: "nowrap",
                                    textAlign: "right",
                                }}
                            >
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredClasses.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    sx={{
                                        py: 6,
                                        textAlign: "center",
                                    }}
                                >
                                    <Stack
                                        spacing={0.75}
                                        sx={{
                                            alignItems: "center",
                                        }}
                                    >
                                        <SearchIcon
                                            sx={{
                                                fontSize: 36,
                                                color: "text.disabled",
                                            }}
                                        />

                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontWeight: 600,
                                            }}
                                        >
                                            No classes found
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {searchQuery
                                                ? `No classes match "${searchQuery}".`
                                                : "There are no classes available yet."}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredClasses.map((classItem) => {
                                const academicYear =
                                    typeof classItem.academicYear === "string"
                                        ? classItem.academicYear
                                        : classItem.academicYear?.name ?? "N/A";

                                return (
                                    <TableRow
                                        key={classItem.id}
                                        hover
                                        sx={{
                                            "&:last-child td": {
                                                borderBottom: 0,
                                            },
                                        }}
                                    >
                                        {/* Class */}
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: "primary.main",
                                                }}
                                            >
                                                {classItem.name}
                                            </Typography>
                                        </TableCell>

                                        {/* Academic Year */}
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {academicYear}
                                            </Typography>
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            <Chip
                                                label={
                                                    classItem.isActive
                                                        ? "Active"
                                                        : "Inactive"
                                                }
                                                size="small"
                                                color={
                                                    classItem.isActive
                                                        ? "success"
                                                        : "default"
                                                }
                                                variant="outlined"
                                                sx={{
                                                    fontWeight: 600,
                                                    borderRadius: 1.5,
                                                }}
                                            />
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    gap: 1,
                                                    justifyContent: "flex-end",
                                                    alignItems: "center",
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                <Button
                                                    href={`/dashboard/sections?classId=${encodeURIComponent(classItem.id)}`}
                                                    size="small"
                                                    variant="contained"
                                                    startIcon={<ViewListIcon />}
                                                    sx={{
                                                        textTransform: "none",
                                                        borderRadius: 1.5,
                                                        boxShadow: "none",
                                                        fontWeight: 600,
                                                        whiteSpace: "nowrap",
                                                        "&:hover": { boxShadow: "none" },
                                                    }}
                                                >
                                                    Manage Sections
                                                </Button>

                                                <Button
                                                    href={`/dashboard/classes/${classItem.id}/edit`}
                                                    size="small"
                                                    variant="outlined"
                                                    aria-label={`Edit ${classItem.name}`}
                                                    sx={{
                                                        minWidth: 38,
                                                        width: 38,
                                                        height: 36,
                                                        p: 0,
                                                        borderRadius: 1.5,
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </Button>

                                                <Button
                                                    size="small"
                                                    variant={
                                                        classItem.isActive
                                                            ? "outlined"
                                                            : "contained"
                                                    }
                                                    color={
                                                        classItem.isActive
                                                            ? "error"
                                                            : "success"
                                                    }
                                                    aria-label={
                                                        classItem.isActive
                                                            ? `Deactivate ${classItem.name}`
                                                            : `Activate ${classItem.name}`
                                                    }
                                                    sx={{
                                                        minWidth: 38,
                                                        width: 38,
                                                        height: 36,
                                                        p: 0,
                                                        borderRadius: 1.5,
                                                    }}
                                                >
                                                    <BlockIcon fontSize="small" />
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
}