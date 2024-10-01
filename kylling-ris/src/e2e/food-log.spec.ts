import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // await page.goto("http://localhost:5173/project2");
  await page.goto("http://it2810-50.idi.ntnu.no/project2/");
});

test("Add food to log and edit and remove it", async ({ page }) => {
  // Placeholder text should be visible since user has not added any food yet
  const placeholder = page.getByText(
    "Du har ikke loggført noe i dag. Gjør et søk og trykk på ‘+’-knappen for å registrere en matvare, og få oversikt over kalori- og proteininntaket ditt."
  );
  await expect(placeholder).toBeVisible();

  // Get the first search result, its name and its button
  const firstSearchResult = page.locator(
    `data-testid=food-search-result >> nth=0`
  );
  const firstSearchResultName = await firstSearchResult
    .locator("h1")
    .textContent();

  const firstSearchResultButton = firstSearchResult.locator(
    "data-testid=add-food-button"
  );
  await firstSearchResultButton.click();

  const weightInput = page.getByTestId("weight-input");
  expect(await weightInput.inputValue()).toEqual("100");

  const newWeight = "200";
  await weightInput.fill(newWeight);
  await page.getByRole("button", { name: "Legg til" }).click();

  // Placeholder text should not be visible anymore, and the food should be in the log
  await expect(placeholder).not.toBeVisible();
  await expect(
    page.getByRole("cell", { name: firstSearchResultName?.toString() })
  ).toBeVisible();
  await expect(page.getByRole("cell", { name: newWeight + "g" })).toBeVisible();

  // Open the edit food modal
  await page.getByTestId("edit-weight-button").click();
  await expect(page.getByText("Rediger vekt")).toBeVisible();

  const editWeight = "50";
  await page.getByTestId("weight-input").fill(editWeight);
  await page.getByTestId("submit-button").click();
  await expect(
    page.getByRole("cell", { name: editWeight + "g" })
  ).toBeVisible();

  // Delete the food
  await page.getByTestId("delete-food-button").click();
  await expect(placeholder).toBeVisible();
});
