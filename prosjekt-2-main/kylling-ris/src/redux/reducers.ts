import { combineReducers } from "redux";
import foodLogReducer from "../features/food-log/food-log-reducer";
import searchOptionReducer from "../features/food-search/search-options/search-option-reducer";
import searchReducer from "../features/food-search/searchReducer";

const rootReducer = combineReducers({
  foodLog: foodLogReducer,
  searchOption: searchOptionReducer,
  searchInput: searchReducer
});

export default rootReducer;
