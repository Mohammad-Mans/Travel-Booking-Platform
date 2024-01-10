import { screen } from "@testing-library/react";
import App from "./App";
import render from "./test/render";

describe("App", () => {
  describe("Smoke Tests", () => {
    it("Should render the login page when the app opens for the first time", () => {
      render(<App />, {
        initialEntries: ["/"],
      });

      expect(screen.getByText(/Welcome Back!/)).toBeInTheDocument();
    });

    it("Should render missing page when the path is not matched", () => {
      render(<App />, {
        initialEntries: ["/nonexistent"],
      });

      expect(screen.getByText(/404/)).toBeInTheDocument();
    });
  });
});
