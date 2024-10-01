import { test, expect } from "@playwright/test";
import {
  searchInactivityTime,
  searchResultsPerLoad
} from "../features/food-search/search-results/config";

test.beforeEach(async ({ page }) => {
  // await page.goto("http://localhost:5173/project2");
  await page.goto("http://it2810-50.idi.ntnu.no/project2/");
});

test("Basic search functionality", async ({ page }) => {
  // Find and interact with the search bar using data-testid
  const searchBar = page.getByTestId("search-bar");
  const searchResults = page.getByTestId("food-search-result");

  // Testing both empty search results and updating after inactivity
  await searchBar.fill("srntdeaisrntdeiasrntdeai");
  // Immediately, search results shouldn't change
  await expect(searchResults).toHaveCount(0);
  await searchBar.clear();

  await searchBar.fill("Kyllingfilet Naturell");
  // Wait for inactivity period and check results again
  await page.waitForTimeout(searchInactivityTime);
  // Wait for the specific element with the expected text content to appear in the DOM
  await page.waitForSelector(
    `data-testid=food-search-result >> nth=0 >> text="Kyllingfilet Naturell"`
  );
  const firstFoodNameInSearch = await page
    .locator(`data-testid=food-search-result >> nth=0`)
    .evaluate((node) => node.firstChild?.firstChild?.textContent);
  expect(firstFoodNameInSearch).toEqual("Kyllingfilet Naturell");
  await searchBar.clear();
});

test("Sorting functionality", async ({ page }) => {
  const searchResults = page.getByTestId("food-search-result");

  // Get the results and check their sorting (should be sorted by name (a-å) by default)
  await expect(searchResults).toHaveCount(searchResultsPerLoad);
  let foodNames = await searchResults.evaluateAll((nodes) =>
    nodes.map((node) => node.firstChild?.firstChild?.textContent)
  );
  expect(foodNames).toEqual([...foodNames].sort());

  // Open filter menu
  await page.getByTestId("filter-button").click();
  expect(page.getByText("Filtrer og sorter")).toBeTruthy();
  const sortDropdown = page.getByTestId("sort-dropdown");

  // Sort by name (å-a)
  await sortDropdown.selectOption({ label: "Navn å-a" });
  await page.waitForTimeout(50); // Wait a small delay for the sorting to refresh
  foodNames = await searchResults.evaluateAll((nodes) =>
    nodes.map((node) => node.firstChild?.firstChild?.textContent)
  );
  expect(foodNames).toEqual([...foodNames].sort().reverse());

  // Sort by proteins pr. 100g/ml (ascending)
  await sortDropdown.selectOption({
    label: "Proteiner pr. 100g/ml (stigende)"
  });
  await page.waitForTimeout(50);
  // Finds the first food name in the list
  let firstFoodName = await page
    .locator(`data-testid=food-search-result >> nth=0`)
    .evaluate((node) => node.firstChild?.firstChild?.textContent);
  expect(firstFoodName).toEqual("Soda Water flaske"); // This is the food with the least amount of proteins pr. 100g/ml

  // Sort by proteins pr. 100g/ml (descending)
  await sortDropdown.selectOption({
    label: "Proteiner pr. 100g/ml (synkende)"
  });
  await page.waitForTimeout(50);
  firstFoodName = await page
    .locator(`data-testid=food-search-result >> nth=0`)
    .evaluate((node) => node.firstChild?.firstChild?.textContent);
  expect(firstFoodName).toEqual("Gelatinpulver"); // This is the food with the most amount of proteins pr. 100g/ml

  // Sort by calories pr. 100g/ml (ascending)
  await sortDropdown.selectOption({ label: "Kalorier pr. 100g/ml (stigende)" });
  await page.waitForTimeout(50);
  firstFoodName = await page
    .locator(`data-testid=food-search-result >> nth=0`)
    .evaluate((node) => node.firstChild?.firstChild?.textContent);
  expect(firstFoodName).toEqual("Soda Water flaske"); // This is the food with the least amount of calories pr. 100g/ml

  // Sort by calories pr. 100g/ml (descending)
  await sortDropdown.selectOption({ label: "Kalorier pr. 100g/ml (synkende)" });
  await page.waitForTimeout(50);
  firstFoodName = await page
    .locator(`data-testid=food-search-result >> nth=0`)
    .evaluate((node) => node.firstChild?.firstChild?.textContent);
  expect(firstFoodName).toEqual("Fulfil Proteinbar Sjoko&Salt Karamell"); // This is the food with the most amount of calories pr. 100g/ml
});

test("Filtering functionality", async ({ page }) => {
  // Open filter menu
  await page.getByTestId("filter-button").click();
  const showAllergensButton = page.getByTestId("show-allergens-button");
  expect(showAllergensButton).toBeTruthy();
  expect(showAllergensButton).toContainText("Vis allergener");

  // Click the show allergens button and check that it changes text
  await showAllergensButton.click();
  expect(showAllergensButton).toContainText("Gjem allergener");

  // Check that all allergens are shown
  const allergens = page.getByTestId("allergen");
  expect(allergens).toHaveCount(12);

  // Check that all allergens are checked by default
  const areAllChecked = await allergens.evaluateAll((checkboxes) =>
    checkboxes.every((checkbox) => (checkbox as HTMLInputElement).checked)
  );
  expect(areAllChecked).toBe(true);

  // Check that the first element is "&Co Superfiber havre" by default
  const firstFoodName = await page
    .locator(`data-testid=food-search-result >> nth=0`)
    .evaluate((node) => node.firstChild?.firstChild?.textContent);
  expect(firstFoodName).toEqual("&Co Superfiber havre");

  // Uncheck gluten
  const glutenCheckbox = page.locator("#gluten");
  await glutenCheckbox.uncheck();
  expect(glutenCheckbox).not.toBeChecked();

  const searchResults = page.getByTestId("food-search-result");

  // Check that the search result no longer contains "&Co Superfiber havre"
  const foodNames = await searchResults.evaluateAll((nodes) =>
    nodes.map((node) => node.firstChild?.firstChild?.textContent)
  );
  expect(foodNames).not.toContain("&Co Superfiber havre");

  await glutenCheckbox.check();
});

test.afterEach(async ({ page }) => {
  // Your cleanup code here. For example, you can navigate to a different page:
  await page.goto("about:blank");
});
