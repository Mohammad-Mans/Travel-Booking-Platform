import { Routes, Route } from "react-router-dom";
import AuthLayout from "./_auth/AuthLayout";
import LoginForm from "./_auth/LoginForm/LoginForm";
import MissingPage from "./_auth/Missing/MissingPage";
import RootLayout from "./_root/RootLayout";
import {
  HomePage,
  AdminPage,
} from "./_root/pages";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginForm />} />
        </Route>

        <Route element={<RootLayout allowedRole="User" />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        <Route element={<RootLayout allowedRole="Admin" />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<MissingPage />} />
      </Routes>
    </>
  );
}

export default App;
