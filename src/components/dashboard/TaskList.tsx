import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Task } from "@/types";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle, 
  Bot, 
  MoreVertical,
  ChevronRight,
  GripVertical,
  Sparkles,
  Trash2,
  Users,
  ShieldAlert
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { useTasks } from "@/hooks/useTasks";

export default function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
    <div className="flex flex-col items-center justify-center py-20 glass border border-dashed border-border rounded-[2rem] opacity-50 bg-white/[0.01]">
        <Bot className="w-12 h-12 mb-4 text-foreground/10" />
        <p className="text-sm font-bold tracking-tight text-foreground">No active nodes detected in this sector.</p>
        <p className="text-[10px] text-foreground/30 uppercase tracking-widest mt-1">Initiate a workflow cycle to begin</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {tasks.map((task, i) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          index={i} 
        />
      ))}
    </div>
  );
}

const TaskCard = React.memo(function TaskCard({ 
  task, 
  index
}: { 
  task: Task, 
  index: number
}) {
  const { updateTask, deleteTask, expandTaskAI } = useTasks();
  const [isExpanded, setIsExpanded] = useState(false);

  const onUpdate = React.useCallback((updates: Partial<Task>) => updateTask(task.id, updates), [updateTask, task.id]);
  const onDelete = React.useCallback(() => deleteTask(task.id), [deleteTask, task.id]);

  const priorityColors = {
    low: "bg-white/5 text-white/40 border-white/10",
    medium: "bg-blue-500/10 text-blue-400 border-blue-500/20 glow-blue-sm",
    high: "bg-orange-500/10 text-orange-500 border-orange-500/20 glow-orange-sm",
    critical: "bg-red-500/10 text-red-500 border-red-500/20 glow-red-sm animate-pulse-subtle",
  };

  const toggleComplete = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onUpdate({ status: task.status === 'completed' ? 'todo' : 'completed', progress: task.status === 'completed' ? 0 : 100 });
  };

  const toggleSubtask = (subtaskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSubtasks = task.subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    const completedCount = newSubtasks.filter(st => st.completed).length;
    const progress = Math.round((completedCount / newSubtasks.length) * 100);
    onUpdate({ subtasks: newSubtasks, progress });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      layout
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("taskId", task.id);
        e.dataTransfer.effectAllowed = "move";
        // removed the tiny transparent image to provide better visual feedback during drag
      }}
      onClick={() => setIsExpanded(!isExpanded)}
      className={cn(
        "group relative p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] glass-glossy border-border transition-all cursor-pointer bg-card/10 active:scale-[0.99] active:opacity-90",
        isExpanded && "border-primary/20 shadow-2xl shadow-primary/5"
      )}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <button 
          onClick={toggleComplete}
          className={`shrink-0 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center mt-1 outline-none ${
            task.status === 'completed' 
              ? "futuristic-gradient border-0 shadow-lg shadow-primary/20" 
              : "border-border hover:border-primary/40"
          }`}
        >
          {task.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-white" />}
        </button>
        
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={`text-base sm:text-lg font-semibold tracking-tight transition-all truncate ${task.status === 'completed' ? 'text-foreground/20 line-through' : 'text-foreground group-hover:text-gradient'}`}>
                    {task.title}
                  </h4>
                  <Badge variant="outline" className={cn(
                    "text-[8px] uppercase tracking-wider font-bold border-0 bg-white/5 py-0.5 px-2 shrink-0 rounded-md",
                    priorityColors[task.priority]
                  )}>
                    {task.priority}
                  </Badge>
                </div>
                <p className={cn(
                  "text-sm text-foreground/40 font-normal transition-all leading-relaxed max-w-2xl",
                  isExpanded ? "line-clamp-none" : "line-clamp-1"
                )}>
                  {task.description || "No description provided."}
                </p>
              </div>
            
            <div className="flex items-center gap-2 sm:gap-3" onClick={e => e.stopPropagation()}>
              {task.dueDate && task.status !== 'completed' && (
                <div className="hidden md:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-linear-to-r from-primary/20 to-primary/5 text-foreground border border-border text-[9px] sm:text-[10px] font-black uppercase tracking-widest glow-gradient backdrop-blur-xl group shrink-0 transition-colors">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary transition-colors" />
                  <span className="group-hover:text-gradient transition-all">DUE: {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}</span>
                </div>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "w-8 h-8 rounded-xl hover:bg-card/10 shrink-0 border border-border group shadow-sm")}>
                  <MoreVertical className="w-4 h-4 text-foreground/40 group-hover:text-foreground transition-colors" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-blue-glossy border-border text-foreground min-w-[160px] p-2 rounded-2xl shadow-2xl">
                  <DropdownMenuItem onClick={toggleComplete} className="hover:bg-card/10 cursor-pointer rounded-xl flex items-center gap-2 py-2.5 group/menu hover-text-gradient">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 group-hover/menu:svg-stroke-gradient transition-all" />
                    <span className="text-sm font-bold transition-colors">{task.status === 'completed' ? 'Mark Active' : 'Mark Complete'}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); expandTaskAI(task.id); }} className="hover:bg-card/10 cursor-pointer rounded-xl flex items-center gap-2 py-2.5 group/menu hover-text-gradient">
                    <Sparkles className="w-4 h-4 text-primary group-hover/menu:svg-stroke-gradient transition-all" />
                    <span className="text-sm font-bold transition-colors text-foreground">AI Breakdown</span>
                  </DropdownMenuItem>
                  <div className="h-px bg-border my-2 mx-1" />
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-red-500/80 hover:bg-red-500/10 cursor-pointer rounded-xl flex items-center gap-2 py-2.5">
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm font-bold">Terminate Task</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && task.subtasks && task.subtasks.length > 0 && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pt-2 space-y-3"
              >
                <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/20 mb-2 px-1">Sub-cycles</div>
                {task.subtasks.map(st => (
                  <div 
                    key={st.id} 
                    onClick={(e) => toggleSubtask(st.id, e)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl border border-border bg-card/5 hover:bg-card/10 transition-colors group/sub"
                  >
                    <div className={cn(
                      "w-4 h-4 rounded border transition-all flex items-center justify-center",
                      st.completed ? "futuristic-gradient border-transparent glow-gradient" : "border-border group-hover/sub:border-foreground/20"
                    )}>
                      {st.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className={cn("text-xs font-medium transition-all truncate", st.completed ? "text-foreground/20 line-through" : "text-foreground/70")}>{st.title}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {(task.progress > 0 || isExpanded) && task.status !== 'completed' && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-foreground/20">
                <span>Execution Status</span>
                <span>{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="h-1 bg-card/10 border-0" indicatorClassName="futuristic-gradient glow-gradient" />
            </div>
          )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Due Date Editor */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/5 border border-border hover:border-primary/20 transition-all group/date">
              <Clock className="w-3 h-3 text-foreground/40" />
              <input 
                type="date"
                value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ""}
                onChange={(e) => onUpdate({ dueDate: e.target.value })}
                className="bg-transparent text-[10px] font-semibold text-foreground/40 group-hover/date:text-foreground uppercase tracking-wider border-none outline-none cursor-pointer dark-calendar-picker w-24"
              />
            </div>

            {task.complexity && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/5 border border-border text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                <GripVertical className="w-3 h-3 text-accent" />
                <span>Level {task.complexity}</span>
              </div>
            )}

            {task.estimatedTime && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/5 border border-border text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                <Clock className="w-3 h-3 text-secondary" />
                <span>{task.estimatedTime}</span>
              </div>
            )}

            {task.tags && task.tags.length > 0 && task.tags.map(tag => (
              <div key={tag} className="px-3 py-1.5 rounded-full bg-card/5 border border-border text-[9px] font-black uppercase tracking-widest text-foreground/40 hover:text-gradient transition-all cursor-default">
                {tag}
              </div>
            ))}

            {task.stakeholders && task.stakeholders.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20">
                <Users className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-black uppercase text-primary/80">{task.stakeholders.join(', ')}</span>
              </div>
            )}

            {task.dependencies && task.dependencies.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/5 border border-orange-500/20">
                <ShieldAlert className="w-3 h-3 text-orange-500" />
                <span className="text-[9px] font-black uppercase text-orange-500/80">Depends on: {task.dependencies.join(', ')}</span>
              </div>
            )}

            {task.subtasks && task.subtasks.length > 0 && (
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-foreground/30 uppercase tracking-tight px-2 py-1">
                <Circle className="w-2.5 h-2.5 text-primary/50" />
                <span>{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} Cycles</span>
              </div>
            )}
            {task.aiSummary && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/5 border border-border text-[10px] font-medium text-foreground/60 uppercase tracking-tight">
                <Sparkles className="w-2.5 h-2.5 text-primary" />
                <span>AI Breakdown</span>
              </div>
            )}
            <div className="ml-auto">
               <ChevronRight className={cn("w-4 h-4 text-foreground/10 transition-transform duration-300", isExpanded && "rotate-90 text-foreground/40")} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
