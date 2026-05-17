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

function AppContent() {
  const { userProfile, loading } = useTaskContext();

  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl futuristic-gradient animate-spin shadow-2xl shadow-primary/20" />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen relative overflow-hidden">
      {userProfile.isFirstTime && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black flex items-center justify-center">
          <div className="relative w-[1080px] h-[1080px]">
            <Orb
              hue={324}
              hoverIntensity={0.2}
              rotateOnHover
              forceHoverState={false}
              backgroundColor="#000000"
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
      <Toaster theme="dark" richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

