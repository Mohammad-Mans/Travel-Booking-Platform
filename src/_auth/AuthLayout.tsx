import { Outlet } from "react-router-dom";
import "./AuthLayout.css";
import { Grid, Typography } from "@mui/material";

const AuthLayout = () => {
  return (
    <Grid
      container
      component="main"
      className="auth"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Grid item xs={12} sm={8} md={5}>
        <Outlet />

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 5 }}
        >
          {`Copyright © Vista Voyage ${new Date().getFullYear()}.`}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default AuthLayout;
