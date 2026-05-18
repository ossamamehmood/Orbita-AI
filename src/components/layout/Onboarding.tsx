import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTaskContext } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Zap, Camera, Sparkles, ArrowRight, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrbitaLogo } from "@/components/layout/OrbitaLogo";

export default function Onboarding() {
  const { userProfile, updateProfile } = useTaskContext();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(userProfile.name);
  const [bio, setBio] = useState(userProfile.bio);
  const [photo, setPhoto] = useState(userProfile.photo);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      updateProfile({ name, bio, photo, isFirstTime: false });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-transparent overflow-hidden">
      {/* Background Effects Handled by App.tsx Orb */}

      <div className="relative w-full max-w-lg px-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(20px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-16 text-center relative"
            >
              <div className="flex flex-col items-center gap-10">
                <motion.div 
                  initial={{ rotate: -20, scale: 0.5 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.2 }}
                  className="relative group"
                >
                  <div className="absolute inset-x-[-40px] inset-y-[-40px] bg-linear-to-r from-primary/20 via-accent/20 to-secondary/20 blur-[60px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />
                  <OrbitaLogo className="w-32 h-32 relative z-10" />
                </motion.div>

                <div className="space-y-6">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-6xl md:text-8xl font-display font-black tracking-tighter"
                  >
                    <span className="text-foreground">Orbita</span>
                    <span className="text-gradient"> AI</span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-foreground/40 text-xl font-medium leading-relaxed max-w-sm mx-auto"
                  >
                    Defining the boundary of neural efficiency and digital synergy.
                  </motion.p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button 
                  onClick={handleNext}
                  className="w-full h-20 rounded-full glass-blue-glossy border-border text-foreground font-bold text-xl group shadow-2xl relative overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center gap-3">
                    Initiate Orbit
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
                  </span>
                </Button>
                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20">System Version 3.4.0</p>
              </motion.div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 100, filter: "blur(20px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -100, filter: "blur(20px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/40">
                  <Sparkles className="w-4 h-4 animate-pulse text-primary" />
                  Biometric Calibration
                </div>
                <h2 className="text-5xl font-display font-bold text-foreground tracking-tighter">Establish Identity</h2>
                <p className="text-foreground/40 text-base font-medium">Your signature in the neural network.</p>
              </div>

              <div className="space-y-10">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative group">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="w-40 h-40 rounded-[3rem] glass-glossy border-white/10 relative cursor-pointer overflow-hidden transition-all group-hover:border-white/30 shadow-2xl p-1"
                    >
                      <label className="cursor-pointer w-full h-full flex items-center justify-center bg-card-foreground/5 rounded-[2.8rem] overflow-hidden relative">
                        {photo ? (
                          <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <UserCircle className="w-16 h-16 text-foreground/5" />
                            <span className="text-[8px] font-bold text-foreground/20 uppercase tracking-widest">No Data</span>
                          </div>
                        )}
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-linear-to-br from-primary/40 to-secondary/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-2xl">
                            <Camera className="w-6 h-6 text-black" />
                          </div>
                          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Upload Photo</span>
                        </div>
                        
                        <input type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
                      </label>
                    </motion.div>
                    {photo && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-2xl border-4 border-black z-20"
                      >
                        <Sparkles className="w-5 h-5 text-black" />
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Operator Designation</label>
                      <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Required Fields</div>
                    </div>
                    <div className="relative group/input">
                      <div className="absolute -inset-0.5 bg-linear-to-r from-primary/30 to-accent/30 rounded-2xl blur opacity-0 group-focus-within/input:opacity-100 transition duration-500" />
                      <Input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter identifier..."
                        className="relative h-16 bg-black/60 border-white/5 rounded-2xl focus:border-white/20 focus:ring-0 text-white font-bold px-6 text-xl placeholder:text-white/10 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleNext}
                  disabled={!name}
                  className="w-full h-18 bg-white text-black hover:bg-white/90 rounded-2xl font-black uppercase tracking-[0.2em] text-sm group shadow-2xl disabled:opacity-30 transition-all flex items-center justify-between px-8"
                >
                  <span className="flex items-center gap-4">
                    <Zap className="w-5 h-5 fill-black" />
                    Deploy Signature
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform h-10 w-10 bg-black/5 rounded-full flex items-center justify-center" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 100, filter: "blur(20px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-gradient">
                  <div className="p-0.5 rounded-full futuristic-gradient">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  Neural Directive
                </div>
                <h2 className="text-5xl font-display font-bold text-white tracking-tighter">System Objective</h2>
                <p className="text-white/40 text-base font-medium">Define your operational focus area.</p>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 px-1">Engagement Profile</label>
                  <div className="relative group/input">
                    <div className="absolute -inset-0.5 bg-linear-to-r from-accent/30 to-primary/30 rounded-2xl blur opacity-0 group-focus-within/input:opacity-100 transition duration-500" />
                    <Textarea 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="E.g. Engineering lead focusing on neural interface scalability..."
                      className="relative min-h-[220px] bg-black/60 border-white/5 rounded-2xl focus:border-white/20 focus:ring-0 text-white font-medium p-8 resize-none leading-relaxed aria-placeholder:text-white/10 transition-all text-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-8 pt-4">
                <Button 
                  onClick={handleNext}
                  className="w-full h-24 rounded-[2.5rem] futuristic-gradient text-white font-black text-2xl group glow-gradient hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center gap-4">
                    Active System Core
                    <Sparkles className="w-8 h-8 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700" />
                  </span>
                </Button>

                <div className="flex items-center justify-between px-4">
                  <button 
                    onClick={() => setStep(2)}
                    className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all py-2"
                  >
                    <ArrowRight className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    Back
                  </button>
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full futuristic-gradient animate-pulse" />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Ready for deployment</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Indicator */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {[1, 2, 3].map((s) => (
          <div 
            key={s}
            className={cn(
              "h-1 rounded-full transition-all duration-500",
              step === s ? "w-8 futuristic-gradient glow-gradient" : "w-4 bg-white/10"
            )}
          />
        ))}
      </div>
    </div>
  );
}
