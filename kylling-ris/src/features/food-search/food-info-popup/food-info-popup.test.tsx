import "@testing-library/jest-dom";
import FoodInfoPopup from "./food-info.popup";
import { render, waitFor } from "@testing-library/react";
import FoodInfoExpanded from "./food-info-expanded";
import appropriateUnit from "../../misc/appropriate-unit";
import { MockedProvider } from "@apollo/client/testing";
import { GET_EXPANDED_FOOD_INFO_QUERY } from "./use-expanded-food-info";

const mockFood1: FoodInfoExpanded = {
  id: "1",
  name: "Kyllingfilet",
  brand: "First Price",
  image: "https://bilder.ngdata.no/7035620014215/kmh/large.jpg",
  ingredients:
    "Kyllingfilet 87 %, Vann 12 %, Salt, Dekstrose (Mais), Maltodekstrin (Mais), Potetfiber og Fortykningsmiddel E415",
  defaultWeight: 2000,
  weightUnit: "g",
  relativeCalories: 96,
  relativeProtein: 21,
  relativeCarbs: 0.7,
  relativeFat: 0.2,
  relativeSaturatedFat: 0.2,
  relativeFiber: 0,
  relativeSalt: 0.5,
  relativeSugars: 0.3,
  allergens: []
};

const mockFood2: FoodInfoExpanded = {
  id: "2",
  name: "Lettmelk 1,0%",
  brand: null,
  image: "https://cdcimg.coop.no/rte/RTE2/7038010000911.png",
  ingredients: null,
  defaultWeight: 750,
  weightUnit: "g",
  relativeCalories: 41,
  relativeProtein: 3.5,
  relativeCarbs: 4.5,
  relativeFat: 1.0,
  relativeSaturatedFat: 0.6,
  relativeFiber: 0,
  relativeSalt: 0.1,
  relativeSugars: 4.5,
  allergens: ["Melk", "Melk"]
};

// Mocking for Apollo queries,
// see https://www.apollographql.com/docs/react/development-testing/testing/#testing-the-loading-and-success-states
const mocks = [
  {
    request: {
      query: GET_EXPANDED_FOOD_INFO_QUERY,
      variables: {
        where: {
          id: "1"
        }
      }
    },
    result: {
      data: {
        foodInfos: [mockFood1]
      }
    }
  },
  {
    request: {
      query: GET_EXPANDED_FOOD_INFO_QUERY,
      variables: {
        where: {
          id: "2"
        }
      }
    },
    result: {
      data: {
        foodInfos: [mockFood2]
      }
    }
  }
];

const nutrients = [
  "Kalorier",
  "Protein",
  "Karbohydrater",
  "Fett",
  "Mettet fett",
  "Sukkerarter",
  "Fiber",
  "Salt"
];

function getNutrientsToValue(mockFood: FoodInfoExpanded) {
  return {
    Kalorier: `${mockFood.relativeCalories} kcal`,
    Protein: `${mockFood.relativeProtein} g`,
    Karbohydrater: `${mockFood.relativeCarbs} g`,
    Fett: `${mockFood.relativeFat} g`,
    "Mettet fett": `${mockFood.relativeSaturatedFat} g`,
    Sukkerarter: `${mockFood.relativeSugars} g`,
    Fiber: `${mockFood.relativeFiber} g`,
    Salt: `${mockFood.relativeSalt} g`
  };
}

const nutrientsToValue1 = getNutrientsToValue(mockFood1);
const nutrientsToValue2 = getNutrientsToValue(mockFood2);

describe("FoodInfoPopup", () => {
  test("FoodInfoPopup renders correctly", async () => {
    const { getByTestId, getByText } = render(
      <MockedProvider mocks={mocks}>
        <FoodInfoPopup open={true} onClose={() => {}} food={mockFood1} />
      </MockedProvider>
    );

    expect(getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(getByTestId("food-info-popup")).toBeInTheDocument();
      expect(getByTestId("header")).toBeInTheDocument();

      expect(getByTestId("food-image")).toBeInTheDocument();

      expect(getByTestId("ingredients")).toBeInTheDocument();
      expect(getByTestId("allergens")).toBeInTheDocument();
      expect(getByTestId("nutrients-table")).toBeInTheDocument();

      for (let i = 0; i < nutrients.length; i++) {
        expect(getByTestId(`nutrient-${nutrients[0]}`)).toBeInTheDocument();
      }

      expect(getByTestId("close-button")).toBeInTheDocument();
    });
  });

  test("FoodInfoPopup renders correct information from mockdata1", async () => {
    // Test with mockFood1 (has brand and ingredients, but no allergens)
    const { getByTestId, queryByTestId, getByRole } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <FoodInfoPopup open={true} onClose={() => {}} food={mockFood1} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByTestId("header")).toHaveTextContent(
        `${mockFood1.name} ${appropriateUnit(
          mockFood1.defaultWeight,
          mockFood1.weightUnit
        )} - ${mockFood1.brand}`
      );

      expect(getByRole("img")).toHaveAttribute("src", mockFood1.image);
      if (mockFood1.ingredients) {
        expect(queryByTestId("ingredients")).toHaveTextContent(
          mockFood1.ingredients
        );
      }
      expect(getByTestId("allergens")).toHaveTextContent("Ingen");

      // Terrible workaround, but TypeScript was acting up
      for (const nutrient in nutrientsToValue1) {
        expect(getByTestId(`nutrient-${nutrient}`)).toHaveTextContent(
          nutrientsToValue1[nutrient as keyof typeof nutrientsToValue1]
        );
      }
    });
  });

  test("FoodInfoPopup renders correct information from mockdata2", async () => {
    // Test with mockFood2 (has allergens, but no brand or ingredients)
    const { getByTestId, getByRole } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <FoodInfoPopup open={true} onClose={() => {}} food={mockFood2} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByTestId("header")).toHaveTextContent(
        `${mockFood2.name} ${appropriateUnit(
          mockFood2.defaultWeight,
          mockFood2.weightUnit
        )}`
      );

      expect(getByRole("img")).toHaveAttribute("src", mockFood2.image);

      expect(getByTestId("allergens")).toHaveTextContent(
        mockFood2.allergens.join(", ")
      );

      expect(getByTestId("ingredients")).toHaveTextContent("Ingen");

      for (const nutrient in nutrientsToValue2) {
        expect(getByTestId(`nutrient-${nutrient}`)).toHaveTextContent(
          nutrientsToValue2[nutrient as keyof typeof nutrientsToValue1]
        );
      }
    });
  });
});
