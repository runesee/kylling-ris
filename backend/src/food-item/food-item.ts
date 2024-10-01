export const foodItemTypeDef = `#graphql
    type FoodItem
    @query(read: true, aggregate: false)
    @mutation(operations: [])
    {
        id: Float!
        date: String!
        weight: Float!
        calories: Float! @customResolver(requires: "weight food { relativeCalories }")
        protein: Float! @customResolver(requires: "weight food { relativeProtein }")
        food: FoodInfo! @relationship(type: "FOOD_ITEM_INFO", direction: OUT)
    }
`;

export const foodItemResolvers = {
    FoodItem: {
        //relative to absolute weight conversion
        calories({
            weight,
            food: { relativeCalories }
        }: {
            weight: number;
            food: { relativeCalories: number };
        }) {
            return (weight * relativeCalories) / 100;
        },
        protein({
            weight,
            food: { relativeProtein }
        }: {
            weight: number;
            food: { relativeProtein: number };
        }) {
            return (weight * relativeProtein) / 100;
        }
    }
};
