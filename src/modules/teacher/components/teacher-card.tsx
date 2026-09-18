import {
  Box,
  Stack,
  Typography,
} from "@mui/material";

import type {
  TeacherResponse,
} from "../types";

import { DataCard }
  from "@/components/ui/data-card";

import { StatusChip }
  from "@/components/ui/status-chip";

interface Props {
  teacher: TeacherResponse;
}

export function TeacherCard({
  teacher,
}: Props) {
  return (
    <DataCard>
      <Stack spacing={2}>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
            }}
          >
            {teacher.fullName}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {teacher.employeeId}
          </Typography>
        </Box>

        <Stack spacing={0.5}>
          <Typography variant="body2">
            <strong>User Phone:</strong>{" "}
            {teacher.userPhone}
          </Typography>

          <Typography variant="body2">
            <strong>Phone:</strong>{" "}
            {teacher.phone ?? "-"}
          </Typography>

          <Typography variant="body2">
            <strong>Qualification:</strong>{" "}
            {teacher.highestQualification ?? "-"}
          </Typography>

          <Typography variant="body2">
            <strong>Joined:</strong>{" "}
            {teacher.joiningDate
              ? new Date(
                teacher.joiningDate,
              ).toLocaleDateString()
              : "-"}
          </Typography>
        </Stack>

        <Box>
          <StatusChip
            active={teacher.isActive}
          />
        </Box>
      </Stack>
    </DataCard>
  );
}