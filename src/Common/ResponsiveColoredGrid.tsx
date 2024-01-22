import { FC } from "react";
import { Grid, GridProps } from "@mui/material";

type ResponsiveColoredGridProps = GridProps & {
  children: React.ReactNode;
};

import React from "react";

const ResponsiveColoredGrid: FC<ResponsiveColoredGridProps> = ({
  children,
  color,
  component = "section",
  py = 4,
  ...rest
}) => {
  const ConfigGridContainer: GridProps = {
    component: component,
    bgcolor: color,
    py: py,
    sx: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  };

  const ConfigGridItem: GridProps = {
    xs: 11,
    lg: 9,
    width: "100%",
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
