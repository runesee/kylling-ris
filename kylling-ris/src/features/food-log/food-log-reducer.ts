import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface FoodLogState {
  selectedDate: string; // today's date selected by default
}

const dateToday = () => new Date().toISOString().split("T")[0];

const initialState: FoodLogState = {
  selectedDate: dateToday()
};

const logSlice = createSlice({
  name: "foodLog",
  initialState,
  reducers: {
    selectDate: (state, action: PayloadAction<{ date: string }>) => {
      const { date } = action.payload;
      return {
        ...state,
        selectedDate: date
      };
    }
  }
});

export const { selectDate } = logSlice.actions;
export default logSlice.reducer;
