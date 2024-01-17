import React from "react";
import { Typography, Box } from "@mui/material";

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <Box component="header" mb={3} display="flex" alignItems="center">
      <Box width="6px" height="40px" mr={1} bgcolor="primary.main" />

      <Typography variant="h4">{title}</Typography>
    </Box>
  );
};

export default SectionHeader;
