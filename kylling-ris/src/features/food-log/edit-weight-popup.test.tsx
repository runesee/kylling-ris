import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";
import EditWeightPopup from "./edit-weight-popup";
import { render } from "@testing-library/react";
import { EDIT_FOOD_MUTATION } from "./use-food-log";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

const mockData = {
  id: 1,
  weight: 100,
  weightUnit: "g"
};

// Define the new value for weight
const changeValue = 50;

const mocks = [
  {
    request: {
      query: EDIT_FOOD_MUTATION,
      variables: {
        foodItemId: 1,
        weight: changeValue
      }
    },
    newData: vi.fn(() => ({
      data: {
        editFood: {
          id: 1,
          weight: changeValue
        }
      }
    }))
  }
];

describe("EditWeightPopup", () => {
  test("EditWeightPopup renders correctly", () => {
    const { getByTestId } = render(
      <MockedProvider mocks={mocks}>
        <EditWeightPopup
          id={mockData.id}
          weight={mockData.weight}
          weightUnit={mockData.weightUnit}
          open={true}
          onClose={() => {}}
        />
      </MockedProvider>
    );

    // Check if all elements are in the document
    expect(getByTestId("edit-weight-popup")).toBeInTheDocument();
    expect(getByTestId("header")).toBeInTheDocument();
    expect(getByTestId("weight-input")).toBeInTheDocument();
    expect(getByTestId("weight-unit")).toBeInTheDocument();
    expect(getByTestId("submit-button")).toBeInTheDocument();
  });

  test("EditWeightPopup renders correct information from mockData", () => {
    const { getByTestId } = render(
      <MockedProvider mocks={mocks}>
        <EditWeightPopup
          id={mockData.id}
          weight={mockData.weight}
          weightUnit={mockData.weightUnit}
          open={true}
          onClose={() => {}}
        />
      </MockedProvider>
    );

    // Check if the weight input and weight unit display the correct values
    expect(getByTestId("weight-input")).toHaveValue(mockData.weight.toString());
    expect(getByTestId("weight-unit")).toHaveTextContent(mockData.weightUnit);
  });

  test("EditWeightPopup renders correct information from mockData", async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={mocks}>
        <EditWeightPopup
          id={mockData.id}
          weight={mockData.weight}
          weightUnit={mockData.weightUnit}
          open={true}
          onClose={() => {}}
        />
      </MockedProvider>
    );

    // Ensure that the mutation has not been called yet
    const editFoodMutationMock = mocks[0].newData;
    expect(editFoodMutationMock).not.toHaveBeenCalled();

    const weightInput = getByTestId("weight-input");
    const submitButton = getByTestId("submit-button");

    // Check if the weight input displays the correct color
    expect(weightInput).toHaveStyle({ color: "rgb(0, 0, 0)" });

    // Check if the weight input color changes to red if input is a negative number
    await userEvent.clear(weightInput);
    await userEvent.type(weightInput, "-1");
    await userEvent.click(submitButton);
    expect(weightInput).toHaveStyle({ color: "rgb(255, 0, 0)" });

    // Check if the weight input color changes to red if input is 0
    await userEvent.clear(weightInput);
    await userEvent.type(weightInput, "0");
    await userEvent.click(submitButton);
    expect(weightInput).toHaveStyle({ color: "rgb(255, 0, 0)" });

    // Check if the weight input is still red after changing to NaN input
    await userEvent.clear(weightInput);
    await userEvent.type(weightInput, "asdf");
    await userEvent.click(submitButton);
    expect(weightInput).toHaveStyle({ color: "rgb(255, 0, 0)" });

    // Check that weight input changes to black when inputting legal value
    await userEvent.clear(weightInput);
    await userEvent.type(weightInput, changeValue.toString());
    await userEvent.click(submitButton);
    expect(weightInput).toHaveStyle({ color: "rgb(0, 0, 0)" });

    // Check that the mutation to the database is called
    expect(editFoodMutationMock).toHaveBeenCalled();
  });
});
