import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

type RootLayoutProps = {
  allowedRole: string;
};

const RootLayout = ({ allowedRole }: RootLayoutProps) => {
  const { auth } = useAuth();

  return auth?.role === allowedRole ? <Outlet /> : <Navigate to="/login" />;
};

export default RootLayout;
