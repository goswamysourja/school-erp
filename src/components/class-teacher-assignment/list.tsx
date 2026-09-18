"use client";

import Link from "next/link";

import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  removeClassTeacherAssignment,
} from "@/modules/class-teacher-assignment/api";

interface Assignment {
  id: string;

  teacher: {
    firstName: string;
    lastName: string;
  };

  section: {
    name: string;

    class: {
      name: string;
      academicYear: string;
    };
  };
}

interface Props {
  assignments: Assignment[];
}

export function ClassTeacherAssignmentList({
  assignments,
}: Props) {
  async function handleRemove(
    id: string,
  ) {
    const confirmed =
      window.confirm(
        "Remove this class teacher assignment?",
      );

    if (!confirmed) {
      return;
    }

    try {
      await removeClassTeacherAssignment(
        id,
      );

      window.location.reload();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to remove class teacher assignment",
      );
    }
  }

  if (assignments.length === 0) {
    return (
      <Typography color="text.secondary">
        No class teacher assignments found.
      </Typography>
    );
  }

  return (
    <TableContainer
      component={Paper}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Teacher
            </TableCell>

            <TableCell>
              Class
            </TableCell>

            <TableCell>
              Section
            </TableCell>

            <TableCell>
              Academic Year
            </TableCell>

            <TableCell align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {assignments.map(
            (assignment) => (
              <TableRow
                key={assignment.id}
              >
                <TableCell>
                  {assignment.teacher.firstName}{" "}
                  {assignment.teacher.lastName}
                </TableCell>

                <TableCell>
                  {
                    assignment.section
                      .class.name
                  }
                </TableCell>

                <TableCell>
                  {
                    assignment.section
                      .name
                  }
                </TableCell>

                <TableCell>
                  {
                    assignment.section
                      .class
                      .academicYear
                  }
                </TableCell>

                <TableCell align="right">
                  <Button
                    component={Link}
                    href={`/dashboard/class-teacher-assignment/${assignment.id}/edit`}
                    variant="outlined"
                    size="small"
                    sx={{
                      mr: 1,
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() =>
                      handleRemove(
                        assignment.id,
                      )
                    }
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}