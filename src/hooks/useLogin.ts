import { useState } from "react";
import axios from "../api/axios";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;

type loginProps = {
  userName: string;
  password: string;
};

const useLogin = () => {
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState({ state: false, msg: "" });

  const navigate = useNavigate();

  const login = async (values: loginProps) => {
    try {
      setLoading(true);
      const response = await axios.post(LOGIN_URL, JSON.stringify(values), {
        headers: { "Content-Type": "application/json" },
      });

      const accessToken = response?.data?.authentication;
      const role = response?.data?.userType;
      setAuth({ role, accessToken });

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

  return { login, loading, loginError, setLoginError };
};

export default useLogin;
