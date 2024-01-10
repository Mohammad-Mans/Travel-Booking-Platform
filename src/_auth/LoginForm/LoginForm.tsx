import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import { IconButton, InputAdornment } from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { Formik, Form } from "formik";
import FormikTextField from "../../common/FormikTextField";
import FormikSubmitButton from "../../common/FormikSubmitButton";
import { LoginValidation } from "../../validation";
import SnackbarAlert from "../../common/SnackbarAlert";
import axios from "../../api/axios";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;

const INITIAL_FORM_STATE = {
  userName: "",
  password: "",
};

type SubmitProps = {
  userName: string;
  password: string;
};

const LoginForm = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState({ state: false, msg: "" });

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values: SubmitProps) => {
    try {
      setLoading(true);
      const response = await axios.post(LOGIN_URL, JSON.stringify(values), {
        headers: { "Content-Type": "application/json" },
      });

      const accessToken = response?.data?.authentication;
      const role = response?.data?.userType;
      localStorage.setItem("user_data", JSON.stringify({ role, accessToken }));

      if (role === "User") {
        navigate("/");
      } else if (role === "Admin") {
        navigate("/admin");
      }
    } catch (err) {
      const axiosError = err as AxiosError;

      if (!axiosError?.response) {
        setLoginError({ state: true, msg: "No Server Response" });
      } else if (axiosError.response?.status === 401) {
        setLoginError({ state: true, msg: "Unauthorized Access" });
      } else {
        setLoginError({ state: true, msg: "Login Failed" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
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
        Welcome Back!
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
                      onClick={() => setShowPassword((show) => !show)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
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

            <SnackbarAlert
              open={loginError.state}
              onClose={() => setLoginError({ ...loginError, state: false })}
            >
              <>{loginError.msg}</>
            </SnackbarAlert>
          </Box>
        </Form>
      </Formik>
    </Box>
  );
};

export default LoginForm;
