import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { plainAxiosInstance } from "../../services/axiosInstance";
import { AxiosError } from "axios";
import { useSnackbarError } from "../../context/SnackbarErrorProvider";

interface SubmitProps {
  userName: string;
  password: string;
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setErrorMessage } = useSnackbarError();
  const navigate = useNavigate();

  const login = async (values: SubmitProps) => {
    try {
      setLoading(true);
      const response = await plainAxiosInstance.post(
        "/api/auth/authenticate",
        JSON.stringify(values),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const accessToken = response?.data?.authentication;
      const role = response?.data?.userType;
      const payload = accessToken.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));
      const userId = decodedPayload["user_id"];

      localStorage.setItem(
        "user_data",
        JSON.stringify({ role, accessToken, userId })
      );

      navigate(role === "Admin" ? "/admin" : "/");
    } catch (error) {
      const axiosError = error as AxiosError;

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

  return { login, loading };
};
