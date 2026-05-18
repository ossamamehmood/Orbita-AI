import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Info } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";

export default function NeuralBriefing() {
  const { getSystemSynthesis, tasks } = useTasks();
  const [briefing, setBriefing] = React.useState<{ briefing: string, topActions: string[], directive: string } | null>(null);
  const [loading, setLoading] = React.useState(false);

  const fetchBriefing = React.useCallback(async (force = false) => {
    if (tasks.length === 0) return;
    
    // Check cache
    const cached = localStorage.getItem('neural_briefing_cache');
    if (cached && !force) {
      const { data, timestamp } = JSON.parse(cached);
      // 1 hour cache
      if (Date.now() - timestamp < 3600000) {
        setBriefing(data);
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getSystemSynthesis();
      if (data) {
        if (data.error) {
          setError(data.message || data.error);
        } else {
          setBriefing(data);
          localStorage.setItem('neural_briefing_cache', JSON.stringify({
            data,
            timestamp: Date.now()
          }));
        }
      }
    } catch (e) {
      setError("AI Core communication failure");
    } finally {
      setLoading(false);
    }
  }, [getSystemSynthesis, tasks.length]);

  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchBriefing();
  }, [fetchBriefing]);

  if (tasks.filter(t => !t.isDeleted).length === 0) return null;

  return (
    <section className="relative group overflow-hidden">
      <div className="absolute -inset-1 futuristic-gradient rounded-[2.5rem] blur-2xl opacity-5 group-hover:opacity-10 transition duration-1000" />
      <div className="relative glass-glossy rounded-[2rem] py-4 px-6 lg:px-8 border-white/20 bg-card/10 backdrop-blur-3xl shadow-2xl transition-all duration-500 hover:border-primary/40 ring-1 ring-white/15 ring-inset">
        {/* Extra glossy highlights */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/50 to-transparent z-30" />
        <div className="absolute top-0 left-0 w-px h-full bg-linear-to-b from-white/20 via-transparent to-transparent z-30" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/40 to-transparent z-30" />
        
        <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
          <div className="flex-1 space-y-4 py-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl futuristic-gradient flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] overflow-hidden relative border border-white/10">
                <div className="absolute inset-0 bg-white/40 blur-md animate-pulse" />
                <Sparkles className="w-5 h-5 text-white relative z-10" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-foreground leading-tight tracking-tight">Neural <span className="text-gradient">Synthesis</span></h3>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30 italic">Strategic AI Hub</span>
              </div>
            </div>


            {loading ? (
              <div className="space-y-4 pt-1">
                <div className="h-4 w-3/4 bg-foreground/5 rounded-full animate-pulse" />
                <div className="h-4 w-1/2 bg-foreground/5 rounded-full animate-pulse lg:hidden" />
              </div>
            ) : error ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-2xl bg-destructive/5 border border-destructive/20 space-y-3"
              >
                <div className="flex items-center gap-3 text-destructive">
                  <Info className="w-4 h-4" />
                  <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
                </div>
                <Button 
                   onClick={() => fetchBriefing(true)}
                   variant="ghost" 
                   className="text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 border border-primary/20 rounded-xl px-4 h-7 transition-all"
                 >
                   Retry Sync
                 </Button>
              </motion.div>
            ) : briefing ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="relative">
                  <p className="text-[17px] text-foreground/80 font-medium leading-relaxed max-w-2xl italic tracking-tight">
                    "{briefing.briefing}"
                  </p>
                  <Button 
                    onClick={() => fetchBriefing(true)}
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-8 w-7 h-7 rounded-full text-foreground/20 hover:text-primary transition-colors"
                    title="Force AI Resync"
                  >
                    <Zap className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {briefing.topActions.map((action, i) => (
                    <div key={i} className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 group/action cursor-default hover:border-primary/40 transition-all backdrop-blur-sm">
                      <ArrowRight className="w-3 h-3 text-primary group-hover:translate-x-0.5 transition-transform" />
                      <span className="text-[12px] font-bold text-foreground/60 group-hover:text-foreground">{action}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="pt-1">
                 <Button 
                   onClick={fetchBriefing}
                   variant="ghost" 
                   className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white hover:futuristic-gradient border border-primary/20 rounded-xl px-6 h-8 transition-all group"
                 >
                   <Zap className="w-3 h-3 mr-2 group-hover:fill-white" />
                   Generate Synthesis
                 </Button>
              </div>
            )}
          </div>

          {briefing && (
             <div className="lg:w-80 shrink-0 space-y-2.5 py-1">
                <div className="relative py-3.5 px-5 rounded-[1.5rem] bg-slate-950/80 border border-white/20 overflow-hidden group/directive shadow-[0_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-3xl ring-1 ring-white/20 ring-inset">
                  {/* Digital Grid Overlay */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:10px_10px]" />
                  
                  {/* Scan line animation */}
                  <motion.div 
                    animate={{ top: ['-10%', '110%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-0 h-[1px] bg-linear-to-r from-transparent via-primary/50 to-transparent z-20 pointer-events-none opacity-30 shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]"
                  />
                  
                  {/* High-end glossy highlights */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-white/30 to-transparent" />
                  <div className="absolute top-0 left-0 w-[1px] h-full bg-linear-to-b from-transparent via-white/10 to-transparent" />
                  <div className="absolute -top-32 -right-32 w-64 h-64 futuristic-gradient blur-[80px] opacity-15 group-hover:opacity-25 transition-opacity duration-1000" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="w-1.5 h-1.5 rounded-full futuristic-gradient animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),1)]" />
                          <div className="absolute inset-0 w-1.5 h-1.5 rounded-full futuristic-gradient blur-[1.5px]" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gradient drop-shadow-sm">Operator Directive</span>
                      </div>
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 border border-white/10">
                        <span className="text-[7px] font-bold text-white/40 tracking-tighter uppercase">V.SYS</span>
                      </div>
                    </div>
                    
                    <div className="relative px-0.5">
                      <p className="text-[13px] font-bold text-white/95 leading-relaxed italic tracking-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] relative z-10">
                        {briefing.directive}
                      </p>
                    </div>
                    
                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <motion.div 
                          animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-1 h-1 rounded-full bg-primary" 
                        />
                        <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white/30 group-hover:text-white/50 transition-colors">Neural Sync</span>
                      </div>
                      <div className="flex items-end gap-0.5 h-2">
                        {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8].map((h, i) => (
                           <motion.div 
                             key={i}
                             animate={{ height: [`${h*100}%`, `${(h*0.4)*100}%`, `${h*100}%`] }}
                             transition={{ duration: 1.5 + (i*0.15), repeat: Infinity, ease: "easeInOut" }}
                             className="w-0.5 rounded-full bg-primary/20 group-hover:bg-primary/50 transition-colors"
                           />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between px-4 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md group/bottom">
                   <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                     <span className="text-[8px] font-black uppercase tracking-[0.1em] text-white/30 group-hover/bottom:text-white/50 transition-colors">ENCRYPTION: AES-256</span>
                   </div>
                   <span className="text-[8px] font-bold text-white/20 tabular-nums">CORE v2.4</span>
                </div>
             </div>
          )}
        </div>
      </div>
    </section>
  );
}
