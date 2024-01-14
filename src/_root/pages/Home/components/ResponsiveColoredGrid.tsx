import { FC } from "react";
import { Grid, GridProps } from "@mui/material";

type ResponsiveColoredGridProps = GridProps & {
  children: React.ReactNode;
};

import React from "react";

const ResponsiveColoredGrid: FC<ResponsiveColoredGridProps> = ({
  children,
  color,
  ...rest
}) => {
  const ConfigGridContainer: GridProps = {
    bgcolor: color,
    py: 4,
    sx: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  };

  const ConfigGridItem: GridProps = {
    xs: 11,
    lg: 9,
    ...rest,
  };

  return (
    <Grid container {...ConfigGridContainer}>
      <Grid item {...ConfigGridItem}>
        {children}
      </Grid>
    </Grid>
  );
};

export default ResponsiveColoredGrid;
