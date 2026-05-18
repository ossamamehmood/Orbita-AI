import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Folder, FolderPlus, Plus, MoreVertical, Trash2, Layout, Zap, X, AlertCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useTasks } from "@/hooks/useTasks";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function WorkspacesView({ 
  onSelectWorkspace 
}: { 
  onSelectWorkspace: (id: string) => void 
}) {
  const { workspaces, tasks, createWorkspace, deleteWorkspace, moveTaskToWorkspace, confirmAction } = useTasks();
  const [isCreating, setIsCreating] = React.useState(false);
  const [name, setName] = React.useState("");

  const wsStats = React.useMemo(() => {
    const stats: Record<string, { total: number, completed: number, progress: number }> = {};
    
    workspaces.forEach(ws => {
      const wsTasks = tasks.filter(t => t.workspaceId === ws.id && !t.isDeleted);
      const completedTasksCount = wsTasks.filter(t => t.status === 'completed').length;
      const progress = wsTasks.length > 0 ? Math.round((completedTasksCount / wsTasks.length) * 100) : 0;
      
      stats[ws.id] = {
        total: wsTasks.length,
        completed: completedTasksCount,
        progress
      };
    });
    
    return stats;
  }, [workspaces, tasks]);

  const handleCreate = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await createWorkspace(name);
      setName("");
      setIsCreating(false);
    }
  }, [name, createWorkspace]);

  const triggerDelete = (e: React.MouseEvent, wsId: string, wsName: string) => {
    e.stopPropagation();
    const taskCount = tasks.filter(t => t.workspaceId === wsId && !t.isDeleted).length;
    
    confirmAction({
      title: `Delete Workspace: ${wsName}?`,
      description: `This will permanently delete the workspace and its ${taskCount} associated tasks.`,
      impact: "All data within this workspace will be permanently lost.",
      confirmText: "Delete Workspace",
      onConfirm: () => deleteWorkspace(wsId, true)
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border pb-8">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-display font-medium text-foreground">Project <span className="font-semibold">Sectors</span></h2>
          <p className="text-foreground/30 text-sm sm:text-base">Organize your neural environment into dedicated workspaces.</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="h-10 px-6 rounded-full futuristic-gradient text-white glow-gradient hover:opacity-90 border-0 shadow-xl flex items-center gap-2 group w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 text-white group-hover:rotate-90 transition-transform group-hover:svg-stroke-gradient" strokeWidth={2.5} />
          <span className="font-semibold text-sm">Initialize Sector</span>
        </Button>
      </div>

      {isCreating && (
        <motion.form 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleCreate}
          className="bg-card/5 border border-border p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl"
        >
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/30 ml-1">Sector Label</label>
            <input 
              autoFocus
              placeholder="e.g. System Design, Product Strategy..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-card/10 border border-border rounded-2xl px-6 h-14 text-foreground focus:outline-none focus:border-primary/50 text-lg font-medium transition-all"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" className="flex-1 h-12 rounded-xl futuristic-gradient text-white glow-gradient font-bold">Deploy Sector</Button>
            <Button type="button" variant="ghost" onClick={() => setIsCreating(false)} className="px-8 h-12 rounded-xl text-foreground/40 hover:bg-card/10 font-medium">Cancel</Button>
          </div>
        </motion.form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6">
        {workspaces.map((ws, i) => {
          const stats = wsStats[ws.id] || { total: 0, completed: 0, progress: 0 };
          const progress = stats.progress;

          return (
            <motion.div
              key={ws.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onSelectWorkspace(ws.id)}
              transition={{ delay: i * 0.05 }}
              className="group relative p-8 rounded-3xl bg-card border border-border hover:border-primary/20 transition-all flex flex-col gap-6 cursor-pointer text-left overflow-hidden shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div className="relative flex items-center justify-center w-12 h-12 group/folder">
                  <Folder className="w-full h-full transition-all text-foreground/40 group-hover:svg-stroke-gradient group-hover:drop-shadow-gradient" />
                  <span className="absolute top-[16px] font-black text-xs uppercase tracking-tighter flex items-center justify-center pointer-events-none text-foreground/60 group-hover:text-gradient transition-colors">
                    {ws.name.substring(0, 1)}
                  </span>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                   <div className="text-[10px] font-mono text-foreground/10 uppercase tracking-widest leading-none">{ws.id.substring(0, 6)}</div>
                   <DropdownMenu>
                     <DropdownMenuTrigger 
                       className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 rounded-full hover:bg-card/10 text-foreground/20 hover:text-foreground -mr-2 outline-none")}
                       onClick={(e) => e.stopPropagation()}
                     >
                       <MoreVertical className="w-4 h-4" />
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="bg-popover border border-border backdrop-blur-xl rounded-xl p-1 min-w-[160px]">
                       <DropdownMenuItem 
                         onClick={(e) => triggerDelete(e, ws.id, ws.name)}
                         className="flex items-center gap-2 text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer rounded-lg py-2"
                       >
                         <Trash2 className="w-4 h-4" />
                         <span className="font-semibold text-xs uppercase tracking-wider">Delete Workspace</span>
                       </DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-semibold text-foreground group-hover:text-gradient transition-colors leading-tight">{ws.name}</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="bg-card/10 text-foreground/30 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border border-border">
                    {stats.total} Tasks
                  </div>
                  {progress === 100 && stats.total > 0 && (
                     <div className="text-primary text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-primary" />
                      Synced
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 mt-auto">
                <div className="flex justify-between items-end">
                   <div className="space-y-0.5">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-foreground/20">Progress</div>
                      <div className="text-base font-bold text-foreground tabular-nums">{progress}%</div>
                   </div>
                   <div className="text-[10px] font-medium text-foreground/20 tracking-wider">{stats.completed}/{stats.total}</div>
                </div>
                <div className="h-1.5 w-full bg-card-foreground/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full futuristic-gradient rounded-full glow-gradient"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}

        <button 
          onClick={() => setIsCreating(true)}
          className="p-8 rounded-3xl border border-dashed border-border hover:border-primary/20 hover:bg-card/10 transition-all flex flex-col items-center justify-center gap-3 text-foreground/20 hover:text-foreground group min-h-[240px]"
        >
          <div className="w-10 h-10 rounded-full bg-card-foreground/5 flex items-center justify-center border border-border group-hover:futuristic-gradient transition-all group-hover:rotate-90 shadow-sm">
            <Plus className="w-5 h-5 text-foreground group-hover:svg-stroke-gradient group-hover:rotate-90 transition-colors" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-xs uppercase tracking-wider">New Sector</span>
        </button>
      </div>
    </div>
  );
}
