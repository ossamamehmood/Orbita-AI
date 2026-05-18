/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Dashboard from "@/components/pages/Dashboard";
import { Toaster } from "@/components/ui/sonner";
import { TaskProvider, useTaskContext } from "@/context/TaskContext";
import Onboarding from "@/components/layout/Onboarding";
import { AnimatePresence, motion } from "motion/react";
import Orb from "@/components/Orb";

import { ThemeProvider, useTheme } from "@/lib/ThemeContext";

function AppContent() {
  const { userProfile, loading } = useTaskContext();
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl futuristic-gradient animate-spin shadow-2xl shadow-primary/20" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen relative overflow-hidden transition-colors duration-500">
      {/* Global SVG Definitions placed at top for reliable reference */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <linearGradient id="futuristic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#02FEDC" />
            <stop offset="50%" stopColor="#5A5CFF" />
            <stop offset="100%" stopColor="#F502FD" />
          </linearGradient>
        </defs>
      </svg>
      
      {userProfile.isFirstTime && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-background flex items-center justify-center">
          <div className="relative w-[1080px] h-[1080px]">
            <Orb
              hue={theme === 'dark' ? 324 : 311}
              hoverIntensity={theme === 'dark' ? 0.2 : 0.22}
              rotateOnHover={theme === 'dark' ? true : false}
              forceHoverState={false}
              backgroundColor={theme === 'dark' ? "#000000" : "#ffffff"}
            />
          </div>
        </div>
      )}
      <AnimatePresence mode="wait">
        {userProfile.isFirstTime ? (
          <Onboarding key="onboarding" />
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <Dashboard />
          </motion.div>
        )}
      </AnimatePresence>
      
      <Toaster theme={theme} richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </ThemeProvider>
  );
}


