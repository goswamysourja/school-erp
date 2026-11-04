
import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";
import { getSections } from "@/modules/sections/services/get-sections.service";
import { PageHeader } from "@/components/ui/page-header";

import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

interface Props {
  searchParams: Promise<{
    classId?: string;
  }>;
}

export default async function SectionsPage({
  searchParams,
}: Props) {
  const currentUser = await requireRole([Role.ADMIN]);

  if (!currentUser.tenantId) {
    throw new Error("Tenant assignment missing");
  }

  const { classId } = await searchParams;

  const sections = await getSections({
    tenantId: currentUser.tenantId,
    classId,
  });

  const selectedClass = sections[0]?.class;

  return (
    <Stack spacing={3.5} sx={{ width: "100%", pb: 4 }}>
      {/* Page Header */}
      <PageHeader
        title={
          classId && selectedClass
            ? `Sections — ${selectedClass.name}`
            : "Sections"
        }
        subtitle={
          classId && selectedClass
            ? `Manage sections for ${selectedClass.name}`
            : classId
              ? "Manage sections for the selected class"
              : "Manage class sections"
        }
      />

      {/* Page Actions */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1.5,
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <Button
          href={
            classId
              ? `/dashboard/sections/create?classId=${encodeURIComponent(classId)}`
              : "/dashboard/sections/create"
          }
          variant="contained"
          sx={{
            minHeight: 42,
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
          Create Section
        </Button>

        {classId && (
          <Button
            href="/dashboard/classes"
            variant="outlined"
            color="inherit"
            sx={{
              minHeight: 42,
              px: 2.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Back to Classes
          </Button>
        )}
      </Box>

      {/* Sections List */}
      {sections.length === 0 ? (
        <Box
          sx={{
            p: { xs: 3, sm: 5 },
            border: 1,
            borderColor: "divider",
            borderRadius: 3,
            textAlign: "center",
            bgcolor: "background.paper",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 0.75 }}
          >
            No sections found
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {classId
              ? "No sections have been created for this class yet."
              : "There are no sections available yet."}
          </Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {sections.map((section) => (
            <Box
              key={section.id}
              sx={{
                p: { xs: 2, sm: 2.5 },
                border: 1,
                borderColor: "divider",
                borderRadius: 3,
                bgcolor: "background.paper",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                transition: "border-color 0.2s",
                "&:hover": {
                  borderColor: "primary.light",
                },
              }}
            >
              {/* Section Information */}
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700 }}
                >
                  Section {section.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Class: {section.class.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Academic Year:{" "}
                  {section.class.academicYearRecord?.name ??
                    section.class.academicYear ??
                    "N/A"}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    fontWeight: 600,
                    color: section.isActive
                      ? "success.main"
                      : "text.secondary",
                  }}
                >
                  {section.isActive ? "Active" : "Inactive"}
                </Typography>
              </Box>

              {/* Actions */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "flex-start", sm: "flex-end" },
                }}
              >
                <Button
                  href={`/dashboard/sections/${section.id}/edit`}
                  variant="outlined"
                  size="small"
                  sx={{
                    minHeight: 36,
                    px: 2,
                    borderRadius: 1.5,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Edit Section
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
