import { screen, waitFor } from "@testing-library/react";
import render from "../../test/render";
import LoginPage from ".";
import userEvent from "@testing-library/user-event";
import  axios, { AxiosResponse } from "axios";
import * as router from "react-router";
import { useNavigate } from "react-router-dom";

import { vi } from 'vitest';

// Cast the axios mock to include Vitest's mocking functions
vi.mock('axios', () => ({
  post: vi.fn(() => Promise.resolve({ data: {} } as AxiosResponse)),
}));

// Use vi.mocked to provide type information for the mocked axios.post
// const mockedAxiosPost = vi.mocked(axios.post);

const getters = {
  getPersonIcon: () => screen.getByTestId(/PersonIcon/),
  getHeader: () => screen.getByText(/Welcome Back!/),
  getUserNameInput: () => screen.getByLabelText(/User Name/),
  getPasswordInput: () => screen.getByLabelText(/Password/),
  getTogglePasswordVisibilityButton: () =>
    screen.getByRole("button", { name: /toggle password visibility/ }),
  getSignInButton: () => screen.getByRole("button", { name: /Sign In/ }),
  getUserNameValidationMessage: () =>
    screen.findByText(/User Name is required/),
  getPasswordValidationMessage: () => screen.findByText(/Password is required/),
};

const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;

const mockedUser = {
  userName: "test",
  password: "test",
};

const mockLoginResponse = {
  data: {
    authentication: "mockAccessToken",
    userType: "type",
  },
};

const mockErrorResponse = {
  response: {
    status: 401,
  },
};

const mockNoServerResponse = {
  response: undefined,
};

const mockLoginFailedResponse = {
  response: {
    status: 500,
  },
};

const mockAdminReslovedResponse = {
  data: {
    authentication: "mockAccessToken",
    userType: "Admin",
  },
};

const mockUserReslovedResponse = {
  data: {
    authentication: "mockAccessToken",
    userType: "User",
  },
};

type MockedUser = {
  userName: string;
  password: string;
};

const loginUser = async (mockedUser: MockedUser) => {
  const signInButton = getters.getSignInButton();
  const userNameInput = getters.getUserNameInput();
  const passwordInput = getters.getPasswordInput();
  await userEvent.type(userNameInput, mockedUser.userName);
  await userEvent.type(passwordInput, mockedUser.password);
  await userEvent.click(signInButton);
};

