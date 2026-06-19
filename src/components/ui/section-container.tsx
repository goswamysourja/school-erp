import Box from "@mui/material/Box";

export function SectionContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "grid",

        gap: 3,

        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(2, 1fr)",
          xl: "repeat(3, 1fr)",
        },
      }}
    >
      {children}
    </Box>
  );
}