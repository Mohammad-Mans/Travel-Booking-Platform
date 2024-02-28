import { Outlet } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import backgroundImage from "../../../assets/images/vista-voyage-login.png";

const AuthLayout = () => {
  return (
    <Grid
      container
      component="main"
      className="auth"
      justifyContent="center"
      height="100vh"
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        boxShadow: "inset 0 0 0 1000px #00000055",
      }}
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