describe("LoginPage", () => {
  describe("Smoke Tests", () => {
    beforeEach(() => {
      render(<LoginPage />);
    });

    it("Should render LoginPage Component Correctly", () => {
      const avatar = getters.getPersonIcon();
      const header = getters.getHeader();
      const userNameInput = getters.getUserNameInput();
      const passwordInput = getters.getPasswordInput();
      const togglePasswordVisibilityButton =
        getters.getTogglePasswordVisibilityButton();
      const signInButton = getters.getSignInButton();

      expect(avatar).toBeInTheDocument();
      expect(header).toBeInTheDocument();
      expect(userNameInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(togglePasswordVisibilityButton).toBeInTheDocument();
      expect(signInButton).toBeInTheDocument();
    });

    it("Should has the User Name input autofocused by default", () => {
      const userNameInput = getters.getUserNameInput();

      expect(userNameInput.autofocus);
    });
  });

  describe("Validations", () => {
    beforeEach(() => {
      render(<LoginPage />);
    });

    it("Should show User Name is required & Password is required when the user login with empty fields", async () => {
      const buton = getters.getSignInButton();
      userEvent.click(buton);
      const passwordValidationMessage =
        await getters.getPasswordValidationMessage();
      const userNameValidationMessage =
        await getters.getUserNameValidationMessage();

      expect(passwordValidationMessage).toBeInTheDocument();
      expect(userNameValidationMessage).toBeInTheDocument();
    });

    it("Should show User Name is required when the user clears the input or leave the field empty", async () => {
      const userNameInput = getters.getUserNameInput();
      await userEvent.type(userNameInput, "test");
      await userEvent.clear(userNameInput);
      await userEvent.click(document.body);
      const userNameValidationMessage =
        await getters.getUserNameValidationMessage();

      expect(userNameValidationMessage).toBeInTheDocument();
    });

    it("Should show password is required when the user clears the input or leave the field empty", async () => {
      const passwordInput = getters.getPasswordInput();
      await userEvent.type(passwordInput, "test");
      await userEvent.clear(passwordInput);
      await userEvent.click(document.body);
      const passwordValidationMessage =
        await getters.getPasswordValidationMessage();

      expect(passwordValidationMessage).toBeInTheDocument();
    });
  });

  describe.only("Functionality", () => {
    beforeEach(() => {
      render(<LoginPage />);
    });

    it('should call login API and navigate on successful login', async () => {
      const mockNavigate = vi.fn();
      vi.mocked(useNavigate).mockImplementation(() => mockNavigate);
      // axios.post.mockResolvedValue({ data: { authentication: 'token', userType: 'User' } }); // Mock successful login response
  
      render(<LoginPage />);
      const userNameInput = screen.getByLabelText(/User Name/);
      const passwordInput = screen.getByLabelText(/Password/);
      const signInButton = screen.getByRole('button', { name: /Sign In/ });
  
      // Simulate user input
      await userEvent.type(userNameInput, 'testUser');
      await userEvent.type(passwordInput, 'testPassword');
      userEvent.click(signInButton);
  
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          '/api/auth/authenticate', // Ensure this matches your actual login URL
          JSON.stringify({ userName: 'testUser', password: 'testPassword' }),
          { headers: { 'Content-Type': 'application/json' } },
        );
        expect(mockNavigate).toHaveBeenCalledWith('/'); // Or '/admin', depending on the userType in the response
      });
    });

    it("Should call Login API upon submitting the form with the required data", async () => {
      vi.spyOn(axios, "post").mockResolvedValue(mockLoginResponse);

      loginUser(mockedUser);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          LOGIN_URL,
          JSON.stringify({ userName: "test", password: "test" }),
          { headers: { "Content-Type": "application/json" } }
        );
      });
    });

    it("Should show Snackbar with 'No Server Response' message when there is no response from server", async () => {
      vi.spyOn(axios, "post").mockRejectedValue(mockNoServerResponse);

      loginUser(mockedUser);

      await waitFor(() => {
        const snackbarMessage = screen.getByText(/No Server Response/);
        expect(snackbarMessage).toBeInTheDocument();
      });
    });

    it("Should show Snackbar with 'Unauthorized Access' message when Unauthorized user attempt to login", async () => {
      vi.spyOn(axios, "post").mockRejectedValue(mockErrorResponse);

      loginUser(mockedUser);

      await waitFor(() => {
        const snackbarMessage = screen.getByText(/Unauthorized Access/);
        expect(snackbarMessage).toBeInTheDocument();
      });
    });

    it("Should show Snackbar with 'Login Failed' message for generic error response", async () => {
      vi.spyOn(axios, "post").mockRejectedValue(mockLoginFailedResponse);

      loginUser(mockedUser);

      await waitFor(() => {
        const snackbarMessage = screen.getByText(/Login Failed/);
        expect(snackbarMessage).toBeInTheDocument();
      });
    });

    it("should toggle showPassword state when clicking on password visibility button", async () => {
      const toggleButton = getters.getTogglePasswordVisibilityButton();
      const passwordInput = getters.getPasswordInput();

      expect(passwordInput).toHaveAttribute("type", "password");
      await userEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute("type", "text");
      await userEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute("type", "password");
    });
  });

  describe("Navigation", () => {
    const mockNavigate = vi.fn();
    vi.spyOn(router, "useNavigate").mockImplementation(() => mockNavigate);

    beforeEach(() => {
      render(<LoginPage />);
    });

    it("Should navigate to home page on successful login as User", async () => {
      vi.spyOn(axios, "post").mockResolvedValue(mockUserReslovedResponse);

      loginUser(mockedUser);

      await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
    });

    it("Should navigate to admin page on successful login as Admin", async () => {
      vi.spyOn(axios, "post").mockResolvedValue(mockAdminReslovedResponse);

      loginUser(mockedUser);

      await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/admin"));
    });
  });
});
