/* Creating, updating and deleting foods has been disabled.
   If you want to temporarily mutate foods, see docs:
   https://neo4j.com/docs/graphql/4/schema-configuration/type-configuration/
*/
export const foodInfoTypeDef = `#graphql
    type FoodInfo
    @fulltext(
        indexes: [{ indexName: "foodSearch", fields: ["name", "brand"] }]
    )
    @query(read: true, aggregate: false)
    @mutation(operations: [])
    {
        id: ID!
        ean: String!
        name: String!
        image: String!
        brand: String
        defaultWeight: Float!
        ingredients: String
        weightUnit: String!
        allergens: [String!]!
        relativeCalories: Float!
        relativeProtein: Float!
        relativeCarbs: Float!
        relativeFat: Float!
        relativeFiber: Float!
        relativeSaturatedFat: Float!
        relativeSalt: Float!
        relativeSugars: Float!
    }
`;
