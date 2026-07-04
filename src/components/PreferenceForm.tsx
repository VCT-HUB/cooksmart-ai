import React, { useState } from "react";
import { UserPreferences } from "../types";
import { 
  User, 
  Users, 
  IndianRupee, 
  Clock, 
  Award, 
  ShieldAlert, 
  Compass, 
  Leaf, 
  UtensilsCrossed, 
  Sparkles, 
  Plus, 
  Minus 
} from "lucide-react";

interface PreferenceFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  isSubmitting: boolean;
}

const COMMON_ALLERGIES = ["Peanuts", "Gluten", "Dairy", "Shellfish", "Soy", "Eggs", "Mustard"];
const COMMON_CUISINES = ["Indian", "South Indian", "North Indian", "Mediterranean", "Italian", "Mexican", "Japanese", "Chinese"];

export default function PreferenceForm({ onSubmit, isSubmitting }: PreferenceFormProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    name: "Aayush",
    foodPreference: "vegetarian",
    numberOfPeople: 2,
    dailyBudget: 600,
    cookingTimeAvailable: 45,
    cookingSkill: "intermediate",
    allergies: "none",
    preferredCuisine: "Indian",
  });

  const [allergyInput, setAllergyInput] = useState("peanuts");

  const handleAllergyTagClick = (allergy: string) => {
    let current = preferences.allergies.trim();
    if (!current) {
      setPreferences({ ...preferences, allergies: allergy.toLowerCase() });
    } else {
      const list = current.split(",").map(item => item.trim().toLowerCase());
      if (list.includes(allergy.toLowerCase())) {
        // Remove allergy
        const filtered = list.filter(item => item !== allergy.toLowerCase()).join(", ");
        setPreferences({ ...preferences, allergies: filtered });
      } else {
        // Add allergy
        setPreferences({ ...preferences, allergies: `${current}, ${allergy.toLowerCase()}` });
      }
    }
  };

  const handleCuisineTagClick = (cuisine: string) => {
    setPreferences({ ...preferences, preferredCuisine: cuisine });
  };

  const incrementPeople = () => {
    if (preferences.numberOfPeople < 12) {
      setPreferences({ ...preferences, numberOfPeople: preferences.numberOfPeople + 1 });
    }
  };

  const decrementPeople = () => {
    if (preferences.numberOfPeople > 1) {
      setPreferences({ ...preferences, numberOfPeople: preferences.numberOfPeople - 1 });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferences.name.trim()) return;
    onSubmit(preferences);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl shadow-xl shadow-green-100/40 border border-green-50/70">
      <div className="border-b border-gray-100 pb-6">
        <h2 className="font-display text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-emerald-600 animate-pulse" />
          Set Your Culinary Preferences
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Tell us about yourself, and our CookSmart AI will formulate a customized daily menu and grocery budget.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            Your Name
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={preferences.name}
              onChange={(e) => setPreferences({ ...preferences, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:bg-white focus:outline-none rounded-xl text-gray-700 transition"
              placeholder="e.g. Chef Alex"
            />
          </div>
        </div>

        {/* Vegetarian / Non-Vegetarian Toggle */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
            Dietary Preference
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPreferences({ ...preferences, foodPreference: "vegetarian" })}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium border text-sm transition-all duration-200 ${
                preferences.foodPreference === "vegetarian"
                  ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-md shadow-emerald-100/50"
                  : "bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Leaf className={`w-4 h-4 ${preferences.foodPreference === "vegetarian" ? "text-emerald-600" : "text-gray-400"}`} />
              Vegetarian
            </button>
            <button
              type="button"
              onClick={() => setPreferences({ ...preferences, foodPreference: "non-vegetarian" })}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium border text-sm transition-all duration-200 ${
                preferences.foodPreference === "non-vegetarian"
                  ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-md shadow-emerald-100/50"
                  : "bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <UtensilsCrossed className={`w-4 h-4 ${preferences.foodPreference === "non-vegetarian" ? "text-emerald-600" : "text-gray-400"}`} />
              Non-Veg
            </button>
          </div>
        </div>

        {/* Number of People */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            Number of People
          </label>
          <div className="flex items-center gap-4 bg-gray-50/60 p-2 rounded-xl border border-gray-200 w-fit">
            <button
              type="button"
              onClick={decrementPeople}
              className="p-2 bg-white hover:bg-gray-100 rounded-lg text-gray-600 shadow-sm transition disabled:opacity-50"
              disabled={preferences.numberOfPeople <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono text-lg font-bold text-gray-800 min-w-[32px] text-center">
              {preferences.numberOfPeople}
            </span>
            <button
              type="button"
              onClick={incrementPeople}
              className="p-2 bg-white hover:bg-gray-100 rounded-lg text-gray-600 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-500 pr-2">person/people</span>
          </div>
        </div>

        {/* Daily Food Budget */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            Daily Food Budget (₹)
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={preferences.dailyBudget}
                onChange={(e) => setPreferences({ ...preferences, dailyBudget: parseInt(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="font-mono text-lg font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg min-w-[85px] text-center">
                ₹{preferences.dailyBudget}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {[300, 600, 1200, 2000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setPreferences({ ...preferences, dailyBudget: preset })}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition ${
                    preferences.dailyBudget === preset
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  ₹{preset} Budget
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cooking Time Available */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            Cooking Time Available (Minutes)
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="15"
                max="120"
                step="5"
                value={preferences.cookingTimeAvailable}
                onChange={(e) => setPreferences({ ...preferences, cookingTimeAvailable: parseInt(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="font-mono text-lg font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg min-w-[75px] text-center">
                {preferences.cookingTimeAvailable}m
              </span>
            </div>
            <span className="text-xs text-gray-400 font-medium">
              {preferences.cookingTimeAvailable <= 25 ? "⚡ Express Quick Preps" : 
               preferences.cookingTimeAvailable <= 50 ? "🍲 Standard Cozy Meals" : 
               preferences.cookingTimeAvailable <= 85 ? "🔪 Leisurely Culinary Preps" : 
               "👑 Master Chef Slow Cooking"}
            </span>
          </div>
        </div>

        {/* Cooking Skill Card Selector */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            Cooking Skill Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(["beginner", "intermediate", "expert"] as const).map((level) => {
              const labelMap = {
                beginner: "Beginner",
                intermediate: "Intermediate",
                expert: "Expert Chef"
              };
              const descMap = {
                beginner: "Simple, clear instructions & minimal knife prep",
                intermediate: "Balanced techniques, basic seasoning & variety",
                expert: "Sophisticated timing, rich spices & deep flavors"
              };
              const iconMap = {
                beginner: "🌱",
                intermediate: "🍳",
                expert: "👨‍🍳"
              };

              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPreferences({ ...preferences, cookingSkill: level })}
                  className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-200 ${
                    preferences.cookingSkill === level
                      ? "bg-emerald-50/70 border-emerald-500 shadow-md shadow-emerald-100/50"
                      : "bg-gray-50/50 border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <span className="text-2xl mb-1">{iconMap[level]}</span>
                  <span className="font-semibold text-gray-800 text-sm">{labelMap[level]}</span>
                  <span className="text-xs text-gray-400 mt-1 leading-snug">{descMap[level]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Allergies Tag Inputs */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            Allergies (Avoid Ingredients)
          </label>
          <input
            type="text"
            value={preferences.allergies}
            onChange={(e) => setPreferences({ ...preferences, allergies: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:bg-white focus:outline-none rounded-xl text-gray-700 transition"
            placeholder="e.g. peanuts, tree nuts, gluten, dairy"
          />
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">Quick-add popular restrictions:</span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_ALLERGIES.map((allergy) => {
                const isActive = preferences.allergies.toLowerCase().includes(allergy.toLowerCase());
                return (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() => handleAllergyTagClick(allergy)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition font-medium ${
                      isActive
                        ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                        : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {isActive ? "✓ " : ""}{allergy}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Preferred Cuisine */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            Preferred Cuisine
          </label>
          <input
            type="text"
            value={preferences.preferredCuisine}
            onChange={(e) => setPreferences({ ...preferences, preferredCuisine: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:bg-white focus:outline-none rounded-xl text-gray-700 transition"
            placeholder="e.g. Mediterranean, Italian, Indian, Mexican, East Asian"
          />
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">Popular culinary palettes:</span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_CUISINES.map((cuisine) => {
                const isSelected = preferences.preferredCuisine.toLowerCase() === cuisine.toLowerCase();
                return (
                  <button
                    key={cuisine}
                    type="button"
                    onClick={() => handleCuisineTagClick(cuisine)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition font-medium ${
                      isSelected
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {cuisine}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-200 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Generate Meal Plan</span>
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </form>
  );
}
