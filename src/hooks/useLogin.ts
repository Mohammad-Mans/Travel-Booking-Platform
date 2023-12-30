import { useContext } from "react";
import AuthContext from "../contex/AuthProvider";
import axios from "../api/axios";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;

type loginProps = {
  userName: string;
  password: string;
};

const useLogin = () => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const login = async (values: loginProps) => {
    try {
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
    } catch (error) {
      const axiosError = error as AxiosError;

      if (!axiosError?.response) {
        console.error("No Server Response");
      } else if (axiosError.response?.status === 401) {
        console.error("Unauthorized error");
      } else [console.error("Login Failed")];
    }
  };

  return { login };
};

export default useLogin;
