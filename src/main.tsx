import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import ThemeConfig from "./config/theme.config.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeConfig>
      <BrowserRouter>
          <Routes>
            <Route path='/*' element={<App />}/>
          </Routes>
      </BrowserRouter>
    </ThemeConfig>
  </React.StrictMode>
);
