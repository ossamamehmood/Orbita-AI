import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, X, Sparkles, Brain, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { aiService } from "@/services/aiService";
import { useTasks } from "@/hooks/useTasks";
import { cn } from "@/lib/utils";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

import { OrbitaLogo } from "@/components/layout/OrbitaLogo";

export default function AIAssistant() {
  const { tasks, userProfile } = useTasks();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Orbita AI Neural Core online. Welcome back, ${userProfile.name}. How can I facilitate your productivity cycle today?` }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
           viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        }
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const response = await aiService.chat(userMsg, { 
        tasks: tasks.map(t => ({ title: t.title, status: t.status })),
        userProfile 
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Strategic uplink interrupted. Please check system parameters." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end gap-3 sm:gap-4 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" }}
            className="w-[100vw] sm:w-[400px] max-w-[calc(100vw-32px)] sm:max-w-[90vw] pointer-events-auto h-[70vh] sm:h-[600px] flex flex-col glass-blue-glossy border-border shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-border bg-background/40 backdrop-blur-3xl">
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-lg bg-card border border-border shadow-sm">
                  <OrbitaLogo className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground tracking-tight text-sm">Orbita Assistant</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full futuristic-gradient animate-pulse glow-gradient" />
                    <span className="text-[9px] text-foreground/30 uppercase font-bold tracking-wider">System Active</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-8 h-8 rounded-full hover:bg-card/10 text-foreground/20 hover:text-foreground transition-all" 
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Chat Area */}
            <ScrollArea className="flex-1 p-6" ref={scrollRef}>
              <div className="space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                       <OrbitaLogo className="w-7 h-7 mr-3 mt-1 shrink-0 shadow-sm" />
                    )}
                    <div className={cn(
                      "max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap font-bold transition-colors duration-400 shadow-md",
                      msg.role === 'user' 
                        ? 'futuristic-gradient text-white' 
                        : 'bg-muted border border-border text-foreground'
                    )}>
                      {msg.content}
                    </div>
                    {msg.role === 'user' && (
                      <div className="relative p-[1px] rounded-full futuristic-gradient ml-3 mt-1 shrink-0 h-fit">
                        <Avatar className="w-7 h-7 border border-black/50">
                          <AvatarImage src={userProfile.photo || undefined} />
                          <AvatarFallback className="bg-primary/20 text-[8px] font-bold">{userProfile.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start items-center gap-2">
                    <OrbitaLogo className="w-6 h-6 mr-3 mt-1 shrink-0" />
                    <div className="bg-card/10 backdrop-blur-xl border border-border p-4 rounded-2xl rounded-tl-sm flex gap-1.5 shadow-sm">
                      <div className="w-1.5 h-1.5 bg-foreground rounded-full animate-bounce shadow-[0_0_8px_rgba(var(--foreground-rgb),0.5)]" />
                      <div className="w-1.5 h-1.5 bg-foreground/60 rounded-full animate-bounce [animation-delay:0.2s] shadow-[0_0_8px_rgba(var(--foreground-rgb),0.3)]" />
                      <div className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce [animation-delay:0.4s] shadow-[0_0_8px_rgba(var(--foreground-rgb),0.2)]" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-5 border-t border-border bg-background/40 backdrop-blur-3xl">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2.5 items-center"
              >
                <div className="flex-1 relative group">
                  <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything..." 
                    className="bg-card/5 border-border rounded-full focus:border-primary/50 focus:ring-0 h-10 pl-5 pr-10 text-sm text-foreground font-medium transition-all focus:bg-card/10"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-foreground/60 transition-colors">
                     <Sparkles className="w-3.5 h-3.5" />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isTyping || !input.trim()} 
                  className="w-10 h-10 rounded-full futuristic-gradient text-white hover:opacity-90 border-0 shadow-lg p-0 flex items-center justify-center shrink-0 disabled:opacity-30 transition-all font-bold"
                >
                  <Send className="w-4 h-4 fill-primary-foreground" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-auto">
        <Button 
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-16 h-16 sm:w-20 sm:h-20 rounded-[2rem] p-0 bg-background/40 backdrop-blur-2xl border border-border glow-gradient hover:scale-110 active:scale-95 transition-all relative group overflow-hidden pointer-events-auto",
            isOpen && "border-primary/40 bg-card/5 shadow-inner"
          )}
        >
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className={cn("w-full h-full p-4 relative z-10 transition-transform duration-500", isOpen && "rotate-90 scale-75")}>
             {isOpen ? (
               <X className="w-full h-full text-foreground p-2" />
             ) : (
               <OrbitaLogo className="w-full h-full drop-shadow-gradient" />
             )}
          </div>
        </Button>
      </div>
    </div>
  );
}
