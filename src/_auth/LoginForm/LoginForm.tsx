import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import { IconButton, InputAdornment } from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { Formik, Form } from "formik";
import FormikTextField from "../../common/FormikTextField";
import FormikSubmitButton from "../../common/FormikSubmitButton";
import { LoginValidation } from "../../validation";
import useLogin from "../../hooks/useLogin";

const INITIAL_FORM_STATE = {
  userName: "",
  password: "",
};

const LoginForm = (): JSX.Element => {
  const { login, loading } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Grid
      container
      component="main"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Grid item xs={12} sm={8} md={5}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <PersonIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          <Formik
            initialValues={{ ...INITIAL_FORM_STATE }}
            validationSchema={LoginValidation}
            onSubmit={async (values) => {
              await login(values);
            }}
          >
            <Form>
              <Box sx={{ mt: 1 }}>
                <FormikTextField
                  name="userName"
                  label="User Name"
                  color="white"
                  autoFocus
                />

                <FormikTextField
                  name="password"
                  label="Password"
                  color="white"
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <FormikSubmitButton
                  loading={loading}
                  loadingPosition="center"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </FormikSubmitButton>
              </Box>
            </Form>
          </Formik>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 5 }}
          >
            {`Copyright © Vista Voyage ${new Date().getFullYear()}.`}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
