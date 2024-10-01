export const queryTypeDef = `#graphql
    type Query {
        user: User @cypher(
            statement: """
                MATCH (user:User)
                WHERE (id(user) = $userId)
                RETURN user
            """,
            columnName: "user"
        )

        userId(email: String!, password: String!): ID @cypher(
            statement: """
                MATCH (user: User)
                WHERE
                    user.email = $email AND
                    user.password = $password
                RETURN id(user) AS id
            """,
            columnName: "id"
        )
    }
`;
