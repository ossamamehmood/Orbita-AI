import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const OrbitaLogo = ({ className, isStatic = false }: { className?: string; isStatic?: boolean }) => (
  <div className={cn("relative flex items-center justify-center rounded-full overflow-hidden", className)}>
    {/* Rotating Gradient Background */}
    <motion.div 
      className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,#02FEDC,#5A5CFF,#F502FD,#02FEDC)]" 
      animate={isStatic ? {} : { rotate: 360 }}
      transition={isStatic ? {} : { duration: 4, repeat: Infinity, ease: "linear" }}
    />
    
    {/* Inner Mask/Hollow Center */}
    <div className="absolute inset-[16%] rounded-full bg-[#0a0a0b] z-10 shadow-inner" />
    
    {/* Core Dot */}
    <div className="relative z-20 w-full h-full flex items-center justify-center">
       <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,1)] animate-pulse" />
    </div>
  </div>
);
