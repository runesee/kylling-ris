import { foodInfoTypeDef } from "./food-info/food-info.js";
import { foodItemResolvers, foodItemTypeDef } from "./food-item/food-item.js";
import { mutationTypeDef } from "./mutation/mutation.js";
import { queryTypeDef } from "./query/query.js";
import { userTypeDef } from "./user/user.js";

export const typeDefs = [
    queryTypeDef,
    mutationTypeDef,
    userTypeDef,
    foodInfoTypeDef,
    foodItemTypeDef
];

export const resolvers = [foodItemResolvers];
