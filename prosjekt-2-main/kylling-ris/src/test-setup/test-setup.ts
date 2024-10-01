import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

const originalConsoleError = console.error;
console.error = function (msg) {
  if (msg.startsWith("Error: Could not parse CSS stylesheet")) return; // ignore CSS error when testing
  if (
    msg.startsWith(
      "Warning: An update to %s inside a test was not wrapped in act(...)."
    )
  )
    return;
  originalConsoleError(msg);
};
