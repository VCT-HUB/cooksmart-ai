export interface UserPreferences {
  name: string;
  foodPreference: 'vegetarian' | 'non-vegetarian';
  numberOfPeople: number;
  dailyBudget: number;
  cookingTimeAvailable: number; // in minutes
  cookingSkill: 'beginner' | 'intermediate' | 'expert';
  allergies: string;
  preferredCuisine: string;
}

export interface MealDetail {
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
  cookingTime: number; // in minutes
}

export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  estimatedCost: number;
  checked: boolean;
}

export interface Substitution {
  original: string;
  substitute: string;
  reason: string;
}

export interface BudgetEstimation {
  totalEstimatedCost: number;
  fitsInBudget: boolean;
  savingsOrOverdraft: number; // Positive is savings, negative is overdraft
  explanation: string;
}

export interface NutritionMetrics {
  calories: number;
  protein: string;
  carbs: string;
  fats: string;
}

export interface OverallMetrics {
  totalTimeMinutes: number;
  difficulty: string;
  nutritionScore: number; // Out of 100
  nutritionMetrics: NutritionMetrics;
  leftoverReuseSuggestion: string;
}

export interface MealPlan {
  breakfast: MealDetail;
  lunch: MealDetail;
  dinner: MealDetail;
  groceryList: GroceryItem[];
  substitutions: Substitution[];
  budgetEstimation: BudgetEstimation;
  overallMetrics: OverallMetrics;
}
