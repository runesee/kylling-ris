import FoodInfo from "./food-info";
import useSearchResults from "./use-search-results";
import styles from "./search-results.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import AddFoodPopup from "../add-food-popup/add-food-popup";
import { useState } from "react";
import FoodInfoPopup from "../food-info-popup/food-info.popup";
import appropriateUnit from "../../misc/appropriate-unit";

interface SearchResultsProps {
  searchQuery: string;
}

const maxTextWidth = (chars: number, text: string): string =>
  text.substring(0, chars).trimEnd() + (chars < text.length ? "..." : "");

export default function SearchResults({ searchQuery }: SearchResultsProps) {
  const [foodInfoPopupOpen, setFoodInfoPopupOpen] = useState<boolean>(false);
  const [selectedFood, setSelectedFood] = useState<FoodInfo | null>(null);
  const searchOptions = useSelector((state: RootState) => state.searchOption);

  const { foods, hasMoreFoodItems, loadMoreFoodItems } = useSearchResults(
    searchQuery,
    searchOptions
  );

  function foodInfoClicked(food: FoodInfo) {
    setSelectedFood(food);
    setFoodInfoPopupOpen(true);
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
    food: FoodInfo
  ) {
    if (event.key === "Enter") {
      foodInfoClicked(food);
    }
  }

  return (
    <div className={styles.searchResults}>
      <InfiniteScroll
        initialScrollY={0}
        dataLength={foods.length}
        next={loadMoreFoodItems}
        loader={<p className={styles.loadingFoodItemsMessage}>Loading...</p>}
        hasMore={hasMoreFoodItems}
        className={styles.invisibleScrollbar}
        height={700}
      >
        {foods.map((food: FoodInfo) => {
          return (
            <div
              className={styles.foodItem}
              key={food.id}
              data-testid={"food-search-result"}
            >
              <div
                className={styles.foodInfo}
                onClick={() => foodInfoClicked(food)}
                onKeyDown={(event) => handleKeyDown(event, food)}
                tabIndex={0}
              >
                <h1>{maxTextWidth(40, food.name)}</h1>
                <h2>
                  {
                    //Only puts " - " between the fields that are present.
                    [
                      food.brand,
                      appropriateUnit(food.defaultWeight, food.weightUnit),
                      `Protein: ${Number(
                        (
                          (food.defaultWeight * food.relativeProtein) /
                          100
                        ).toFixed(2)
                      )}g`,
                      `${Number(
                        (
                          (food.defaultWeight * food.relativeCalories) /
                          100
                        ).toFixed(2)
                      )}kcal`
                    ]
                      .filter((text) => text !== null && text.length > 0)
                      .join(" - ")
                  }
                </h2>
              </div>
              <div className={styles.addFoodPopup}>
                <AddFoodPopup food={food} />
              </div>
            </div>
          );
        })}
        {selectedFood && (
          <FoodInfoPopup
            food={selectedFood}
            open={foodInfoPopupOpen}
            onClose={() => setFoodInfoPopupOpen(false)}
          />
        )}
      </InfiniteScroll>
    </div>
  );
}
