import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  FolderPlus, 
  Folder,
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Bell, 
  Sparkles,
  Zap,
  TrendingUp,
  CheckCircle2,
  Clock,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  Menu,
  X,
  AlertCircle,
  Circle,
  Layers,
  Settings2,
  Power,
  Trash2
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { OrbitaLogo } from "@/components/layout/OrbitaLogo";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useTasks } from "@/hooks/useTasks";
import TaskList from "@/components/dashboard/TaskList";
import AIAssistant from "@/components/ai/AIAssistant";
import Analytics from "@/components/dashboard/Analytics";
import SettingsSubpage from "@/components/pages/Settings";
import WorkspacesView from "@/components/dashboard/WorkspacesView";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function Dashboard() {
  const { 
    tasks, 
    workspaces, 
    notifications, 
    userProfile, 
    loading, 
    createTask, 
    deleteTask, 
    expandTaskAI,
    decomposeComplexInputAI,
    clearNotifications, 
    createWorkspace, 
    deleteWorkspace, 
    moveTaskToWorkspace,
    confirmAction,
    isConfirmOpen,
    confirmOptions,
    closeConfirm,
    resetSystem,
    reorderWorkspaces
  } = useTasks();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeWorkspace, setActiveWorkspace] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickTaskTitle, setQuickTaskTitle] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isWorkspacesExpanded, setIsWorkspacesExpanded] = useState(true);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [quickTaskDueDate, setQuickTaskDueDate] = useState<string>("");

  const filteredTasks = React.useMemo(() => {
    return tasks.filter(task => {
      if (task.isDeleted) return false;
      
      // Search query filter
      if (searchQuery) {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              task.description?.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;
      }

      // Workspace filter
      if (activeWorkspace && task.workspaceId !== activeWorkspace) return false;

      // Tab filter
      if (activeTab === "completed") return task.status === "completed";
      if (activeTab === "dashboard") return task.status !== "completed";
      
      return true;
    });
  }, [tasks, searchQuery, activeWorkspace, activeTab]);

  const stats = React.useMemo(() => [
    { label: "Active Tasks", value: tasks.filter(t => t.status !== 'completed' && !t.isDeleted).length, icon: Zap, color: "text-gradient" },
    { label: "Synced Data", value: tasks.filter(t => t.status === 'completed' && !t.isDeleted).length, icon: CheckCircle2, color: "text-white/60" },
    { label: "Efficiency", value: "98%", icon: TrendingUp, color: "text-white/40" },
  ], [tasks]);

  const handleCreateWorkspace = React.useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newWorkspaceName.trim()) {
      await createWorkspace(newWorkspaceName);
      setNewWorkspaceName("");
      setIsCreatingWorkspace(false);
    }
  }, [newWorkspaceName, createWorkspace]);

  const handleTaskDrop = React.useCallback(async (taskId: string, workspaceId: string) => {
    await moveTaskToWorkspace(taskId, workspaceId);
  }, [moveTaskToWorkspace]);

  const handleQuickAdd = React.useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quickTaskTitle.trim()) return;
    
    createTask({
      title: quickTaskTitle.slice(0, 100) + (quickTaskTitle.length > 100 ? "..." : ""),
      description: quickTaskTitle.length > 100 ? quickTaskTitle : "",
      priority: 'medium',
      status: 'todo',
      dueDate: quickTaskDueDate || undefined,
      workspaceId: activeWorkspace || workspaces[0]?.id || 'ws1'
    });
    setQuickTaskTitle("");
    setQuickTaskDueDate("");
    setIsAddingTask(false);
  }, [quickTaskTitle, quickTaskDueDate, activeWorkspace, workspaces, createTask]);

  const triggerPurge = React.useCallback(() => {
    confirmAction({
      title: "Decommission Entire System?",
      description: "You are about to initiate a full system purge. This will permanently remove all nodes, workspaces, and operator profile data from the neural registry.",
      impact: "Total reset of all stored productivity data. Systems will reboot to factory state.",
      confirmText: "Purge Neural Registry",
      onConfirm: () => resetSystem()
    });
  }, [confirmAction, resetSystem]);

  const triggerDeleteWorkspace = React.useCallback((wsId: string) => {
    const ws = workspaces.find(w => w.id === wsId);
    const taskCount = tasks.filter(t => t.workspaceId === wsId && !t.isDeleted).length;
    
    confirmAction({
      title: `Purge Workspace: ${ws?.name}?`,
      description: `You are about to offline this workspace. By default, all ${taskCount} nodes inside will be permanently decommissioned.`,
      impact: `${taskCount} active nodes will be purged from the neural grid.`,
      confirmText: "Purge Everything",
      onConfirm: () => deleteWorkspace(wsId, true)
    });
  }, [workspaces, tasks, confirmAction, deleteWorkspace]);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative transition-colors duration-500">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:static inset-y-0 left-0 bg-background/50 backdrop-blur-3xl border-r border-border flex flex-col items-center py-6 sm:py-8 z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl shadow-black/20",
          isSidebarCollapsed ? "lg:w-24 px-2" : "lg:w-72 px-4 sm:px-6",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className={cn("flex items-center mb-10 w-full", isSidebarCollapsed ? "justify-center" : "px-2")}>
                <div className={cn("flex items-center", isSidebarCollapsed ? "gap-0" : "gap-3")}>
                  <div className="p-1 rounded-xl bg-card border border-border shadow-lg">
                    <OrbitaLogo className="w-8 h-8" />
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="font-display font-bold text-xl tracking-tight text-foreground whitespace-nowrap">Orbita</span>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="lg:hidden text-foreground/40 ml-auto" onClick={() => setIsSidebarOpen(false)}>
                  <ChevronLeft className="w-6 h-6" />
                </Button>
              </div>

              <nav className="flex-1 w-full space-y-6 overflow-y-auto scrollbar-none pr-1 text-foreground">
                <div className="space-y-1">
                  {!isSidebarCollapsed && <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-foreground/20 mb-4 px-4">Menu</p>}
                  <SidebarItem 
                    icon={LayoutDashboard} 
                    label="Dashboard" 
                    active={activeTab === "dashboard"} 
                    collapsed={isSidebarCollapsed}
                    onClick={() => { setActiveTab("dashboard"); setIsSidebarOpen(false); }} 
                  />
                  <SidebarItem 
                    icon={Zap} 
                    label="Active Tasks" 
                    active={activeTab === "active"} 
                    collapsed={isSidebarCollapsed}
                    onClick={() => { setActiveTab("active"); setIsSidebarOpen(false); }} 
                    badgeCount={tasks.filter(t => !t.isDeleted && t.status !== 'completed').length}
                  />
                  <SidebarItem 
                    icon={CheckCircle2} 
                    label="Completed" 
                    active={activeTab === "completed"} 
                    collapsed={isSidebarCollapsed}
                    onClick={() => { setActiveTab("completed"); setIsSidebarOpen(false); }} 
                  />
                </div>
                
                <div className="pt-8 w-full space-y-1">
                  <div className="flex items-center justify-between px-4 mb-4">
                    {!isSidebarCollapsed && (
                      <button 
                        onClick={() => setActiveTab('workspaces')} 
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground hover:text-primary hover:scale-105 transition-all outline-none cursor-pointer"
                      >
                        Workspaces
                      </button>
                    )}
                    {!isSidebarCollapsed && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsCreatingWorkspace(true)}
                        className="w-5 h-5 hover:text-foreground group transition-colors"
                      >
                        <Plus className="w-4 h-4 group-hover:text-primary"/>
                      </Button>
                    )}
                  </div>
                  
                  {!isSidebarCollapsed && isCreatingWorkspace && (
                    <motion.form 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleCreateWorkspace}
                      className="px-4 mb-4"
                    >
                      <input 
                        autoFocus
                        placeholder="Workspace name..."
                        value={newWorkspaceName}
                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                        onBlur={() => !newWorkspaceName && setIsCreatingWorkspace(false)}
                        className="w-full bg-card border border-primary/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50 font-bold"
                      />
                    </motion.form>
                  )}

                    <div className="space-y-1">
                      {/* All Sectors / Default Workspace */}
                      <div>
                        <SidebarItem 
                          label="All Sectors" 
                          icon={Layers} 
                          active={activeWorkspace === null}
                          collapsed={isSidebarCollapsed}
                          onClick={() => { setActiveWorkspace(null); setActiveTab("dashboard"); setIsSidebarOpen(false); }} 
                          badgeCount={tasks.filter(t => !t.isDeleted && t.status !== 'completed').length}
                        />
                        {activeWorkspace === null && !isSidebarCollapsed && (
                          <div className={cn(
                            "ml-[24px] mt-1 space-y-0.5 mb-2 overflow-hidden border-l border-border pl-3",
                            activeWorkspace === null && "border-primary/20"
                          )}>
                            <AnimatePresence>
                              {tasks.filter(t => !t.workspaceId && !t.isDeleted && t.status !== 'completed').slice(0, 5).map(task => (
                                <motion.div 
                                  initial={{ opacity: 0, x: -10 }} 
                                  animate={{ opacity: 1, x: 0 }} 
                                  key={task.id} 
                                  className="text-[11px] text-foreground/40 truncate py-1 relative transition-all flex items-center gap-2 group/task cursor-pointer hover:text-foreground"
                                >
                                  <div className="absolute -left-3 w-3 h-[1px] bg-border group-hover/task:bg-linear-to-r from-primary to-accent" />
                                  <div className="w-1 h-1 rounded-full bg-foreground/20 group-hover/task:futuristic-gradient shrink-0 transition-all shadow-[0_0_8px_rgba(var(--primary-rgb),0)] group-hover/task:shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                                  <span className="truncate font-medium text-left">{task.title}</span>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>

                    {workspaces.map((ws, index) => {
                      const wsTaskCount = tasks.filter(t => t.workspaceId === ws.id && !t.isDeleted && t.status !== 'completed').length;
                      return (
                        <div 
                          key={ws.id} 
                          className="group relative"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("workspaceIndex", index.toString());
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            const draggedIdx = e.dataTransfer.getData("workspaceIndex");
                            const hasTaskId = e.dataTransfer.types.includes("taskid");
                            
                            if (draggedIdx && parseInt(draggedIdx) !== index) {
                              e.currentTarget.style.borderTop = "2px solid var(--primary)";
                              e.currentTarget.style.backgroundColor = "rgba(var(--primary-rgb), 0.05)";
                            } else if (hasTaskId) {
                               e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
                            }
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.style.borderTop = "none";
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.style.borderTop = "none";
                            e.currentTarget.style.backgroundColor = "transparent";
                            const workspaceIndexStr = e.dataTransfer.getData("workspaceIndex");
                            const taskId = e.dataTransfer.getData("taskId");
                            
                            if (workspaceIndexStr !== "") {
                              const from = parseInt(workspaceIndexStr);
                              const to = index;
                              if (from !== to) {
                                const newWorkspaces = [...workspaces];
                                const [moved] = newWorkspaces.splice(from, 1);
                                newWorkspaces.splice(to, 0, moved);
                                reorderWorkspaces(newWorkspaces);
                              }
                            } else if (taskId) {
                              handleTaskDrop(taskId, ws.id);
                            }
                          }}
                        >
                          <SidebarItem 
                            label={ws.name} 
                            icon={() => (
                              <div className="relative flex items-center justify-center w-8 h-8 group/folder">
                                <Folder className={cn(
                                  "w-full h-full transition-all",
                                  activeWorkspace === ws.id ? "text-primary fill-primary/20" : "text-foreground/40 group-hover:text-primary group-hover:drop-shadow-[0_0_8px_rgba(2,254,220,0.4)]"
                                )} />
                                <span className={cn(
                                  "absolute top-[11px] font-black text-[10px] uppercase tracking-tighter flex items-center justify-center pointer-events-none",
                                  activeWorkspace === ws.id ? "text-primary-foreground" : "text-foreground/60 group-hover:text-primary"
                                )}>
                                  {ws.name.substring(0, 1)}
                                </span>
                              </div>
                            )} 
                            active={activeWorkspace === ws.id}
                            collapsed={isSidebarCollapsed}
                            onClick={() => { setActiveWorkspace(ws.id); setActiveTab("dashboard"); setIsSidebarOpen(false); }} 
                            onDropTask={(taskId) => handleTaskDrop(taskId, ws.id)}
                            badgeCount={wsTaskCount > 0 ? wsTaskCount : undefined}
                          />
                          {activeWorkspace === ws.id && !isSidebarCollapsed && (
                            <div className="ml-[24px] mt-1 space-y-0.5 mb-2 overflow-hidden border-l border-primary/20 pl-3">
                              <AnimatePresence>
                                {tasks.filter(t => t.workspaceId === ws.id && !t.isDeleted && t.status !== 'completed').slice(0, 5).map(task => (
                                  <motion.div 
                                    initial={{ opacity: 0, x: -10 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    key={task.id} 
                                    draggable
                                    onDragStart={(e) => {
                                      e.stopPropagation();
                                      e.dataTransfer.setData("taskId", task.id);
                                      e.dataTransfer.effectAllowed = "move";
                                    }}
                                    className="text-[11px] text-white/40 truncate py-1 relative transition-all flex items-center gap-2 group/task cursor-grab active:cursor-grabbing hover:text-white"
                                  >
                                    <div className="absolute -left-3 w-3 h-[1px] bg-white/5 group-hover/task:bg-linear-to-r group-hover/task:from-primary group-hover/task:to-accent" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover/task:futuristic-gradient shrink-0 transition-all shadow-[0_0_8px_rgba(var(--primary-rgb),0)] group-hover/task:shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                                    <span className="truncate font-medium text-left">{task.title}</span>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </nav>

                <DropdownMenu>
                  <DropdownMenuTrigger className={cn(
                    "w-full flex flex-col items-center py-4 px-4 bg-card/5 backdrop-blur-3xl border border-border rounded-3xl mt-auto mb-4 transition-all duration-500 hover:bg-card/10 group/user relative outline-none",
                    isSidebarCollapsed ? "p-0 bg-transparent border-none hover:bg-transparent" : ""
                  )}>
                    <div className={cn("flex items-center w-full", isSidebarCollapsed ? "justify-center gap-0" : "gap-3")}>
                      <div className="relative p-[1px] rounded-full group-hover/user:futuristic-gradient transition-all duration-500">
                        <Avatar className={cn(
                          "w-10 h-10 border border-border ring-2 ring-primary/20 group-hover/user:ring-0 transition-all bg-card",
                          isSidebarCollapsed && "w-12 h-12"
                        )}>
                          <AvatarImage src={userProfile.photo || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary font-black text-xs uppercase text-left flex items-center justify-center">
                            {userProfile.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      {!isSidebarCollapsed && (
                        <div className="min-w-0 text-left">
                          <p className="text-sm font-bold text-foreground truncate group-hover/user:text-primary transition-all">{userProfile.name}</p>
                          <p className="text-[9px] text-foreground/30 uppercase tracking-widest font-black">Creator Profile</p>
                        </div>
                      )}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glass-blue-glossy border-white/20 min-w-[240px] p-2 rounded-3xl mb-4 ml-4 shadow-2xl" align="start" side="right" sideOffset={10}>
                    <div className="px-4 py-3 border-b border-white/10 mb-2">
                       <p className="text-[10px] font-black uppercase tracking-widest text-gradient">Biometric ID</p>
                       <p className="text-sm font-bold text-white mt-1 truncate">{userProfile.name}</p>
                    </div>
                    <DropdownMenuItem onClick={() => setActiveTab('dashboard')} className="rounded-2xl py-3 px-4 hover:bg-white/5 cursor-pointer font-bold text-sm gap-3 group/item">
                      <LayoutDashboard className="w-4 h-4 text-blue-400 group-hover/item:text-primary transition-colors" />
                      Orbita Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab('workspaces')} className="rounded-2xl py-3 px-4 hover:bg-white/5 cursor-pointer font-bold text-sm gap-3 group/item">
                      <Layers className="w-4 h-4 text-secondary group-hover/item:text-accent transition-colors" />
                      Workspace Control
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab('settings')} className="rounded-2xl py-3 px-4 hover:bg-white/5 cursor-pointer font-bold text-sm gap-3 group/item">
                      <Settings2 className="w-4 h-4 text-accent group-hover/item:text-primary transition-colors" />
                      User Settings
                    </DropdownMenuItem>
                    <div className="h-[1px] bg-white/5 my-2 mx-2" />
                    <DropdownMenuItem onClick={triggerPurge} className="rounded-2xl py-3 px-4 hover:bg-red-500/10 cursor-pointer font-bold text-sm gap-3 text-red-400">
                      <Trash2 className="w-4 h-4" />
                      Purge Core
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className={cn(
                      "text-foreground/20 hover:text-foreground hover:bg-card/10 h-10 rounded-xl transition-all border border-border",
                      isSidebarCollapsed ? "w-10 mx-auto justify-center p-0" : "w-full px-4 justify-start gap-3"
                    )}
                >
                    <div className="flex items-center justify-center shrink-0">
                      {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </div>
                    {!isSidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Collapse Menu</span>}
                </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 sm:h-20 bg-background/40 border-b border-border px-4 sm:px-6 lg:px-10 flex items-center z-20 backdrop-blur-xl gap-4 sticky top-0 transition-all duration-500">
          {/* Left - Mobile Trigger or Spacer for centering */}
          <div className="flex-none lg:flex-1 flex items-center">
            <Button variant="ghost" size="icon" className="lg:hidden text-foreground/60 hover:bg-card/5 hover:text-foreground" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {/* Center - Search Bar */}
          <div className="flex-1 lg:flex-[3] flex justify-center min-w-0">
            <div className="w-full max-w-lg relative group">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/30 group-focus-within:text-foreground transition-colors" />
              <input 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 h-9 sm:h-10 bg-card/10 border border-border rounded-full focus:outline-none focus:border-primary/50 text-sm transition-all focus:bg-card/20 text-foreground placeholder:text-foreground/20 font-medium shadow-sm"
              />
              
              {/* Search Results Overlay */}
              <AnimatePresence>
                {searchQuery.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-16 left-0 w-full glass-blue-glossy border border-white/20 rounded-3xl p-6 z-50 shadow-2xl max-h-[60vh] overflow-y-auto"
                  >
                    <div className="flex items-center justify-between mb-4 px-2">
                       <h5 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Search Results</h5>
                       <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")} className="h-6 text-[9px] uppercase font-bold text-gradient">Clear</Button>
                    </div>
                    <div className="space-y-2">
                       {filteredTasks.length === 0 ? (
                         <p className="text-sm text-white/20 text-center py-8 italic">No tasks found matching your query.</p>
                       ) : (
                         filteredTasks.slice(0, 5).map(task => (
                           <div 
                            key={task.id} 
                            onClick={() => { setSearchQuery(""); setActiveTab("dashboard"); setActiveWorkspace(task.workspaceId); }}
                            className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/[0.05] transition-all cursor-pointer group"
                           >
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-white group-hover:text-gradient transition-colors">{task.title}</p>
                                <Badge className="text-[8px] bg-white/5 text-white/40">{workspaces.find(w => w.id === task.workspaceId)?.name}</Badge>
                              </div>
                              <p className="text-xs text-white/30 mt-1 line-clamp-1">{task.description}</p>
                           </div>
                         ))
                       )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right - Profile & Notifications & Theme */}
          <div className="flex-none lg:flex-1 flex items-center justify-end gap-2 sm:gap-4 shrink-0">
            <ThemeToggle />
            <DropdownMenu onOpenChange={setIsNotificationsOpen}>
              <DropdownMenuTrigger
                className={cn(
                  "relative hover:bg-card/5 rounded-full w-9 sm:w-10 h-9 sm:h-10 transition-all border border-border flex items-center justify-center outline-none shadow-sm",
                  isNotificationsOpen && "bg-card/10 text-foreground border-primary/20 shadow-lg"
                )}
              >
                <Bell className="w-4.5 h-4.5 text-foreground/60" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 futuristic-gradient text-[8px] sm:text-[10px] flex items-center justify-center font-black text-white rounded-full border-2 border-background shadow-[0_0_15px_rgba(2,254,220,0.5)] animate-bounce-subtle pointer-events-none">
                    {notifications.length}
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                sideOffset={16}
                className="w-[280px] sm:w-80 glass-blue-glossy border-border rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-foreground">System Alerts</h4>
                  <Badge className="bg-primary/10 text-primary border-0 text-[8px] uppercase tracking-widest px-2">{notifications.length} New</Badge>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-none">
                  {notifications.length === 0 ? (
                    <p className="text-[10px] text-foreground/20 text-center py-4 italic">No active alerts detected</p>
                  ) : (
                    notifications.map((n, idx) => (
                      <div key={idx} className="space-y-1 group cursor-pointer border-b border-border pb-3 last:border-0 hover:border-primary/20 transition-colors">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{n.title}</p>
                          <span className="text-[8px] text-foreground/20 font-bold uppercase">{n.time}</span>
                        </div>
                        <p className="text-[10px] text-foreground/40 leading-relaxed truncate">{n.desc}</p>
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <Button 
                    variant="ghost" 
                    onClick={(e) => { e.stopPropagation(); clearNotifications(); }}
                    className="w-full h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-foreground hover:bg-primary/5 transition-colors border border-primary/10 group"
                  >
                    <span className="group-hover:text-primary transition-colors">Clear All Logs</span>
                  </Button>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 sm:gap-3 pl-4 sm:pl-6 border-l border-border h-8 cursor-pointer group outline-none shrink-0">
                <Avatar className="w-8 h-8 sm:w-9 sm:h-9 border border-border bg-card ring-1 ring-border group-hover:ring-primary/20 transition-all shadow-sm">
                  <AvatarImage src={userProfile.photo || undefined} />
                  <AvatarFallback className="bg-card text-foreground/60 font-bold text-[10px] uppercase flex items-center justify-center">
                    {userProfile.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold text-foreground/90 group-hover:text-foreground transition-all whitespace-nowrap">{userProfile.name}</p>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-blue-glossy border-border min-w-[240px] p-2 rounded-[1.5rem] shadow-2xl mt-4" align="end">
                <div className="px-4 py-3 border-b border-border mb-2">
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary">Biometric Identity</p>
                   <h4 className="text-sm font-bold text-foreground mt-1 truncate">{userProfile.name}</h4>
                </div>
                <DropdownMenuItem onClick={() => setActiveTab('dashboard')} className="rounded-xl py-3 px-4 hover:bg-card/10 cursor-pointer font-bold text-xs uppercase tracking-widest gap-3 group/item">
                   <LayoutDashboard className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                   Orbita Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab('workspaces')} className="rounded-xl py-3 px-4 hover:bg-card/10 cursor-pointer font-bold text-xs uppercase tracking-widest gap-3 group/item">
                   <Layers className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                   Workspace Control
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab('settings')} className="rounded-xl py-3 px-4 hover:bg-card/10 cursor-pointer font-bold text-xs uppercase tracking-widest gap-3 group/item">
                   <Settings2 className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
                   User Settings
                </DropdownMenuItem>
                <div className="h-[1px] bg-border my-2 mx-2" />
                <DropdownMenuItem onClick={() => triggerPurge()} className="rounded-xl py-3 px-4 hover:bg-red-500/10 text-red-400 cursor-pointer font-bold text-xs uppercase tracking-widest gap-3">
                   <Power className="w-4 h-4" />
                   Decommission Sync
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Switchable Content */}
        <div className="flex-1 overflow-hidden relative" onClick={() => isNotificationsOpen && setIsNotificationsOpen(false)}>
          <ScrollArea className="h-full w-full">
            <div className="p-4 sm:p-8 pb-32">
              {activeTab === "settings" ? (
                <SettingsSubpage />
              ) : activeTab === "workspaces" ? (
                <WorkspacesView onSelectWorkspace={(id) => { setActiveWorkspace(id); setActiveTab("dashboard"); }} />
              ) : (
                <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
                  {/* Welcome Hero Section */}
                  <section className="relative group">
                    <div className="absolute -inset-1 futuristic-gradient rounded-[2.5rem] blur-2xl opacity-10 group-hover:opacity-20 transition duration-1000" />
                    <div className="relative glass-glossy rounded-[2.5rem] p-8 sm:p-12 overflow-hidden border-border bg-card/10 shadow-xl transition-all duration-500">
                      <div className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none p-8">
                         <OrbitaLogo className="w-48 h-48 sm:w-64 sm:h-64 rotate-12" />
                      </div>
                      <div className="relative z-10 space-y-6">
                        <div className="space-y-2">
                          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-medium tracking-tight text-foreground leading-[1.1]">
                            Good morning, <br />
                            <span className="text-gradient font-bold drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">{userProfile.name}</span>
                          </h2>
                        </div>
                        <p className="text-foreground/40 text-lg sm:text-xl font-medium max-w-xl leading-relaxed">
                          Your AI-powered creative engine is locked in. Focus is sharp, execution is effortless.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                    {stats.map((stat, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="p-6 sm:p-8 rounded-[2rem] glass border-border flex items-center justify-between group hover:border-primary/20 hover:bg-card transition-all duration-500 relative overflow-hidden shadow-xl"
                      >
                        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="space-y-1.5 relative z-10">
                          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/30 group-hover:text-foreground/50 transition-colors">{stat.label}</p>
                          <p className={`text-3xl sm:text-4xl font-display font-black tabular-nums tracking-tight ${stat.label === "Active Tasks" ? "text-gradient" : "text-foreground"}`}>{stat.value}</p>
                        </div>
                        <div className={cn(
                          "w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-card flex items-center justify-center border border-border group-hover:bg-card-foreground/10 group-hover:scale-110 transition-all duration-700 relative shadow-inner overflow-hidden",
                          stat.label === "Active Tasks" && "group-hover:border-primary/50 group-hover:glow-primary"
                        )}>
                          <stat.icon className={cn(
                            "w-6 h-6 sm:w-8 sm:h-8 transition-all duration-500",
                            stat.label === "Active Tasks" ? "stroke-[url(#futuristic-gradient)]" : "text-foreground opacity-60 group-hover:opacity-100"
                          )} />
                          {stat.label === "Active Tasks" && (
                            <svg width="0" height="0" className="absolute">
                              <defs>
                                <linearGradient id="futuristic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#02FEDC" />
                                  <stop offset="50%" stopColor="#5A5CFF" />
                                  <stop offset="100%" stopColor="#F502FD" />
                                </linearGradient>
                              </defs>
                            </svg>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* AI Suggestions Row Removed */}

                    {/* Task Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 pt-4">
                      <div className="lg:col-span-3 space-y-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                          <div className="space-y-2">
                            <h3 className="text-3xl font-display font-black text-foreground tracking-tight">{activeTab === 'completed' ? 'Synced Tasks' : 'Active Tasks'}</h3>
                            <p className="text-base text-foreground/40 font-medium">{activeTab === 'completed' ? 'Successfully archived workflows' : 'Ongoing tasks within the system'}</p>
                          </div>
                          <div className="flex gap-4">
                            {activeTab === 'completed' && filteredTasks.length > 0 && (
                              <Button 
                                variant="ghost" 
                                onClick={() => {
                                  confirmAction({
                                    title: "Dump Completed Cycles?",
                                    description: "You are about to permanently purge all successfully synchronized nodes from the system registry.",
                                    impact: "Clean slate for current workflow sector. No recovery possible once purged.",
                                    confirmText: "Purge Synced Tasks",
                                    onConfirm: () => {
                                      const completedTasks = tasks.filter(t => t.status === 'completed' && !t.isDeleted);
                                      completedTasks.forEach(t => deleteTask(t.id));
                                    }
                                  });
                                }}
                                className="text-[11px] font-black uppercase tracking-widest h-10 px-6 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 shadow-lg shadow-red-500/5 transition-all"
                              >
                                Decommission Synced Tasks
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-[11px] font-black uppercase tracking-widest h-10 px-6 rounded-xl border border-border bg-card/5 hover:bg-card/20 shadow-sm transition-all")}>Sort By: Priority</DropdownMenuTrigger>
                              <DropdownMenuContent className="glass-blue-glossy border-border text-foreground p-2 rounded-2xl shadow-2xl backdrop-blur-3xl min-w-[160px]">
                                <DropdownMenuItem className="hover:bg-card/10 cursor-pointer rounded-xl font-bold py-2.5">Priority</DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-card/10 cursor-pointer rounded-xl font-bold py-2.5">Date Created</DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-card/10 cursor-pointer rounded-xl font-bold py-2.5">Status</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <TaskList tasks={filteredTasks} />
                      </div>
  
                      {/* Sidebar History */}
                      <div className="space-y-12">
                        <section>
                          <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
                            <h3 className="text-lg font-display font-bold text-foreground tracking-tight uppercase">System Registry</h3>
                          </div>
                          <div className="space-y-6">
                            {tasks.filter(t => !t.isDeleted).slice(0, 8).map(task => (
                              <div key={task.id} className="flex items-center gap-5 group cursor-pointer">
                                <div className={`w-1.5 h-8 rounded-full ${task.status === 'completed' ? 'futuristic-gradient shadow-[0_0_10px_rgba(2,254,220,0.5)]' : 'bg-card border border-border group-hover:border-primary/50'} transition-all duration-300`} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold truncate group-hover:text-primary transition-colors text-foreground/80 uppercase tracking-tight">{task.title}</p>
                                  <p className="text-[9px] text-foreground/20 uppercase tracking-[0.2em] font-black mt-0.5">Node: {task.status.toUpperCase()}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-foreground/10 group-hover:text-foreground transition-all transform group-hover:translate-x-1" />
                              </div>
                            ))}
                          </div>
                        </section>
                      </div>
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        {/* Floating Quick Add */}
        <div className={cn(
          "fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-40 w-full px-4 transition-all duration-500",
          isAddingTask ? "max-w-3xl" : "max-w-md"
        )}>
           {isAddingTask ? (
             <motion.form 
               initial={{ y: 20, opacity: 0, scale: 0.98 }}
               animate={{ y: 0, opacity: 1, scale: 1 }}
               onSubmit={handleQuickAdd}
               className="glass-blue-glossy rounded-[2rem] p-5 sm:p-6 flex flex-col gap-5 border-border shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-4 sm:p-5 z-10">
                   <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsAddingTask(false)}
                    className="text-foreground/20 hover:text-foreground h-7 w-7 rounded-full"
                   >
                    <X className="w-4 h-4" />
                   </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 rounded-full futuristic-gradient shadow-[0_0_10px_rgba(2,244,220,0.5)]" />
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground/40">New Workflow Cycle</h3>
                  </div>
                  
                  <div className="bg-card/60 backdrop-blur-2xl border border-border rounded-2xl sm:rounded-[2rem] p-1 sm:p-2 shadow-inner group/neural">
                    <textarea 
                      autoFocus
                      placeholder="Input neural data..."
                      value={quickTaskTitle}
                      onChange={(e) => setQuickTaskTitle(e.target.value)}
                      className="w-full bg-transparent border-none focus:outline-none text-foreground font-medium p-3 sm:p-4 text-base sm:text-lg min-h-[100px] sm:min-h-[120px] max-h-[300px] scrollbar-none placeholder:text-foreground/10 resize-none group-focus-within/neural:placeholder:text-foreground/20 transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-3 bg-card/5 px-4 sm:px-6 rounded-[1.2rem] sm:rounded-[1.5rem] border border-border focus-within:border-primary/40 focus-within:bg-card/10 transition-all shadow-xl h-12 sm:h-14 w-full sm:w-auto group/qdate">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover/qdate:scale-110 transition-transform" />
                    <input 
                      type="date"
                      value={quickTaskDueDate}
                      onChange={(e) => setQuickTaskDueDate(e.target.value)}
                      className="bg-transparent text-[10px] sm:text-xs uppercase font-black text-foreground/60 group-focus-within/qdate:text-foreground border-none outline-none py-2 cursor-pointer dark-calendar-picker flex-1 min-w-0"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20 hidden lg:block">Deadline</span>
                  </div>

                  <div className="flex items-center gap-4 ml-auto w-full sm:w-auto">
                    <Button 
                      type="submit"
                      disabled={!quickTaskTitle.trim()}
                      className="flex-1 sm:flex-none h-12 sm:h-14 px-8 sm:px-10 rounded-xl sm:rounded-2xl futuristic-gradient text-white border-0 shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all font-black uppercase tracking-widest text-[9px] sm:text-[10px] gap-3"
                    >
                      <span>Instantiate Task</span>
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 px-1 pt-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20 mr-2">Target Sector:</span>
                  {workspaces.map(ws => (
                    <button
                      key={ws.id}
                      type="button"
                      onClick={() => setActiveWorkspace(ws.id)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                        activeWorkspace === ws.id 
                          ? "futuristic-gradient text-white shadow-lg shadow-primary/20" 
                          : "bg-card/5 text-foreground/30 border border-border hover:bg-card/10"
                      )}
                    >
                      {ws.name}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setActiveWorkspace(null)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                      activeWorkspace === null 
                        ? "futuristic-gradient text-white shadow-lg shadow-primary/20" 
                        : "bg-card/5 text-foreground/30 border border-border hover:bg-card/10"
                    )}
                  >
                    Orbita Core
                  </button>
                </div>
             </motion.form>
           ) : (
             <Button 
               onClick={() => setIsAddingTask(true)}
               className="w-full h-14 sm:h-16 rounded-[2rem] glass-blue-glossy border-border text-foreground shadow-2xl shadow-primary/10 group transition-all hover:scale-[1.02] hover:border-primary/20 flex items-center justify-between px-8 relative overflow-hidden"
             >
                <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-2 rounded-xl bg-card border border-border group-hover:border-primary/50 transition-all shadow-inner">
                    <Plus className="w-5 h-5 text-primary group-hover:rotate-90 transition-transform shrink-0" />
                  </div>
                  <span className="font-bold text-base sm:text-lg tracking-tight text-foreground/90 group-hover:text-primary transition-all">Initiate New Task Cycle</span>
                </div>
                <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-all hidden sm:flex relative z-10">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 group-hover:text-foreground">Active Uplink</span>
                </div>
             </Button>
           )}
        </div>

        {/* AI Assistant Floating Widget */}
        <AIAssistant />

        {/* Global Confirmation Modal */}
        <AnimatePresence>
          {isConfirmOpen && confirmOptions && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeConfirm}
                className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg glass-blue-glossy rounded-[3rem] p-10 border-border shadow-[0_0_100px_rgba(90,92,255,0.15)] space-y-8 overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />
                
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground tracking-tight">{confirmOptions.title}</h3>
                  <p className="text-foreground/50 text-lg leading-relaxed">{confirmOptions.description}</p>
                </div>

                {confirmOptions.impact && (
                  <div className="p-6 rounded-2xl bg-card border border-border">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 mb-2">Impact Assessment</div>
                    <p className="text-sm font-medium text-red-500/80">{confirmOptions.impact}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    onClick={closeConfirm}
                    variant="ghost"
                    className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-foreground/40 hover:bg-card/10"
                  >
                    Abort Action
                  </Button>
                  <Button 
                    onClick={() => {
                      confirmOptions.onConfirm();
                      closeConfirm();
                    }}
                    className="flex-1 h-14 rounded-2xl futuristic-gradient text-white border-0 font-bold uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    {confirmOptions.confirmText}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

const SidebarItem = React.memo(function SidebarItem({ 
  icon: Icon, 
  label, 
  active, 
  onClick, 
  collapsed,
  onDropTask,
  badgeCount
}: { 
  icon: any, 
  label: string, 
  active?: boolean, 
  onClick: () => void, 
  collapsed?: boolean,
  onDropTask?: (taskId: string) => void,
  badgeCount?: number
}) {
  const [isOver, setIsOver] = useState(false);

  const renderIcon = () => {
    if (typeof Icon === 'function' && Icon.length === 0) {
      // It's a custom element generator like () => <div />
      return <Icon />;
    }
    // It's a standard Lucide component
    return <Icon className={cn("w-7 h-7 shrink-0 transition-colors", active ? "text-white" : "group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(2,254,220,0.5)]")} />;
  };

  return (
    <div 
      className="relative w-full"
      onDragOver={(e) => {
        if (onDropTask) {
          e.preventDefault();
          const isWorkspaceDrag = e.dataTransfer.types.includes("workspaceindex");
          if (!isWorkspaceDrag) {
            setIsOver(true);
          }
        }
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        if (onDropTask) {
          e.preventDefault();
          setIsOver(false);
          const taskId = e.dataTransfer.getData("taskId");
          if (taskId) onDropTask(taskId);
        }
      }}
    >
      <button 
        onClick={onClick}
        title={collapsed ? label : ""}
        className={cn(
          "w-full flex items-center gap-3 py-3 rounded-xl transition-all duration-300 group relative",
          active 
            ? "futuristic-gradient text-white shadow-lg shadow-primary/20" 
            : "text-foreground/50 hover:text-foreground hover:bg-card/40 hover:border-border",
          collapsed ? "justify-center px-0" : "px-4",
          isOver && "border-2 border-primary/50 bg-primary/5 scale-[1.02]"
        )}
      >
        {renderIcon()}
        {!collapsed && <span className="font-medium text-sm truncate flex-1 text-left">{label}</span>}
        {!collapsed && badgeCount !== undefined && (
          <span className={cn(
            "text-[9px] font-bold px-1.5 py-0.5 rounded-full transition-colors",
            active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-card/50 text-foreground/30 group-hover:bg-card group-hover:text-foreground"
          )}>
            {badgeCount}
          </span>
        )}
        {isOver && (
          <motion.div 
            layoutId="drop-glow"
            className="absolute inset-0 rounded-xl bg-primary/10 animate-pulse pointer-events-none"
          />
        )}
      </button>
    </div>
  );
});
