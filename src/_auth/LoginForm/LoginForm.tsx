import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import { Formik, Form } from "formik";
import FormikTextField from "../../common/FormikTextField";
import FormikSubmitButton from "../../common/FormikSubmitButton";
import { LoginValidation } from "../../validation";
import { useState, useContext } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import AuthContext from "../../contex/AuthProvider";
import axios from "../../api/axios";
import { AxiosError } from "axios";

const LOGIN_URL = "/api/auth/authenticate";

const INITIAL_FORM_STATE = {
  userName: "",
  password: "",
};

type handleSubmitProps = {
  userName: string;
  password: string;
};

const LoginForm = (): JSX.Element => {
  const { setAuth } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values: handleSubmitProps) => {
    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify(values), {
        headers: { "Content-Type": "application/json" },
      });

      const accessToken = response?.data?.authentication;
      const role = response?.data?.userType;
      setAuth({ role, accessToken });
    } catch (error) {
      const axiosError = error as AxiosError;

      if (!axiosError?.response) {
        console.error("No Server Response");
      } else if (axiosError.response?.status === 401) {
        console.error("Unauthorized error");
      } else [console.error("Login Failed")];
    }
  };

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
            onSubmit={handleSubmit}
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

                <FormikSubmitButton sx={{ mt: 3, mb: 2 }}>
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
