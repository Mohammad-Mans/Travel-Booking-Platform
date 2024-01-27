import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import ThemeConfig from "./config/theme.config.tsx";
import { SnackbarErrorProvider } from "./context/SnackbarErrorProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeConfig>
      <SnackbarErrorProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SnackbarErrorProvider>
    </ThemeConfig>
  </React.StrictMode>
);
