import { useState } from "react";
import PreferenceForm from "./components/PreferenceForm";
import LoadingScreen from "./components/LoadingScreen";
import MealPlanDisplay from "./components/MealPlanDisplay";
import { MealPlan, UserPreferences } from "./types";
import { ChefHat, AlertCircle, Info, RefreshCw, Key } from "lucide-react";

export default function App() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async (prefs: UserPreferences) => {
    setPreferences(prefs);
    setLoading(true);
    setError(null);
    setMealPlan(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prefs),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An unexpected error occurred during generation.");
      }

      setMealPlan(data);
    } catch (err: any) {
      console.error("Failed to generate plan:", err);
      setError(
        err.message || 
        "Failed to reach the planning server. Please check your network connection and verify your environment setup."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMealPlan(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      {/* Top Banner App Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/80 px-4 sm:px-8 py-4 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-md shadow-emerald-200">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-tight text-gray-900 flex items-center gap-1">
                CookSmart <span className="text-emerald-600 font-medium">AI</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono font-bold tracking-wider uppercase block">
                Intelligent Kitchen Planner
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>AI Model Live</span>
          </div>
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-800 p-6 rounded-3xl mb-8 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-lg text-rose-950">Initialization and Secret Key Missing</h4>
                <p className="text-sm text-rose-800 mt-1 leading-relaxed">
                  {error}
                </p>
              </div>
            </div>

            {/* If the error is likely due to key issues, show a beautiful helpful instructional card */}
            {(error.toLowerCase().includes("key") || error.toLowerCase().includes("secret") || error.toLowerCase().includes("api")) && (
              <div className="bg-white/80 p-5 rounded-2xl border border-rose-200/50 text-gray-700 text-xs sm:text-sm space-y-3 shadow-inner">
                <span className="font-semibold text-rose-900 block flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <Key className="w-3.5 h-3.5" /> Setup Instructions for Hackathon Demo:
                </span>
                <p className="leading-relaxed">
                  To allow the CookSmart AI backend to query Gemini 3.5 models safely, you need to configure your **GEMINI_API_KEY**.
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 text-xs text-gray-600">
                  <li>Navigate to the **Secrets panel** or **Settings &gt; Secrets** in the top-right menu of your AI Studio environment.</li>
                  <li>Click **"Add Secret"** or locate `GEMINI_API_KEY`.</li>
                  <li>Insert your Google Gemini API Key and confirm to automatically bind it.</li>
                  <li>Then, reload the meal planner to start creating delicious recipes!</li>
                </ol>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleReset}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm px-5 py-2 rounded-xl transition cursor-pointer flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Dismiss & Retry
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Route Transitions based on state */}
        {!preferences && !loading && !mealPlan && (
          <div className="space-y-8">
            {/* Visual Intro banner */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Your Personal <span className="text-emerald-600 underline decoration-emerald-200 underline-offset-4">AI Chef</span> for Tasty, Budget-friendly Dinners
              </h1>
              <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
                Generate high-fidelity daily recipes, a fully priced grocery checklist, and intelligent ingredient substitutions scaled precisely for your budget and lifestyle constraints.
              </p>
            </div>

            <PreferenceForm onSubmit={handleGeneratePlan} isSubmitting={loading} />
          </div>
        )}

        {loading && preferences && (
          <LoadingScreen name={preferences.name} />
        )}

        {mealPlan && preferences && !loading && (
          <MealPlanDisplay 
            plan={mealPlan} 
            preferences={preferences} 
            onBack={handleReset} 
          />
        )}
      </main>

      {/* Footer Branding Area */}
      <footer className="bg-white border-t border-gray-100 py-8 px-4 text-center text-xs text-gray-400 font-medium tracking-wide mt-12 print:hidden">
        <div className="max-w-7xl mx-auto space-y-2">
          <p>© 2026 CookSmart AI. Created utilizing Google DeepMind's Gemini Models.</p>
          <p className="flex items-center justify-center gap-2 text-gray-300">
            <span>Clean Code Architecture</span>
            <span>•</span>
            <span>Material Design Principles</span>
            <span>•</span>
            <span>Priced Groceries</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
