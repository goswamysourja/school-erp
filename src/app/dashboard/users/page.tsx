import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import {
  Role,
  StaffDesignation,
} from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";
import { getTenantUsers } from "@/modules/users/services/get-tenant-users.service";
import { UsersListClient } from "@/components/users/users-list-client";

export default async function UsersPage() {
  const currentUser = await requireRole([Role.ADMIN]);

  if (!currentUser.tenantId) {
    throw new Error("Tenant assignment missing.");
  }

  const users = await getTenantUsers({
    tenantId: currentUser.tenantId,
  });

  const initialUsers = users.map((user) => {
    const nameParts = user.name.trim().split(/\s+/);

    return {
      id: user.id,
      firstName: nameParts[0] ?? "",
      lastName: nameParts.slice(1).join(" "),
      phone: user.phone,
      designation:
        user.designation ??
        (user.role === Role.TEACHER
          ? StaffDesignation.TEACHER
          : null),
      hasTeacherProfile: user.teacher !== null,
      isActive: user.isActive,
      tenant: user.tenant
        ? { name: user.tenant.name }
        : null,
    };
  });

  return (
    <Stack spacing={3.5} sx={{ pb: 4, minWidth: 0 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Staff
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage teachers, librarians, accountants, and other staff members.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          href="/dashboard/users/create"
          sx={{
            alignSelf: { xs: "flex-start", sm: "auto" },
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Add Staff
        </Button>
      </Stack>

      <UsersListClient initialUsers={initialUsers} />
    </Stack>
  );
}