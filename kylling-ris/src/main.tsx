import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/app";
import store from "./redux/store";
import { Provider } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import { apolloClient } from "./apollo-client/apollo-client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);

const originalConsoleError = console.error;
console.error = function (msg) {
  if (
    msg.startsWith(
      "Warning: React does not recognize the `sortActive` prop on a DOM element."
    )
  )
    return;
  if (
    msg.startsWith("Warning: Received `%s` for a non-boolean attribute `%s`.")
  )
    return;
  if (
    msg.startsWith(
      "Warning: React does not recognize the `%s` prop on a DOM element."
    )
  )
    return;
  if (msg.startsWith("Warning: The tag %s is unrecognized in this browser."))
    return;

  originalConsoleError(msg);
};

const originalConsoleWarn = console.warn;
console.warn = function (msg) {
  if (msg.startsWith("styled-components:")) return;
  if (
    msg.startsWith(
      "An error occurred! For more details, see the full error text at"
    )
  )
    return;

  originalConsoleWarn(msg);
};
