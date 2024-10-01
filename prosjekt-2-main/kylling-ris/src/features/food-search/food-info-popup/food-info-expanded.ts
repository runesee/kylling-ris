export default interface FoodInfoExpanded {
  id: string;
  name: string;
  image: string;
  brand: string | null;
  ingredients: string | null;
  defaultWeight: number;
  weightUnit: string;
  allergens: string[];
  // per 100units
  relativeCalories: number;
  relativeProtein: number;
  relativeCarbs: number;
  relativeFiber: number;
  relativeFat: number;
  relativeSaturatedFat: number;
  relativeSalt: number;
  relativeSugars: number;
}
