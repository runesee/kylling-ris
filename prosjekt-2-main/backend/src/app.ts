import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers, typeDefs } from "./type-defs.js";
import neo4j from "neo4j-driver";
import { Neo4jGraphQL } from "@neo4j/graphql";

// Environment Varibles
// They don't have useable defaults because the server shouldn't work unless environment variables have been set.
dotenv.config();
const port = parseInt(process.env.PORT ?? "");
const neo4jUri = process.env.NEO4J_URI ?? "";
const neo4jUser = process.env.NEO4J_USER ?? "";
const neo4jPassword = process.env.NEO4J_PASSWORD ?? "";

// Neo4j database
const driver = neo4j.driver(
    neo4jUri,
    neo4j.auth.basic(neo4jUser, neo4jPassword)
);
const neoSchema = new Neo4jGraphQL({ typeDefs, resolvers, driver });

// Apollo Server
const server = new ApolloServer({
    schema: await neoSchema.getSchema()
});
const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
        return { cypherParams: { userId: Number(req.headers.authorization) } };
    },
    listen: { port: port }
});
console.log(url);
