import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import { IconButton, InputAdornment } from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { Formik, Form } from "formik";
import FormikTextField from "../../Common/FormikTextField";
import FormikSubmitButton from "../../Common/FormikSubmitButton";
import { LoginValidation } from "../../validation";
import axios from "../../api/axios";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbarError } from "../../context/SnackbarErrorProvider";

const LOGIN_URL = "/api/auth/authenticate";

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
  const { setErrorMessage } = useSnackbarError();

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
      const payload = accessToken.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));
      const userId = decodedPayload["user_id"];

      localStorage.setItem(
        "user_data",
        JSON.stringify({ role, accessToken, userId })
      );

      if (role === "User") {
        navigate("/");
      } else if (role === "Admin") {
        navigate("/admin");
      }
    } catch (err) {
      const axiosError = err as AxiosError;

      if (!axiosError?.response) {
        setErrorMessage("No Server Response");
      } else if (axiosError.response?.status === 401) {
        setErrorMessage("Unauthorized Access");
      } else {
        setErrorMessage("Login Failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        mt: 6,
        mx: 4,
        px: 2,
        pt: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 1,
        background: "rgba(255,255,255,0.6)0%",
        width: "100%",
        maxWidth: "430px",
      }}
    >
      <Avatar sx={{ p: 4, bgcolor: "primary.main" }}>
        <PersonIcon sx={{ fontSize: "2.5rem" }} />
      </Avatar>
      <Typography
        component="h1"
        variant="h5"
        color="primary.main"
        sx={{ my: 1 }}
      >
        Welcome Back!
      </Typography>

      <Formik
        initialValues={{ ...INITIAL_FORM_STATE }}
        validationSchema={LoginValidation}
        onSubmit={handleSubmit}
      >
        <Form style={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <FormikTextField
              name="userName"
              label="User Name"
              color="white"
              variant="standard"
              autoFocus
            />

            <FormikTextField
              name="password"
              label="Password"
              color="white"
              variant="standard"
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
                      sx={{
                        mb: 1,
                        mr: 0.1,
                      }}
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
    </Box>
  );
};

export default LoginForm;
