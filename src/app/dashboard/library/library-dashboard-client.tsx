"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Role } from "@prisma/client";
import Link from "next/link";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CategoryIcon from "@mui/icons-material/Category";
import ViewListIcon from "@mui/icons-material/ViewList";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";

interface LibraryDashboardStats {
  inventory: {
    totalTitles: number;
    totalCopies: number;
    availableCopies: number;
    issuedCopies: number;
    lostCopies: number;
    damagedCopies: number;
    maintenanceCopies: number;
    removedCopies: number;
  };
  circulation: {
    activeLoans: number;
    overdueLoans: number;
    returnedLoans: number;
  };
  organization: {
    activeCategories: number;
    activeRacks: number;
  };
  finance: {
    fineCharged: number;
    finePaid: number;
    outstandingFine: number;
    replacementCharged: number;
    replacementPaid: number;
    outstandingReplacement: number;
    totalOutstanding: number;
  };
  generatedAt: string;
}

interface LibraryDashboardClientProps {
  name: string;
  role: Role;
}

interface KPIWidgetProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: string;
  bgcolor: string;
  valueColor?: string;
}

interface SubMetricProps {
  label: string;
  value: number | string;
  color?: string;
}

interface ActionCardProps {
  title: string;
  icon: ReactNode;
  href: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function LibraryDashboardClient({
  name,
  role,
}: LibraryDashboardClientProps) {
  const theme = useTheme();

  const [stats, setStats] = useState<LibraryDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/library/dashboard", {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          const result = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;

          throw new Error(
            result?.error ?? "Failed to load library dashboard.",
          );
        }

        const data =
          (await response.json()) as LibraryDashboardStats;

