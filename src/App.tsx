import { Routes, Route } from "react-router-dom";
import { HomePage } from "./root/pages";
import "./App.css";
import LoginPage from "./auth/LoginForm/LoginForm";
import AuthLayout from "./auth/AuthLayout";

function App() {
  return (
    <main>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route index element={<HomePage />} />
      </Routes>
    </main>
  );
}
``;

export default App;
