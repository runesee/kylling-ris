export const mutationTypeDef = `#graphql
    type Mutation {
        createGuest: ID @cypher(
            statement: """
                CREATE (guest:User {name: 'Guest'})
                RETURN id(guest) AS id
            """,
            columnName: "id"
        )

        signUp(name: String!, email: String!, password: String!): ID @cypher(
            statement: """
                CREATE (user:User {
                    name: $name,
                    email: $email,
                    password: $password
                })
                RETURN id(user) AS id
            """,
            columnName: "id"
        )

        addFoodToLog(foodInfoId: ID!, weight: Float!, date: String!): FoodItem @cypher(
            statement: """
                MATCH 
                    (user:User),
                    (foodInfo:FoodInfo {id: $foodInfoId})
                WHERE (id(user) = $userId)
                CREATE (user)
                    -[:LOGGED_FOOD]->(foodItem: FoodItem {weight: $weight, date: $date})
                    -[:FOOD_ITEM_INFO]->(foodInfo)
                SET foodItem.id = id(foodItem)
                RETURN foodItem
            """,
            columnName: "foodItem"
        )

        deleteFoodFromLog(id: Float!): Float @cypher(
            statement: """
                MATCH (foodItem:FoodItem {id: $id})
                DETACH DELETE foodItem 
                RETURN $id as id
            """,
            columnName:  "id"
        )

        editFood(id: Float!, weight: Float!): FoodItem @cypher(
            statement: """
                MATCH (foodItem: FoodItem {id: $id})
                SET foodItem.weight = $weight
                RETURN foodItem
            """,
            columnName: "foodItem"
        )
    }
`;
