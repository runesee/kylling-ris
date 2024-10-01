import { gql, useMutation, useQuery } from "@apollo/client";
import FoodItem from "./food-item";

export function useFoodLog(date: string): {
  foodLog: FoodItem[];
  loading: boolean;
} {
  const { data, loading } = useQuery(
    gql`
      query FoodLog($where: FoodItemWhere, $options: FoodItemOptions) {
        user {
          foodLog(where: $where, options: $options) {
            id
            weight
            protein
            calories
            food {
              name
              weightUnit
            }
          }
        }
      }
    `,
    {
      variables: {
        where: {
          date
        },
        //Orders by when the food was added.
        options: {
          sort: [
            {
              id: "ASC"
            }
          ]
        }
      }
    }
  );

  return {
    foodLog:
      //Convert to a nicer object (FoodItem[]).
      data?.user?.foodLog?.map(
        (foodItem: {
          id: number;
          weight: number;
          protein: number;
          calories: number;
          food: {
            name: string;
            weightUnit: string;
          };
        }): FoodItem => ({
          ...foodItem,
          ...foodItem.food
        })
      ) ?? [],
    loading
  };
}

export function useAddFoodToLog(): (
  foodInfoId: string,
  weight: number,
  date: string
) => void {
  const [addFoodToLog] = useMutation(
    gql`
      mutation AddFoodToLog($weight: Float!, $date: String!, $foodInfoId: ID!) {
        addFoodToLog(weight: $weight, date: $date, foodInfoId: $foodInfoId) {
          id
        }
      }
    `,
    { refetchQueries: ["FoodLog"] }
  );

  return (foodInfoId, weight, date) => {
    addFoodToLog({ variables: { weight, date, foodInfoId } });
  };
}

export function useDeleteFoodFromLog(): (foodItemId: number) => void {
  const [deleteFoodFromLog] = useMutation(
    gql`
      mutation DeleteFoodFromLog($foodItemId: Float!) {
        deleteFoodFromLog(id: $foodItemId)
      }
    `,
    { refetchQueries: ["FoodLog"] }
  );

  return (foodItemId) => {
    deleteFoodFromLog({
      variables: {
        foodItemId
      }
    });
  };
}

export const EDIT_FOOD_MUTATION = gql`
  mutation EditFood($foodItemId: Float!, $weight: Float!) {
    editFood(id: $foodItemId, weight: $weight) {
      id
      weight
    }
  }
`;

export function useEditFood(): (foodItemId: number, weight: number) => void {
  const [editFood] = useMutation(EDIT_FOOD_MUTATION, {
    refetchQueries: ["FoodLog"]
  });

  return (foodItemId, weight) => {
    editFood({ variables: { foodItemId, weight } });
  };
}
