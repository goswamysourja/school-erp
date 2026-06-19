import {
  Box,
  Typography,
} from "@mui/material";

import { DataCard }
  from "@/components/ui/data-card";

interface Props {
  name: string;
  role: string;
}

export function WelcomeCard({
  name,
  role,
}: Props) {
  return (
    <DataCard>
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
          }}
        >
          Welcome Back 👋
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mt: 2,
            fontWeight: 600,
          }}
        >
          {name}
        </Typography>

        <Typography
          color="text.secondary"
        >
          {role.replaceAll(
            "_",
            " "
          )}
        </Typography>
      </Box>
    </DataCard>
  );
}