import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import AuthLayout from "./_auth/AuthLayout";
import LoginForm from "./_auth/LoginForm/LoginForm";
import MissingPage from "./_auth/Missing/MissingPage";
import RootLayout from "./_root/RootLayout";
import {
  HomePage,
  AdminPage,
  HomeLayout,
  SearchPage,
  CheckoutPage,
  ConfirmationPage,
  HotelPage,
  CitiesPage,
  HotelsPage,
  RoomsPage,
} from "./_root/pages";
import "./App.css";

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginForm />} />
      </Route>

      <Route element={<RootLayout allowedRole="User" />}>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<HomePage />} />
          <Route path="Search" element={<SearchPage />} />
          <Route path="hotel/:hotelId" element={<HotelPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route
            path="confirmation/:confirmationNumber"
            element={<ConfirmationPage />}
          />
        </Route>
      </Route>

      <Route element={<RootLayout allowedRole="Admin" />}>
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<CitiesPage />} />
          <Route path="hotels" element={<HotelsPage />} />
          <Route path="rooms" element={<RoomsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<MissingPage />} />
    </Routes>
  );
}

export default App;
