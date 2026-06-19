import {
  Box,
  Typography,
} from "@mui/material";

interface Props {
  title: string;
}

export function EmptyState({
  title,
}: Props) {
  return (
    <Box
      sx={{
        py: 10,
        textAlign:
          "center",
      }}
    >
      <Typography
        variant="h6"
      >
        {title}
      </Typography>
    </Box>
  );
}