import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

export const apolloClient = new ApolloClient({
  // sends userId from local storage along with every request
  link: setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: localStorage.getItem("userId")
      }
    };
  }).concat(
    createHttpLink({ uri: "http://it2810-50.idi.ntnu.no:3000/graphql" })
  ),

  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Cache policies used for loading more food search results.
          foodInfosFulltextFoodSearch: {
            // Only differences in these arguments
            // are to cause a new value to be stored.
            keyArgs: ["phrase", "sort", "where"],
            // If, instead, offset changes with fetchMore, merge
            // existing foods with the incoming foods.
            // This implementation assumes incoming foods are always
            // appended to the end. useSearchResults always does this.
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            }
          }
        }
      }
    }
  })
});
