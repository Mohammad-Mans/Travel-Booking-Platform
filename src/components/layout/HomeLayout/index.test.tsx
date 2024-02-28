import { screen } from "@testing-library/react";
import render from "../../../test/render.tsx";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import * as router from "react-router";
import HomeLayout from "./index.tsx";

const getters = {
  getLogo: () => screen.getByAltText(/Logo/),
  getHeader: () => screen.getByText(/Vista Voyage/),
  getHomeButton: () => screen.getByRole("button", { name: "Home" }),
  getLogoutButton: () => screen.getByRole("button", { name: "Logout" }),
  getLuggageIcon: () => screen.getByTestId(/LuggageIcon/),
  getOutlet: () => screen.getByText(/Test Outlet/),
};

const MockOutlet = () => <div>Test Outlet</div>;

describe("HomeLayout", () => {
  describe("Smoke Tests", () => {
    it("Should render AuthLayout Component Correctly", () => {
      render(
        <Routes>
          <Route element={<HomeLayout />}>
            <Route path="/" element={<MockOutlet />} />
          </Route>
        </Routes>
      );

      screen.debug();

      const logo = getters.getLogo();
      const header = getters.getHeader();
      const homeButton = getters.getHomeButton();
      const logoutButton = getters.getLogoutButton();
      const luggageIcon = getters.getLuggageIcon();
      const outlet = getters.getOutlet();

      expect(logo).toBeInTheDocument();
      expect(header).toBeInTheDocument();
      expect(homeButton).toBeInTheDocument();
      expect(logoutButton).toBeInTheDocument();
      expect(luggageIcon).toBeInTheDocument();
      expect(outlet).toBeInTheDocument();
    });
  });

  describe("Functionality", () => {
    const mockNavigate = vi.fn();
    vi.spyOn(router, "useNavigate").mockImplementation(() => mockNavigate);

    beforeEach(()=>{
        render(<HomeLayout/>);
    })

    it("navigates to Home page when 'Logo' button is clicked", async () => {
      const logo = getters.getLogo();

      await userEvent.click(logo);

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("navigates to Home page when 'Home' button is clicked", async () => {
      const homeButton = getters.getHomeButton();

      await userEvent.click(homeButton);

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("navigates to Login page when 'Logout' button is clicked", async () => {
      const logoutButton = getters.getLogoutButton();

      await userEvent.click(logoutButton);

      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    it("navigates to Checkout page when 'LuggageIcon' button is clicked", async () => {
      const luggageIcon = getters.getLuggageIcon();

      await userEvent.click(luggageIcon);

      expect(mockNavigate).toHaveBeenCalledWith("/checkout");
    });
  });
});
