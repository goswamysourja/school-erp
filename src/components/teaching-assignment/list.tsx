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

import { removeTeachingAssignment } from "@/modules/teaching-assignment/api";

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

      academicYearRecord?: {
        name: string;
      } | null;
    };
  };

  subject: {
    name: string;
    code: string;
  };
}

interface Props {
  assignments: Assignment[];
}

export function TeachingAssignmentList({
  assignments,
}: Props) {
  async function handleRemove(
    id: string,
  ) {
    const confirmed =
      window.confirm(
        "Remove this teaching assignment?",
      );

    if (!confirmed) {
      return;
    }

    try {
      await removeTeachingAssignment(id);

      window.location.reload();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to remove teaching assignment",
      );
    }
  }

  if (assignments.length === 0) {
    return (
      <Typography color="text.secondary">
        No teaching assignments found.
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
              Subject
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
                  {assignment.subject.name}
                  {" ("}
                  {assignment.subject.code}
                  {")"}
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
                  {assignment.section.class
                    .academicYearRecord?.name ??
                    assignment.section.class
                      .academicYear}
                </TableCell>

                <TableCell align="right">
                  <Button
                    component={Link}
                    href={`/dashboard/teaching-assignment/${assignment.id}/edit`}
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