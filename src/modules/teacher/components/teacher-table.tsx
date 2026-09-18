import {
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SyncAltIcon from "@mui/icons-material/SyncAlt";

import { StatusChip } from "@/components/ui/status-chip";

import type {
    TeacherResponse,
} from "../types";

interface Props {
    teachers: TeacherResponse[];

    onEdit: (
        teacherId: string,
    ) => void;

    onToggleStatus: (
        teacherId: string,
    ) => void;

    onDelete: (
        teacherId: string,
    ) => void;
}

export function TeacherTable({
    teachers,
    onEdit,
    onToggleStatus,
    onDelete,
}: Props) {
    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 3,
            }}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Employee ID
                        </TableCell>

                        <TableCell>
                            Teacher
                        </TableCell>

                        <TableCell>
                            User Phone
                        </TableCell>

                        <TableCell>
                            Phone
                        </TableCell>

                        <TableCell>
                            Status
                        </TableCell>

                        <TableCell
                            align="right"
                        >
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {teachers.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                            >
                                <Typography
                                    align="center"
                                    color="text.secondary"
                                    sx={{
                                        py: 4,
                                    }}
                                >
                                    No teachers found.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        teachers.map(
                            (teacher) => (
                                <TableRow
                                    hover
                                    key={teacher.id}
                                >
                                    <TableCell>
                                        {teacher.employeeId}
                                    </TableCell>

                                    <TableCell>
                                        <Stack
                                            spacing={0.3}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {teacher.fullName}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {teacher.gender}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        {teacher.userPhone}
                                    </TableCell>

                                    <TableCell>
                                        {teacher.phone ?? "-"}
                                    </TableCell>

                                    <TableCell>
                                        <StatusChip
                                            active={
                                                teacher.isActive
                                            }
                                        />
                                    </TableCell>

                                    <TableCell
                                        align="right"
                                    >
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            sx={{
                                                justifyContent: "flex-end",
                                            }}
                                        >
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        onEdit(
                                                            teacher.id,
                                                        )
                                                    }
                                                >
                                                    <EditIcon
                                                        fontSize="small"
                                                    />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Change Status">
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        onToggleStatus(
                                                            teacher.id,
                                                        )
                                                    }
                                                >
                                                    <SyncAltIcon
                                                        fontSize="small"
                                                    />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() =>
                                                        onDelete(
                                                            teacher.id,
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon
                                                        fontSize="small"
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ),
                        )
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}