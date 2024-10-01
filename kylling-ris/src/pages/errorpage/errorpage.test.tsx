import { render } from "@testing-library/react";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "../../apollo-client/apollo-client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../redux/store";
import ErrorPage from "./errorpage";

test("renders Mainpage component correctly", () => {
  const { container } = render(
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <Provider store={store}>
          <ErrorPage />
        </Provider>
      </BrowserRouter>
    </ApolloProvider>
  );
  expect(container).toMatchSnapshot();
});
