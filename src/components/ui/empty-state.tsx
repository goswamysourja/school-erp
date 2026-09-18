import {
  Box,
  Typography,
} from "@mui/material";

interface Props {
  title: string;

  description?: string;
}

export function EmptyState({
  title,
  description,
}: Props) {
  return (
    <Box
      sx={{
        py: 10,
        textAlign: "center",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: description ? 1 : 0,
        }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}