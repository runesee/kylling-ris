import "@testing-library/jest-dom";
import { describe, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import LoginPage from "./loginpage";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { SIGNIN_QUERY } from "../../features/auth/use-login";

const mockData = {
  email: "test@test.com",
  password: "Test@t3st.com"
};

const mocks = [
  {
    request: {
      query: SIGNIN_QUERY,
      variables: {
        email: mockData.email,
        password: mockData.password
      }
    },
    result: vi.fn(() => ({
      data: {
        userId: "10"
      }
    }))
  }
];

const loginMock = mocks[0].result;

describe("Login page", () => {
  test("Login page renders correctly", () => {
    const { container, getByTestId } = render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container).toMatchSnapshot();

    const email = getByTestId("e-mail");
    const password = getByTestId("password");
    const submit = getByTestId("submit");

    // Test initial state of elements
    expect(email).toHaveValue("");
    expect(password).toHaveValue("");
    expect(submit).toBeDisabled();
  });

  test("User inputs", async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </MockedProvider>
    );

    const email = getByTestId("e-mail");
    const password = getByTestId("password");
    const submit = getByTestId("submit");

    // Test simple inputs and submit button
    await userEvent.type(email, "Ola.Nordmann@mail.no");
    expect(submit).toBeDisabled();
    expect(email).toHaveValue("Ola.Nordmann@mail.no");
    await userEvent.clear(email);
    await userEvent.type(password, "ola123");
    expect(submit).toBeDisabled();
    expect(password).toHaveValue("ola123");
    await userEvent.type(email, "Ola.Nordmann@mail.no");
    expect(submit).toBeEnabled();

    // Test whitespace not added
    await userEvent.clear(email);
    await userEvent.clear(password);
    await userEvent.type(email, " Ol   a.Nordman n@ma  il.no    ");
    await userEvent.type(password, " ola 123");
    expect(email).toHaveValue("Ola.Nordmann@mail.no");
    expect(password).toHaveValue("ola123");

    // Test legal values
    await userEvent.clear(email);
    await userEvent.clear(password);
    await userEvent.type(email, mockData.email);
    await userEvent.type(password, mockData.password);
    await userEvent.click(submit);
    expect(loginMock).toHaveBeenCalled();
  });
});
