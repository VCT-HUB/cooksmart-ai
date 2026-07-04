import { useState } from "react";
import { MealPlan, UserPreferences } from "../types";
import { 
  Clock, 
  Award, 
  Heart, 
  Lightbulb, 
  ShoppingBag, 
  IndianRupee, 
  ArrowRightLeft, 
  ArrowLeft, 
  Check, 
  Info, 
  Coffee, 
  Utensils, 
  ChefHat, 
  Sparkles, 
  Printer, 
  Share2,
  ListTodo
} from "lucide-react";
import { motion } from "motion/react";

interface MealPlanDisplayProps {
  plan: MealPlan;
  preferences: UserPreferences;
  onBack: () => void;
}

export default function MealPlanDisplay({ plan, preferences, onBack }: MealPlanDisplayProps) {
  const [activeMeal, setActiveMeal] = useState<"breakfast" | "lunch" | "dinner">("breakfast");
  const [groceryItems, setGroceryItems] = useState(
    plan.groceryList.map(item => ({ ...item, checked: false }))
  );
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({});

  const toggleGrocery = (id: string) => {
    setGroceryItems(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const toggleStep = (mealKey: string, index: number) => {
    const key = `${mealKey}_${index}`;
    setCompletedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const checkedCount = groceryItems.filter(item => item.checked).length;
  const totalCount = groceryItems.length;
  const completionPercentage = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  const currentMeal = plan[activeMeal];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100 print:hidden">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 font-medium transition cursor-pointer group mb-2"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Preferences
          </button>
          <h1 className="font-display text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            Chef {preferences.name}'s Meal Plan
            <Sparkles className="w-6 h-6 text-emerald-500 animate-bounce" />
          </h1>
          <p className="text-gray-500 text-sm">
            Curated on {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Guide
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard! You can share your meal plan now.");
            }}
            className="flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold px-4 py-2.5 rounded-xl text-sm transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            Share Plan
          </button>
        </div>
      </div>

      {/* Hero Bento Grid Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Estimated Cooking Time */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Active Time</span>
            <h4 className="font-mono text-2xl font-bold text-gray-800 mt-0.5">
              {plan.overallMetrics.totalTimeMinutes} <span className="text-sm font-sans font-medium text-gray-500">mins</span>
            </h4>
            <p className="text-xs text-gray-500 mt-1">Breakfast, Lunch, & Dinner preps</p>
          </div>
        </div>

        {/* Cooking Skill Difficulty */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Skill Difficulty</span>
            <h4 className="font-display text-xl font-bold text-gray-800 mt-1 capitalize">
              {plan.overallMetrics.difficulty}
            </h4>
            <p className="text-xs text-gray-500 mt-1">Matched to your expert profile</p>
          </div>
        </div>

        {/* Nutrition Score */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition">
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
            <Heart className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Nutrition Grade</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h4 className="font-mono text-2xl font-bold text-rose-700">
                {plan.overallMetrics.nutritionScore}/100
              </h4>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">A+ Diet</span>
            </div>
            <div className="grid grid-cols-4 gap-1 mt-2 text-[10px] font-mono font-medium text-gray-500 bg-gray-50 p-1 rounded-md">
              <div className="text-center border-r border-gray-200">
                <span className="text-gray-400 block text-[8px] uppercase">Cal</span>
                <span>{plan.overallMetrics.nutritionMetrics.calories}</span>
              </div>
              <div className="text-center border-r border-gray-200">
                <span className="text-gray-400 block text-[8px] uppercase">Prot</span>
                <span>{plan.overallMetrics.nutritionMetrics.protein}</span>
              </div>
              <div className="text-center border-r border-gray-200">
                <span className="text-gray-400 block text-[8px] uppercase">Carb</span>
                <span>{plan.overallMetrics.nutritionMetrics.carbs}</span>
              </div>
              <div className="text-center">
                <span className="text-gray-400 block text-[8px] uppercase">Fat</span>
                <span>{plan.overallMetrics.nutritionMetrics.fats}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leftover Suggestion Panel */}
        <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/40 p-5 rounded-2xl border border-amber-100/70 shadow-sm flex items-start gap-4 hover:shadow-md transition sm:col-span-2 lg:col-span-1">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-amber-800 font-semibold uppercase tracking-wider">Leftover Smart Use</span>
            <p className="text-xs text-amber-900 mt-1 leading-relaxed">
              {plan.overallMetrics.leftoverReuseSuggestion}
            </p>
          </div>
        </div>
      </div>

      {/* Budget Indicator Panel */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-lg flex flex-col md:flex-row items-center gap-6 sm:gap-8">
        <div className="flex items-center gap-4 bg-emerald-50/50 px-6 py-5 rounded-2xl border border-emerald-100/50 w-full md:w-auto min-w-[220px] justify-center md:justify-start">
          <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-200">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block uppercase font-bold tracking-wider">Estimated Groceries</span>
            <span className="font-mono text-3xl font-black text-emerald-800">
              ₹{plan.budgetEstimation.totalEstimatedCost.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-3 w-full">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-700">Daily Budget Performance</span>
            <span className={`font-mono font-bold px-2.5 py-0.5 rounded-full text-xs ${
              plan.budgetEstimation.fitsInBudget 
                ? "bg-green-100 text-green-800" 
                : "bg-rose-100 text-rose-800"
            }`}>
              {plan.budgetEstimation.fitsInBudget ? "Fits Budget perfectly" : "Slightly Exceeds Target"}
            </span>
          </div>

          {/* Budget Gauge bar */}
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden relative border border-gray-150/40">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                plan.budgetEstimation.fitsInBudget ? "bg-emerald-500" : "bg-rose-500"
              }`}
              style={{ width: `${Math.min((plan.budgetEstimation.totalEstimatedCost / preferences.dailyBudget) * 100, 100)}%` }}
            />
            {/* Marker for budget */}
            <div className="absolute top-0 right-0 h-full border-r-2 border-dashed border-gray-400" />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Spent: ₹{plan.budgetEstimation.totalEstimatedCost.toFixed(0)}</span>
            <span>Target Budget Limit: ₹{preferences.dailyBudget.toFixed(0)}</span>
          </div>

          <div className="text-sm bg-gray-50 p-3.5 rounded-xl border border-gray-100 flex items-start gap-2 text-gray-600 leading-relaxed">
            <Info className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <p>
              {plan.budgetEstimation.explanation}{" "}
              <span className="font-semibold text-emerald-700">
                {plan.budgetEstimation.savingsOrOverdraft > 0 
                  ? `(You saved ₹${Math.abs(plan.budgetEstimation.savingsOrOverdraft).toFixed(2)}!)`
                  : `(Exceeds target by ₹${Math.abs(plan.budgetEstimation.savingsOrOverdraft).toFixed(2)})`}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Meals & Shopping Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Meal Instructions (8cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden">
            {/* Meal Selector Tabs */}
            <div className="grid grid-cols-3 border-b border-gray-100 bg-gray-50/50 print:hidden">
              <button
                onClick={() => setActiveMeal("breakfast")}
                className={`py-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm font-semibold transition cursor-pointer ${
                  activeMeal === "breakfast" 
                    ? "bg-white border-b-2 border-emerald-500 text-emerald-800" 
                    : "text-gray-500 hover:text-emerald-700"
                }`}
              >
                <Coffee className="w-4 h-4" />
                Breakfast
              </button>
              <button
                onClick={() => setActiveMeal("lunch")}
                className={`py-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm font-semibold transition cursor-pointer ${
                  activeMeal === "lunch" 
                    ? "bg-white border-b-2 border-emerald-500 text-emerald-800" 
                    : "text-gray-500 hover:text-emerald-700"
                }`}
              >
                <Utensils className="w-4 h-4" />
                Lunch
              </button>
              <button
                onClick={() => setActiveMeal("dinner")}
                className={`py-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm font-semibold transition cursor-pointer ${
                  activeMeal === "dinner" 
                    ? "bg-white border-b-2 border-emerald-500 text-emerald-800" 
                    : "text-gray-500 hover:text-emerald-700"
                }`}
              >
                <ChefHat className="w-4 h-4" />
                Dinner
              </button>
            </div>

            {/* Print View: Show all meals at once */}
            <div className="hidden print:block p-4 space-y-8">
              {(["breakfast", "lunch", "dinner"] as const).map((mKey) => {
                const meal = plan[mKey];
                return (
                  <div key={mKey} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <h3 className="font-display text-xl font-bold text-gray-800 capitalize flex items-center gap-2 mb-2">
                      <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full uppercase font-semibold">
                        {mKey}
                      </span>
                      {meal.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 italic">{meal.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-1">Ingredients:</h4>
                        <ul className="list-disc pl-4 space-y-1">
                          {meal.ingredients.map((ing, i) => (
                            <li key={i}>{ing}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-1">Preparation Steps:</h4>
                        <ol className="list-decimal pl-4 space-y-1">
                          {meal.steps.map((st, i) => (
                            <li key={i}>{st}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Meal Details Card */}
            <div className="p-6 sm:p-8 space-y-6 print:hidden">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    {activeMeal} Recipes
                  </span>
                  <h3 className="font-display text-2xl font-black text-gray-800 mt-2 tracking-tight">
                    {currentMeal.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3.5 py-1.5 rounded-xl border border-gray-100 text-xs font-semibold text-gray-600 self-start sm:self-auto">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>{currentMeal.cookingTime} Min Cooking Time</span>
                </div>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed italic border-l-4 border-emerald-500 pl-4 bg-gray-50/50 py-2 rounded-r-xl">
                {currentMeal.description}
              </p>

              {/* Ingredients & Steps split */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
                {/* Scaled Ingredients */}
                <div className="md:col-span-5 space-y-4">
                  <h4 className="font-semibold text-gray-800 text-base flex items-center gap-2 border-b border-gray-100 pb-2">
                    <span className="bg-emerald-100 text-emerald-800 w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-mono font-bold">
                      🛒
                    </span>
                    Ingredients (For {preferences.numberOfPeople} {preferences.numberOfPeople === 1 ? "person" : "people"})
                  </h4>
                  <ul className="space-y-2.5">
                    {currentMeal.ingredients.map((ingredient, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2.5 bg-gray-50/30 p-2 rounded-lg hover:bg-gray-50 transition">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0" />
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cook-along Preparation Guide */}
                <div className="md:col-span-7 space-y-4">
                  <h4 className="font-semibold text-gray-800 text-base flex items-center gap-2 border-b border-gray-100 pb-2">
                    <span className="bg-emerald-100 text-emerald-800 w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-mono font-bold">
                      🔥
                    </span>
                    Step-by-Step Cooking Guide
                  </h4>
                  <div className="space-y-3">
                    {currentMeal.steps.map((step, idx) => {
                      const isDone = completedSteps[`${activeMeal}_${idx}`];
                      return (
                        <div 
                          key={idx} 
                          onClick={() => toggleStep(activeMeal, idx)}
                          className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                            isDone 
                              ? "bg-emerald-50/30 border-emerald-200 text-gray-400" 
                              : "bg-white border-gray-100 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <button
                            type="button"
                            className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition shrink-0 ${
                              isDone 
                                ? "bg-emerald-500 border-emerald-500 text-white" 
                                : "border-gray-300 bg-white group-hover:border-emerald-500"
                            }`}
                          >
                            {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>
                          <div>
                            <span className={`text-[11px] uppercase tracking-wider font-mono font-bold block mb-0.5 ${isDone ? "text-emerald-500" : "text-gray-400"}`}>
                              Step {idx + 1}
                            </span>
                            <p className={`text-sm leading-relaxed ${isDone ? "line-through text-gray-400" : "text-gray-700"}`}>
                              {step}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Substitutions Panel */}
          {plan.substitutions && plan.substitutions.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-md space-y-4">
              <h3 className="font-display text-xl font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
                <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
                Diet & Allergy Substitutions
              </h3>
              <p className="text-xs text-gray-500">
                Are you missing an ingredient, cooking for allergies, or looking to lower shopping costs? Try these:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {plan.substitutions.map((sub, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/60 flex items-start gap-3 hover:bg-indigo-50/60 transition">
                    <div className="text-xl">🔄</div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        Replace <span className="text-indigo-700 font-mono text-xs">{sub.original}</span>
                      </div>
                      <div className="text-sm font-bold text-emerald-800 mt-1">
                        With <span className="bg-emerald-100 px-1.5 py-0.5 rounded text-xs">{sub.substitute}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        {sub.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Grocery Checklist (4cols / 5cols) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden">
            {/* Shopping List Card Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-white" />
                  <h3 className="font-display text-lg font-bold">Grocery Checklist</h3>
                </div>
                <span className="text-[11px] font-mono font-bold bg-white/20 text-white px-2.5 py-1 rounded-full uppercase">
                  {preferences.numberOfPeople} {preferences.numberOfPeople === 1 ? "Prep" : "Preps"}
                </span>
              </div>

              {/* Progress metric */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Shopping Progress</span>
                  <span className="font-mono">{completionPercentage}% Completed ({checkedCount}/{totalCount})</span>
                </div>
                <div className="w-full h-1.5 bg-white/25 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* List Body */}
            <div className="p-6 space-y-6 max-h-[550px] overflow-y-auto custom-scrollbar">
              {groceryItems.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No groceries in this plan.</p>
              ) : (
                // Group items by category
                Array.from(new Set(groceryItems.map(item => item.category))).map((category) => {
                  const itemsInCat = groceryItems.filter(item => item.category === category);
                  return (
                    <div key={category} className="space-y-2.5">
                      <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-1 flex justify-between items-center">
                        <span>{category}</span>
                        <span className="font-mono text-[9px] text-gray-400">({itemsInCat.length})</span>
                      </h4>
                      <div className="space-y-1.5">
                        {itemsInCat.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => toggleGrocery(item.id)}
                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                              item.checked 
                                ? "bg-gray-50/50 border-gray-150/40 text-gray-400" 
                                : "bg-white border-gray-100 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition ${
                                  item.checked 
                                    ? "bg-emerald-500 border-emerald-500 text-white" 
                                    : "border-gray-300 bg-white"
                                }`}
                              >
                                {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                              </button>
                              <span className={`text-sm ${item.checked ? "line-through text-gray-400" : "font-medium"}`}>
                                {item.name}
                              </span>
                            </div>
                            <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                              item.checked ? "bg-gray-100 text-gray-400" : "bg-emerald-50 text-emerald-700"
                            }`}>
                              ₹{item.estimatedCost.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-xs text-gray-400 flex items-start gap-2.5 print:hidden">
            <ListTodo className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Grocery costs are estimated averages from popular supermarkets. Portion sizes are auto-scaled for {preferences.numberOfPeople} people. Use the checkboxes to tick off ingredients you already have in stock or purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
