import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import ThemeConfig from "./config/theme.config.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeConfig>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeConfig>
  </React.StrictMode>
);
