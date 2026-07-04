import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to lazy-initialize the GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it in your Secrets / Env settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// -------------------------------------------------------------
// Gemini JSON Schemas for Meal Plan
// -------------------------------------------------------------
const mealSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Elegant & tasty title of the meal" },
    description: { type: Type.STRING, description: "Mouth-watering short summary of the meal and culinary highlights" },
    ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of ingredients with precise quantities" },
    steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Clear step-by-step instructions for cooking" },
    cookingTime: { type: Type.INTEGER, description: "Estimated cooking time in minutes" }
  },
  required: ["name", "description", "ingredients", "steps", "cookingTime"]
};

const groceryItemSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: "Unique string ID (e.g. item_1, item_2)" },
    name: { type: Type.STRING, description: "Name of the grocery item with approximate purchase quantity" },
    category: { type: Type.STRING, description: "Produce, Pantry, Dairy, Meat/Protein, Bakery, etc." },
    estimatedCost: { type: Type.NUMBER, description: "Estimated cost in INR for this item based on number of people" }
  },
  required: ["id", "name", "category", "estimatedCost"]
};

const substitutionSchema = {
  type: Type.OBJECT,
  properties: {
    original: { type: Type.STRING, description: "The original ingredient in the recipes" },
    substitute: { type: Type.STRING, description: "What can be used instead" },
    reason: { type: Type.STRING, description: "Why this works (e.g. for common allergies, dietary, or cost-saving)" }
  },
  required: ["original", "substitute", "reason"]
};

const budgetSchema = {
  type: Type.OBJECT,
  properties: {
    totalEstimatedCost: { type: Type.NUMBER, description: "Sum of all grocery items in INR" },
    fitsInBudget: { type: Type.BOOLEAN, description: "True if totalEstimatedCost <= user's daily budget, otherwise false" },
    savingsOrOverdraft: { type: Type.NUMBER, description: "Positive amount of savings, or negative amount of budget exceeded in INR" },
    explanation: { type: Type.STRING, description: "Friendly message summarizing the financial breakdown and shopping suggestions in Indian Rupees" }
  },
  required: ["totalEstimatedCost", "fitsInBudget", "savingsOrOverdraft", "explanation"]
};

const nutritionMetricsSchema = {
  type: Type.OBJECT,
  properties: {
    calories: { type: Type.INTEGER, description: "Total calories estimate for the day per person" },
    protein: { type: Type.STRING, description: "Estimated protein in grams (e.g. 75g)" },
    carbs: { type: Type.STRING, description: "Estimated carbs in grams (e.g. 210g)" },
    fats: { type: Type.STRING, description: "Estimated fat in grams (e.g. 60g)" }
  },
  required: ["calories", "protein", "carbs", "fats"]
};

const overallMetricsSchema = {
  type: Type.OBJECT,
  properties: {
    totalTimeMinutes: { type: Type.INTEGER, description: "Estimated total cooking time for breakfast, lunch, and dinner combined in minutes" },
    difficulty: { type: Type.STRING, description: "Overall difficulty level: Beginner, Intermediate, or Expert" },
    nutritionScore: { type: Type.INTEGER, description: "Nutrition score from 1 to 100 based on healthiness" },
    nutritionMetrics: nutritionMetricsSchema,
    leftoverReuseSuggestion: { type: Type.STRING, description: "Creative suggestion on how to use leftovers or excess ingredients from dinner/lunch for the next day" }
  },
  required: ["totalTimeMinutes", "difficulty", "nutritionScore", "nutritionMetrics", "leftoverReuseSuggestion"]
};

const mealPlanSchema = {
  type: Type.OBJECT,
  properties: {
    breakfast: mealSchema,
    lunch: mealSchema,
    dinner: mealSchema,
    groceryList: { type: Type.ARRAY, items: groceryItemSchema },
    substitutions: { type: Type.ARRAY, items: substitutionSchema },
    budgetEstimation: budgetSchema,
    overallMetrics: overallMetricsSchema
  },
  required: ["breakfast", "lunch", "dinner", "groceryList", "substitutions", "budgetEstimation", "overallMetrics"]
};

// -------------------------------------------------------------
// POST Route to Generate Meal Plan
// -------------------------------------------------------------
app.post("/api/generate", async (req, res) => {
  try {
    const {
      name,
      foodPreference,
      numberOfPeople,
      dailyBudget,
      cookingTimeAvailable,
      cookingSkill,
      allergies,
      preferredCuisine
    } = req.body;

    // Validate request inputs
    if (!name || !foodPreference || !numberOfPeople || !dailyBudget || !cookingSkill) {
      return res.status(400).json({
        error: "Missing required preferences fields to generate meal plan."
      });
    }

    const ai = getAI();

    const systemInstruction = `You are CookSmart AI, an elite culinary master and meal planning strategist.
Your task is to generate a highly customized, delicious, and realistic 1-day meal plan (Breakfast, Lunch, Dinner) based on the user's specific culinary parameters:
- Name of User: ${name}
- Dietary Preference: ${foodPreference} (strictly respect vegetarian or non-vegetarian!)
- Number of People: ${numberOfPeople} (scale the grocery list quantities & estimated costs in Indian Rupees to feed this many people)
- Daily Food Budget: ₹${dailyBudget} INR (ensure grocery list estimated prices are realistic in Indian Rupees for ${numberOfPeople} people)
- Cooking Time Available: ${cookingTimeAvailable} minutes overall (recipes should respect this or stay within reasonable bounds)
- Culinary Skill: ${cookingSkill} (Tailor difficulty and steps. If Beginner, keep steps extremely clear and simple)
- Allergies: ${allergies || "None"} (STRICTLY AVOID these ingredients in all recipes, or provide instant substitutions)
- Preferred Cuisine: ${preferredCuisine || "No preference, surprise me with Indian or global delicacies"}

Be realistic with budget estimations in Indian Rupees (INR / ₹). If the user budget is low, optimize for budget-friendly but nutritious ingredients (lentils/dal, beans, eggs, local vegetables, rice, roti/wheat). Include standard pantry staples but estimate the cost for purchasing fresh essentials.
Explain the budget estimation breakdown with constructive advice. Highlight leftover preservation and smart food reuse.`;

    const userPrompt = `Generate a comprehensive, custom-tailored 1-day meal plan (Breakfast, Lunch, and Dinner) for ${name} based on their specified criteria. Include a curated grocery list scaled for ${numberOfPeople} people with estimated costs, ingredient substitutions if needed or requested, and detailed cooking parameters. Ensure everything strictly adheres to the requested JSON response format.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: mealPlanSchema
      }
    });

    if (!response.text) {
      throw new Error("No content received from Gemini model.");
    }

    const planData = JSON.parse(response.text.trim());
    return res.json(planData);
  } catch (error: any) {
    console.error("Meal generation error:", error);
    return res.status(500).json({
      error: error.message || "An error occurred while generating your customized meal plan. Please verify your API key and input parameters."
    });
  }
});

// -------------------------------------------------------------
// Vite and Static Assets Pipeline
// -------------------------------------------------------------
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CookSmart AI server active at http://0.0.0.0:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Failed to start server:", err);
});
