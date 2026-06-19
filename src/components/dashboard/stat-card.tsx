import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
} from "@mui/material";

import PeopleIcon
  from "@mui/icons-material/People";

import ApartmentIcon
  from "@mui/icons-material/Apartment";

import SchoolIcon
  from "@mui/icons-material/School";

interface Props {
  title: string;
  value: number;
}

function getIcon(
  title: string
) {
  switch (title) {
    case "Users":
      return <PeopleIcon />;

    case "Tenants":
      return <ApartmentIcon />;

    case "Classes":
      return <SchoolIcon />;

    default:
      return null;
  }
}

export function StatCard({
  title,
  value,
}: Props) {
  return (
    <Card
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Box>
            {getIcon(title)}
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {title}
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
            }}
          >
            {value}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}