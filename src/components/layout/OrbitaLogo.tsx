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
    <div className="absolute inset-[16%] rounded-full bg-background z-10 shadow-inner" />
  </div>
);
