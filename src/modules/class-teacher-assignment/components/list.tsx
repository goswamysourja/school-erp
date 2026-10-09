"use client";

import {
    Box,
    Button,
    Chip,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import type {
    ClassTeacherAssignmentResponse,
} from "../types/types";

interface ClassTeacherAssignmentListProps {
    assignments: ClassTeacherAssignmentResponse[];
    onEdit: (
        assignment: ClassTeacherAssignmentResponse,
    ) => void;
    onDelete: (
        assignment: ClassTeacherAssignmentResponse,
    ) => void;
}

export default function ClassTeacherAssignmentList({
    assignments,
    onEdit,
    onDelete,
}: ClassTeacherAssignmentListProps) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Teacher</TableCell>
                        <TableCell>Employee ID</TableCell>
                        <TableCell>Class</TableCell>
                        <TableCell>Section</TableCell>
                        <TableCell>Academic Year</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {assignments.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                align="center"
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ py: 3 }}
                                >
                                    No class teacher assignments
                                    found.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        assignments.map((assignment) => {
                            const teacher =
                                assignment.teacher;

                            const section =
                                assignment.section;

                            const classData =
                                section.class;

                            return (
                                <TableRow
                                    key={assignment.id}
                                    hover
                                >
                                    <TableCell>
                                        {teacher.firstName}{" "}
                                        {teacher.lastName}
                                    </TableCell>

                                    <TableCell>
                                        {teacher.employeeId}
                                    </TableCell>

                                    <TableCell>
                                        {classData.name}
                                    </TableCell>

                                    <TableCell>
                                        {section.name}
                                    </TableCell>

                                    <TableCell>
                                        {classData.academicYear}
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            label={
                                                teacher.isActive
                                                    ? "Active"
                                                    : "Inactive"
                                            }
                                            size="small"
                                        />
                                    </TableCell>

                                    <TableCell align="right">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 1,
                                                justifyContent: "flex-end",
                                            }}
                                        >
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() =>
                                                    onEdit(assignment)
                                                }
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                size="small"
                                                color="error"
                                                variant="outlined"
                                                onClick={() =>
                                                    onDelete(assignment)
                                                }
                                            >
                                                Delete
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
    );
}