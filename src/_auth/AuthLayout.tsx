import { Outlet } from "react-router-dom";
import "./AuthLayout.css";

const AuthLayout = () => {
  return (
    <main className="auth">
      <section className="auth-body">
        <Outlet />
      </section>
    </main>
  );
};

export default AuthLayout;
