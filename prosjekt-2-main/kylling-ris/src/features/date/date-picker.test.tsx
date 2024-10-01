import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import DatePicker from "./date-picker";
import { Provider } from "react-redux";
import store from "../../redux/store";

// Constants needed for some of the tests
const currentDate = new Date();
const weekdays = [
  "Søndag",
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lørdag"
];
const months = [
  "januar",
  "februar",
  "mars",
  "april",
  "mai",
  "juni",
  "juli",
  "august",
  "september",
  "oktober",
  "november",
  "desember"
];

describe("DatePicker", () => {
  test("DatePicker renders correctly", () => {
    const { getByTestId, queryByTestId } = render(
      <Provider store={store}>
        <DatePicker />
      </Provider>
    );

    expect(getByTestId("date-picker")).toBeInTheDocument();
    expect(getByTestId("backward-arrow")).toBeInTheDocument();
    expect(getByTestId("weekday")).toBeInTheDocument();
    expect(getByTestId("forward-arrow")).toBeInTheDocument();
    expect(getByTestId("full-date")).toBeInTheDocument();

    // Calendar should not render, since it only pops up when the user clicks the weekday
    expect(queryByTestId("calendar-container")).not.toBeInTheDocument();
  });

  test("DatePicker renders calendar when weekday is clicked", () => {
    const { getByTestId, queryByTestId } = render(
      <Provider store={store}>
        <DatePicker />
      </Provider>
    );

    // It should not render
    expect(queryByTestId("calendar-container")).not.toBeInTheDocument();
    // Click the weekday
    fireEvent.click(getByTestId("weekday"));
    // It should now render
    expect(getByTestId("calendar-container")).toBeInTheDocument();
  });

  test("DatePicker renders correct date", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <DatePicker />
      </Provider>
    );

    // On initial render, the date should be today's date
    // Get the weekday
    const weekday = getByTestId("weekday");
    // The weekday should be the same as today's weekday
    expect(weekday).toHaveTextContent(weekdays[currentDate.getDay()]);

    // Get the full date
    const fullDate = getByTestId("full-date");
    // The full date should be the same as today's date in the format "DD. MONTH YYYY"
    expect(fullDate).toHaveTextContent(
      `${currentDate.getDate()}. ${
        months[currentDate.getMonth()]
      } ${currentDate.getFullYear()}`
    );
  });

  test("Forward and backward arrows working as expected", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <DatePicker />
      </Provider>
    );

    const forwardArrow = getByTestId("forward-arrow");
    const backwardArrow = getByTestId("backward-arrow");
    const weekday = getByTestId("weekday");

    fireEvent.click(forwardArrow);
    // The date should not change, since the forward arrow is disabled
    expect(weekday).toHaveTextContent(weekdays[currentDate.getDay()]);

    fireEvent.click(backwardArrow);
    // The date should change, since the backward arrow is enabled
    expect(weekday).toHaveTextContent(
      weekdays[currentDate.getDay() - 1 < 0 ? 6 : currentDate.getDay() - 1]
    );

    fireEvent.click(forwardArrow);
    // The date should change, since the backward arrow is enabled
    expect(weekday).toHaveTextContent(weekdays[currentDate.getDay()]);
  });
});