        setStats(data);
      } catch (error) {
        if (controller.signal.aborted) return;

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load library dashboard.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => controller.abort();
  }, []);

  return (
    <Stack spacing={3.5} sx={{ pb: 4, minWidth: 0 }}>
      {/* Dashboard heading and primary action */}
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
            Library Dashboard
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Library inventory, circulation, and financial overview
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/dashboard/library/loans"
          sx={{
            alignSelf: { xs: "flex-start", sm: "auto" },
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Issue Book
        </Button>
      </Stack>

      {/* Loading and error states */}
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 6,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {error && !loading && (
        <Alert severity="error">{error}</Alert>
      )}

      {stats && !loading && (
        <>
          {/* Primary KPI cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            <KPIWidget
              title="Total Titles"
              value={stats.inventory.totalTitles}
              icon={<MenuBookIcon />}
              color="primary.main"
              bgcolor="primary.light"
            />

            <KPIWidget
              title="Active Loans"
              value={stats.circulation.activeLoans}
              icon={<AssignmentTurnedInIcon />}
              color="info.dark"
              bgcolor="info.light"
            />

            <KPIWidget
              title="Overdue Loans"
              value={stats.circulation.overdueLoans}
              icon={<WarningAmberIcon />}
              color="error.dark"
              bgcolor="error.light"
              valueColor="error.main"
            />

            <KPIWidget
              title="Total Outstanding"
              value={formatCurrency(stats.finance.totalOutstanding)}
              icon={<AccountBalanceWalletIcon />}
              color="warning.dark"
              bgcolor="warning.light"
              valueColor="warning.dark"
            />
          </Box>

          {/* Inventory and financial overview */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                md: "minmax(0, 2fr) minmax(0, 1fr)",
              },
              gap: 3,
            }}
          >
            <Card
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 3 }}
                >
                  Inventory &amp; Circulation Status
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(2, minmax(0, 1fr))",
                      sm: "repeat(3, minmax(0, 1fr))",
                    },
                    gap: 3,
                  }}
                >
                  <SubMetric
                    label="Total Copies"
                    value={stats.inventory.totalCopies}
                  />

                  <SubMetric
                    label="Available"
                    value={stats.inventory.availableCopies}
                    color="success.main"
                  />

                  <SubMetric
                    label="Issued"
                    value={stats.inventory.issuedCopies}
                    color="info.main"
                  />

                  <Box sx={{ gridColumn: "1 / -1" }}>
                    <Divider />
                  </Box>

                  <SubMetric
                    label="Returned Loans"
                    value={stats.circulation.returnedLoans}
                  />

                  <SubMetric
                    label="Lost Copies"
                    value={stats.inventory.lostCopies}
                    color="error.main"
                  />

                  <SubMetric
                    label="Damaged Copies"
                    value={stats.inventory.damagedCopies}
                    color="warning.dark"
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Financial overview */}
            <Card
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 3 }}
                >
                  Financial Overview
                </Typography>

                <Stack spacing={3}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      Outstanding Fines
                    </Typography>

                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {formatCurrency(stats.finance.outstandingFine)}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      Outstanding Replacements
                    </Typography>

                    <Typography
                      variant="h5"
                      color="warning.dark"
                      sx={{
                        fontWeight: 700,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {formatCurrency(
                        stats.finance.outstandingReplacement,
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Quick actions */}
          <Box sx={{ pt: 1 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600 }}
              >
                Quick Actions
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Last updated:{" "}
                {new Date(stats.generatedAt).toLocaleString("en-IN")}
              </Typography>
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  sm: "repeat(3, minmax(0, 1fr))",
                  lg: "repeat(5, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              <ActionCard
                title="Book Catalog"
                icon={<LibraryBooksIcon />}
                href="/dashboard/library/books"
              />

              <ActionCard
                title="Manage Copies"
                icon={<MenuBookIcon />}
                href="/dashboard/library/copies"
              />

              <ActionCard
                title="Manage Loans"
                icon={<AssignmentTurnedInIcon />}
                href="/dashboard/library/loans"
              />

              <ActionCard
                title="Categories"
                icon={<CategoryIcon />}
                href="/dashboard/library/categories"
              />

              <ActionCard
                title="Library Racks"
                icon={<ViewListIcon />}
                href="/dashboard/library/racks"
              />

              {role === "ADMIN" && (
                <>
                  <ActionCard
                    title="Library Staff"
                    icon={<PeopleAltIcon />}
                    href="/dashboard/library/staff"
                  />

                  <ActionCard
                    title="Settings"
                    icon={<SettingsIcon />}
                    href="/dashboard/library/settings"
                  />
                </>
              )}
            </Box>
          </Box>
        </>
      )}
    </Stack>
  );
}

/* KPI card */

function KPIWidget({
  title,
  value,
  icon,
  color,
  bgcolor,
  valueColor = "text.primary",
}: KPIWidgetProps) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: 1,
        borderColor: "divider",
        borderRadius: 3,
        minWidth: 0,
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 2,
          "&:last-child": { pb: 2.5 },
        }}
      >
        <Avatar
          sx={{
            bgcolor,
            color,
            width: 48,
            height: 48,
            flexShrink: 0,
          }}
        >
          {icon}
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {title}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mt: 0.5,
              color: valueColor,
              overflowWrap: "anywhere",
            }}
          >
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

/* Inventory sub-metric */

function SubMetric({
  label,
  value,
  color = "text.primary",
}: SubMetricProps) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 0.5 }}
      >
        {label}
      </Typography>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color,
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

/* Navigation card */

function ActionCard({
  title,
  icon,
  href,
}: ActionCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        transition: "border-color 0.2s ease, transform 0.2s ease",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardActionArea
        component={Link}
        href={href}
        sx={{
          height: "100%",
          minHeight: 112,
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Box
          sx={{
            color: "primary.main",
            display: "flex",
            alignItems: "center",
            "& svg": { fontSize: 28 },
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="body2"
          color="text.primary"
          sx={{
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          {title}
        </Typography>
      </CardActionArea>
    </Card>
  );
}