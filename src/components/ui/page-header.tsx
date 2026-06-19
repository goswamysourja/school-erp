import {
  Box,
  Typography,
} from "@mui/material";

interface Props {
  title: string;
  subtitle?: string;
}

export function PageHeader({
  title,
  subtitle,
}: Props) {
  return (
    <Box
      sx={{
        mb: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
        }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mt: 1,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}