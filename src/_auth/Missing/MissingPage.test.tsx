import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import render from "../../test/render";
import MissingPage from "./MissingPage";
import * as router from "react-router";

const getters = {
  getNotFound: () => screen.getByText(/404/),
  getNotFoundMessage: () =>
    screen.getByText(/The page you're looking for doesn't exist./),
  getGoBackButton: () => screen.getByRole("button", { name: /Go Back/ }),
};

describe("MissingPage", () => {
  beforeEach(() => {
    render(<MissingPage />);
  });

  describe("Smoke Tests", () => {
    it("Should render MissingPage Component Correctly", () => {
      const goBackButton = getters.getGoBackButton();
      const notFound = getters.getNotFound();
      const notFoundMessage = getters.getNotFoundMessage();

      expect(notFound).toBeInTheDocument();
      expect(notFoundMessage).toBeInTheDocument();
      expect(goBackButton).toBeInTheDocument();
    });
  });

  describe("Functionality", () => {
    const mockNavigate = vi.fn();
    vi.spyOn(router, "useNavigate").mockImplementation(() => mockNavigate);

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("navigates back when 'Go Back' button is clicked", async () => {
      const goBackButton = getters.getGoBackButton();

      await userEvent.click(goBackButton);

      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });
});
