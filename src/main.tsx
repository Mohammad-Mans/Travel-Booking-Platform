import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import ThemeConfig from "./config/theme.config.tsx";
import { AuthProvider } from "./contex/AuthProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeConfig>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/*' element={<App />}/>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeConfig>
  </React.StrictMode>
);
