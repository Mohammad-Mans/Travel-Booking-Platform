import { Outlet } from "react-router-dom";
import "./AuthLayout.css";
import { Grid, Typography } from "@mui/material";

const AuthLayout = () => {
  return (
    <Grid
      container
      component="main"
      className="auth"
      justifyContent="center"
      height="100vh"
    >
      <Grid
        item
        xs={10}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Outlet />

        <Typography
          variant="body2"
          color="white.main"
          align="center"
          sx={{ m: 2 }}
        >
          {`Copyright © Vista Voyage ${new Date().getFullYear()}.`}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default AuthLayout;
