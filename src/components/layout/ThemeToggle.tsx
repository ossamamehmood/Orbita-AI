import React from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/lib/ThemeContext";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
        "bg-card/5 border border-border hover:bg-card/10 shadow-sm"
      )}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.2, ease: "circOut" }}
          >
            <Moon className="w-5 h-5 svg-stroke-gradient" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.2, ease: "circOut" }}
          >
            <Sun className="w-5 h-5 svg-stroke-gradient" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Subtle indicator dot */}
      <motion.div 
        layoutId="theme-dot"
        className="absolute -top-1 -right-1 w-2 h-2 rounded-full futuristic-gradient glow-gradient"
      />
    </button>
  );
}
