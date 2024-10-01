import { PayloadAction, createSlice } from "@reduxjs/toolkit";

//allergens are the filtered away allergens.
export interface SearchOption {
  allergens: string[];
  sortOption: string;
}

const initialState: SearchOption = {
  allergens: JSON.parse(localStorage.getItem("allergens") ?? "[]"),
  sortOption: JSON.parse(localStorage.getItem("sort") ?? "[]")
};

const searchOptionSlice = createSlice({
  name: "searchOption",
  initialState,
  reducers: {
    setAllergens: (state, action: PayloadAction<string[]>) => {
      const allergens = action.payload;
      localStorage.setItem("allergens", JSON.stringify(allergens));
      return {
        ...state,
        allergens
      };
    },
    changeSort: (state, action: PayloadAction<string>) => {
      const sortOption = action.payload;
      localStorage.setItem("sort", JSON.stringify(sortOption));
      return {
        ...state,
        sortOption
      };
    }
  }
});

export const { setAllergens, changeSort } = searchOptionSlice.actions;

export default searchOptionSlice.reducer;
