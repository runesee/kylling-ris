import FoodInfo from "./food-info";
import { useState, useEffect } from "react";
import { SearchOption } from "../search-options/search-option-reducer";
import { gql, useQuery } from "@apollo/client";
import { searchInactivityTime, searchResultsPerLoad } from "./config";

export default function useSearchResults(
  searchQuery: string,
  searchOptions: SearchOption
): {
  foods: FoodInfo[];
  hasMoreFoodItems: boolean;
  loadMoreFoodItems: () => Promise<void>;
} {
  const [hasMoreFoodItems, setHasMoreFoodItems] = useState<boolean>(true);

  // Avoids fetching on every single key input from the user.
  const searchQueryAfterInactivity = useUpdateOnInactivity(
    searchInactivityTime,
    searchQuery
  );

  const { data, fetchMore, refetch } = useQuery(
    gql`
      query FoodInfosFulltextFoodSearch(
        $phrase: String!
        $sort: [FoodInfoFulltextSort!]
        $where: FoodInfoFulltextWhere
        $limit: Int
        $offset: Int
      ) {
        foodInfosFulltextFoodSearch(
          phrase: $phrase
          sort: $sort
          where: $where
          limit: $limit
          offset: $offset
        ) {
          foodInfo {
            id
            name
            brand
            defaultWeight
            weightUnit
            allergens
            relativeCalories
            relativeProtein
          }
        }
      }
    `,
    {
      variables: {
        limit: searchResultsPerLoad,
        offset: 0,
        sort: [
          { score: "DESC" },
          {
            foodInfo: sortOptionQueryFormat[searchOptions.sortOption] ?? {
              name: "ASC"
            }
          },
          { foodInfo: { id: "DESC" } }
        ],
        ...allergensQueryFormat(searchOptions.allergens),
        phrase: searchQueryQueryFormat(searchQueryAfterInactivity)
      }
    }
  );

  // Refetching on updated parameters.
  useEffect(() => {
    refetch().then((response) => {
      // There can't be more foods if we don't receive all the foods we asked for.
      if (response.data === undefined) return;
      setHasMoreFoodItems(
        response.data.foodInfosFulltextFoodSearch.length >= searchResultsPerLoad
      );
    });
  }, [searchQueryAfterInactivity, searchOptions, refetch]);

  const foods: FoodInfo[] =
    data === undefined || data === null
      ? []
      : data.foodInfosFulltextFoodSearch.map(
          (data: { foodInfo: FoodInfo }) => data.foodInfo
        );

  return {
    foods,
    hasMoreFoodItems,
    loadMoreFoodItems: async () => {
      // Safety guard
      if (foods.length < searchResultsPerLoad) {
        setHasMoreFoodItems(false);
        return;
      }

      await fetchMore({
        variables: {
          offset: foods.length
        }
      }).then((response) => {
        // Determines if there are more foods to be loaded.
        const incomingFoodInfos =
          response.data === undefined
            ? []
            : response.data.foodInfosFulltextFoodSearch;
        setHasMoreFoodItems(incomingFoodInfos.length >= searchResultsPerLoad);
        return response;
      });
    }
  };
}

const sortOptionQueryFormat: {
  [sortOption: string]: {
    [field: string]: string;
  };
} = {
  "name-ascending": { name: "ASC" },
  "name-descending": { name: "DESC" },
  "protein-ascending": { relativeProtein: "ASC" },
  "protein-descending": { relativeProtein: "DESC" },
  "kcal-ascending": { relativeCalories: "ASC" },
  "kcal-descending": { relativeCalories: "DESC" }
};

const allergensQueryFormat = (allergens: string[]) => ({
  where: {
    foodInfo: {
      AND: allergens.map((allergen) => ({
        NOT: {
          allergens_INCLUDES: allergen
        }
      }))
    }
  }
});

const searchQueryQueryFormat = (searchQuery: string) =>
  // "*" matches any suffix
  // special characters from https://lucene.apache.org/core/2_9_4/queryparsersyntax.html
  searchQuery === ""
    ? "*"
    : searchQuery
        .split("")
        .filter((c) => !`[+-&|!(){}[]^"~*?:\\]`.includes(c))
        .join("") + "~";

// Only updates the returned value after the input value has not been updated for a time specified.
function useUpdateOnInactivity<T>(
  timeInactiveBeforeUpdate: number,
  value: T
): T {
  const [infrequentlyUpdatedValue, setInfrequentlyUpdatedValue] =
    useState<T>(value);
  const [updatesWaiting, setUpdatesWaiting] = useState<number>(0);

  useEffect(() => {
    setUpdatesWaiting((previous) => previous + 1);
    setTimeout(() => {
      setUpdatesWaiting((previous) => previous - 1);
    }, timeInactiveBeforeUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (updatesWaiting === 0) {
      setInfrequentlyUpdatedValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatesWaiting]);

  return infrequentlyUpdatedValue;
}
