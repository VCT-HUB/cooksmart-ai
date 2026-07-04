import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChefHat, Flame, Salad, Hourglass } from "lucide-react";

interface LoadingScreenProps {
  name: string;
}

const COOKING_STEPS = [
  { text: "Warming up the virtual skillets...", icon: Flame, color: "text-amber-500" },
  { text: "Harvesting fresh seasonal produce...", icon: Salad, color: "text-emerald-500" },
  { text: "Balancing ingredients with your food budget...", icon: Hourglass, color: "text-blue-500" },
  { text: "Garnishing with premium culinary secrets...", icon: ChefHat, color: "text-green-600" },
];

export default function LoadingScreen({ name }: LoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % COOKING_STEPS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const StepIcon = COOKING_STEPS[currentStep].icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center bg-gray-50/50 rounded-3xl border border-gray-100/80 mt-6">
      <div className="relative flex items-center justify-center mb-8">
        {/* Animated outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="absolute w-28 h-28 rounded-full border-4 border-dashed border-emerald-500/30"
        />
        
        {/* Rotating mid ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          className="absolute w-24 h-24 rounded-full border border-dashed border-emerald-600/40"
        />

        {/* Pulse Background */}
        <motion.div
          animate={{ scale: [0.95, 1.1, 0.95] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200"
        />

        {/* Dynamic Icon */}
        <div className="absolute flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
              transition={{ duration: 0.4 }}
              className={COOKING_STEPS[currentStep].color}
            >
              <StepIcon className="w-8 h-8" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <h3 className="font-display text-2xl font-semibold text-gray-800 tracking-tight">
        CookSmart AI is crafting your plan, {name || "Chef"}!
      </h3>
      
      <p className="text-gray-500 text-sm max-w-md mt-2 leading-relaxed">
        Our digital master chef is scaling portions, validating ingredient safety, and optimizing expenses.
      </p>

      {/* Progress Line */}
      <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-8">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
          className="h-full bg-emerald-600 rounded-full"
        />
      </div>

      {/* Text Steps Carousel */}
      <div className="h-8 mt-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-emerald-700 font-medium text-sm flex items-center justify-center gap-2"
          >
            <span>{COOKING_STEPS[currentStep].text}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
