import { screen } from "@testing-library/react";
import AuthLayout from ".";
import render from "../../../test/render";
import { Routes, Route } from "react-router-dom";

const MockOutlet = () => <div>Test Outlet</div>;

describe("AuthLayout", () => {
  describe("Smoke Tests", () => {
    it("Should render AuthLayout Component Correctly", () => {
      render(
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<MockOutlet />} />
          </Route>
        </Routes>
      );

      const currentYear = new Date().getFullYear();
      const copyrightText = `Copyright © Vista Voyage ${currentYear}.`;

      expect(screen.getByText(/Test Outlet/)).toBeInTheDocument();
      expect(screen.getByText(copyrightText)).toBeInTheDocument();
    });
  });
});
