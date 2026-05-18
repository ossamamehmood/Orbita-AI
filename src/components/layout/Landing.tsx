import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Shield, BarChart3, Clock } from "lucide-react";
import { signInWithGoogle } from "@/lib/firebase";

export default function Landing() {
  return (
    <div className="relative min-height-screen overflow-hidden bg-[#030712] selection:bg-primary/30">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-0 -right-4 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between glass border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl futuristic-gradient flex items-center justify-center">
            <Zap className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight">Orbita <span className="text-gradient">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/70">
          <a href="#features" className="hover:text-gradient transition-colors">Features</a>
          <a href="#ai" className="hover:text-gradient transition-colors">AI Engine</a>
          <a href="#analytics" className="hover:text-gradient transition-colors">Analytics</a>
        </div>
        <Button 
          onClick={signInWithGoogle}
          className="futuristic-gradient text-white border-0 hover:scale-105 transition-transform"
        >
          Get Started
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-xs font-semibold text-primary mb-8">
            <Sparkles className="w-4 h-4" />
            <span>AI-POWERED PRODUCTIVITY EVOLUTION</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold leading-tight tracking-tighter mb-8">
            Orchestrate Your <br />
            <span className="text-gradient">Future Workflow.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-foreground/60 text-lg md:text-xl mb-10">
            More than just a to-do list. An intelligent ecosystem that plans, summarizes, and accelerates your execution using advanced AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={signInWithGoogle}
              className="h-14 px-8 text-lg font-semibold futuristic-gradient text-white border-0 shadow-2xl shadow-primary/20 rounded-2xl group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 px-8 text-lg font-semibold glass border-white/10 text-foreground rounded-2xl hover:bg-white/5 transition-all"
            >
              View Demo
            </Button>
          </div>
        </motion.div>

        {/* Hero Image Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-20 relative p-4 rounded-3xl glass border border-white/10 shadow-3xl"
        >
          <div className="absolute inset-0 futuristic-gradient opacity-10 blur-3xl -z-10 rounded-3xl" />
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
            alt="Dashboard Preview" 
            className="rounded-2xl border border-white/5 w-full aspect-video object-cover"
          />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "AI Task Expansion",
              desc: "Turn a simple thought into a full execution plan with subtasks, summaries, and priority analysis.",
              icon: Sparkles,
              color: "text-primary",
              bg: "bg-primary/10"
            },
            {
              title: "Glassmorphism UI",
              desc: "A stunning, focused interface built for creators. Inspired by the best of iOS and Arc Browser.",
              icon: Zap,
              color: "text-secondary",
              bg: "bg-secondary/10"
            },
            {
              title: "Deep Analytics",
              desc: "Track your productivity streak, focus hours, and AI insights with cinematic charts.",
              icon: BarChart3,
              color: "text-gradient",
              bg: "bg-accent/10"
            }
          ].map((feat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl glass border border-white/10 flex flex-col gap-4 text-left group"
            >
              <div className={`w-12 h-12 rounded-2xl ${feat.bg} flex items-center justify-center`}>
                <feat.icon className={`w-6 h-6 ${feat.color}`} />
              </div>
              <h3 className="text-2xl font-display font-bold">{feat.title}</h3>
              <p className="text-foreground/60 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Zap className="text-primary w-5 h-5" />
            <span className="font-display font-bold">Orbita AI</span>
          </div>
          <div className="flex gap-8 text-xs font-semibold uppercase tracking-widest text-white/50">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
          <p className="text-xs text-white/30">© 2026 Orbita AI ecosystem. Built for the future of work.</p>
        </div>
      </footer>
    </div>
  );
}
