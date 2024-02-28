import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { HomeLayout, RootLayout, AuthLayout } from "./components/layout";
import {
  HomePage,
  AdminPage,
  SearchPage,
  CheckoutPage,
  ConfirmationPage,
  HotelPage,
  CitiesPage,
  HotelsPage,
  RoomsPage,
  LoginPage,
  MissingPage,
} from "./pages";
import "./App.css";

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
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
