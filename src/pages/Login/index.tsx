import { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { Formik, Form } from "formik";
import FormikTextField from "../../components/common/FormikTextField";
import FormikSubmitButton from "../../components/common/FormikSubmitButton";
import { LoginValidation } from "../../validation";
import { useLogin } from "../../services/authentication/useLogin";

const INITIAL_FORM_STATE = {
  userName: "",
  password: "",
};

type SubmitProps = {
  userName: string;
  password: string;
};

const LoginPage = (): JSX.Element => {
  const { login, loading } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (values: SubmitProps) => {
    login(values);
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

export default LoginPage;
