import { Outlet, Navigate } from "react-router-dom";
import "./AuthLayout.css";

const AuthLayout = () => {
  const isAuthinticated = false;
  const isAdmin = false;

  return (
    <>
      {isAuthinticated ? (
        isAdmin ? (
          <Navigate to="/admin" />
        ) : (
          <Navigate to="/" />
        )
      ) : (
        <main className="auth">
          {" "}
          <section className="auth-body">
            <Outlet />
          </section>
        </main>
      )}
    </>
  );
};

export default AuthLayout;
