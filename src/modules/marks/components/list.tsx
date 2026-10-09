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

import type { MarkResponse } from "../types/types";

interface Props {
  marks: MarkResponse[];
  teacherId?: string;
}

export function MarkList({
  marks,
  teacherId,
}: Props) {
  if (marks.length === 0) {
    return (
      <Typography color="text.secondary">
        No marks found.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Student
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
              Academic Period
            </TableCell>

            <TableCell>
              Academic Year
            </TableCell>

            <TableCell>
              Marks
            </TableCell>

            <TableCell align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {marks.map((mark) => {
            /*
             * ADMIN has no teacherId, so ADMIN can edit.
             *
             * TEACHER can edit only marks belonging to
             * their own TeachingAssignment.
             *
             * A Class Teacher may see marks from their
             * Class Teacher section, but those marks remain
             * read-only unless they also teach that subject.
             */
            const canEdit =
              teacherId === undefined ||
              mark.teachingAssignment.teacher.id ===
                teacherId;

            return (
              <TableRow key={mark.id}>
                <TableCell>
                  {mark.student.firstName}{" "}
                  {mark.student.lastName}
                  {" ("}
                  {mark.student.admissionNumber}
                  {")"}
                </TableCell>

                <TableCell>
                  {mark.teachingAssignment.subject.name}
                  {" ("}
                  {mark.teachingAssignment.subject.code}
                  {")"}
                </TableCell>

                <TableCell>
                  {
                    mark.teachingAssignment.section
                      .class.name
                  }
                </TableCell>

                <TableCell>
                  {
                    mark.teachingAssignment.section
                      .name
                  }
                </TableCell>

                <TableCell>
                  {mark.academicPeriod.name}
                  {" ("}
                  {mark.academicPeriod.type ===
                  "EXAM"
                    ? "Exam"
                    : "Term"}
                  {")"}
                </TableCell>

                <TableCell>
                  {mark.academicPeriod.academicYear.name}
                </TableCell>

                <TableCell>
                  {mark.marks} /{" "}
                  {mark.maxMarks}
                </TableCell>

                <TableCell align="right">
                  {!mark.academicPeriod
                    .marksUploadOpen ? (
                    <>
                      <Button
                        variant="outlined"
                        color="warning"
                        size="small"
                        disabled
                      >
                        Marks Locked
                      </Button>

                      <Typography
                        variant="caption"
                        color="warning.main"
                        sx={{
                          display: "block",
                          mt: 0.5,
                        }}
                      >
                        Marks upload is closed.
                      </Typography>
                    </>
                  ) : canEdit ? (
                    <Button
                      component={Link}
                      href={`/dashboard/marks/${mark.id}/edit`}
                      variant="outlined"
                      size="small"
                    >
                      Edit
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      disabled
                    >
                      View Only
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}