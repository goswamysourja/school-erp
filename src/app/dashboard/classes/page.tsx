
import { Role } from "@prisma/client";

import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { requireRole } from "@/modules/auth/guards/require-role.guard";
import { getClasses } from "@/modules/classes/services/get-classes.service";
import { ClassesListClient } from "@/components/classes/classes-list-client";

export default async function ClassesPage() {
  const currentUser = await requireRole([Role.ADMIN]);

  if (!currentUser.tenantId) {
    throw new Error("Tenant assignment missing");
  }

  const classes = await getClasses({
    tenantId: currentUser.tenantId,
  });

  return (
    <Stack
      spacing={3.5}
      sx={{
        width: "100%",
        pb: 4,
      }}
    >
      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          justifyContent: "space-between",
          alignItems: {
            xs: "stretch",
            sm: "center",
          },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.02em",
              fontSize: {
                xs: "1.8rem",
                sm: "2.125rem",
              },
            }}
          >
            Classes
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.75,
            }}
          >
            Manage academic classes and sections for your institution.
          </Typography>
        </Box>

        <Button
          href="/dashboard/classes/create"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            alignSelf: {
              xs: "flex-start",
              sm: "center",
            },
            minHeight: 44,
            px: 2.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          Create Class
        </Button>
      </Box>

      {/* Classes */}
      <ClassesListClient initialClasses={classes} />
    </Stack>
  );
}
