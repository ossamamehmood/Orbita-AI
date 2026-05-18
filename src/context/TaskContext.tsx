import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { Task, Workspace, Folder } from "@/types";
import { toast } from "sonner";

export interface SystemNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'system' | 'ai' | 'security';
}

export interface UserProfile {
  name: string;
  photo: string;
  bio: string;
  isFirstTime: boolean;
}

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText: string;
  impact?: string;
  onConfirm: () => void;
}

interface TaskContextType {
  tasks: Task[];
  workspaces: Workspace[];
  folders: Folder[];
  notifications: SystemNotification[];
  userProfile: UserProfile;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetSystem: () => void;
  createWorkspace: (name: string) => Promise<Workspace>;
  deleteWorkspace: (id: string, deleteTasks?: boolean) => Promise<void>;
  moveTaskToWorkspace: (taskId: string, workspaceId: string) => Promise<void>;
  createTask: (taskData: Partial<Task>) => Promise<Task | null>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  expandTaskAI: (taskId: string) => Promise<void>;
  decomposeComplexInputAI: (input: string, workspaceId?: string) => Promise<void>;
  clearNotifications: () => void;
  confirmAction: (options: ConfirmOptions) => void;
  isConfirmOpen: boolean;
  confirmOptions: ConfirmOptions | null;
  closeConfirm: () => void;
  reorderWorkspaces: (newOrder: Workspace[]) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Ossama",
    photo: "",
    bio: "Neural systems operator.",
    isFirstTime: true
  });
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState<Folder[]>([]);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions | null>(null);

  const confirmAction = React.useCallback((options: ConfirmOptions) => {
    setConfirmOptions(options);
    setIsConfirmOpen(true);
  }, []);

  const closeConfirm = React.useCallback(() => setIsConfirmOpen(false), []);
  
  const reorderWorkspaces = React.useCallback((newOrder: Workspace[]) => {
    setWorkspaces(newOrder);
    localStorage.setItem('omx_workspaces', JSON.stringify(newOrder));
  }, []);

  useEffect(() => {
    const savedTasks = localStorage.getItem('omx_tasks');
    const savedWorkspaces = localStorage.getItem('omx_workspaces');
    const savedProfile = localStorage.getItem('omx_profile');
    
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        setTasks([]);
      }
    }
    
    if (savedWorkspaces) {
      try {
        setWorkspaces(JSON.parse(savedWorkspaces));
      } catch (e) {
        setWorkspaces([{ id: 'ws1', name: 'Orbita Core', ownerId: 'local', createdAt: new Date().toISOString() }]);
      }
    } else {
      const defaultWS = [{ id: 'ws1', name: 'Orbita Core', ownerId: 'local', createdAt: new Date().toISOString() }];
      setWorkspaces(defaultWS);
      localStorage.setItem('omx_workspaces', JSON.stringify(defaultWS));
    }

    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Profile parse failed");
      }
    }

    setLoading(false);
    
    // Add welcome notifications if empty and first time
    if (notifications.length === 0) {
      addNotification('System Online', 'Orbita AI neural core initialized and ready.', 'system');
      addNotification('AI Assistant Active', 'Orbita AI is ready to orchestrate your workflow.', 'ai');
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('omx_tasks', JSON.stringify(tasks));
      localStorage.setItem('omx_workspaces', JSON.stringify(workspaces));
      localStorage.setItem('omx_profile', JSON.stringify(userProfile));
    }
  }, [tasks, workspaces, userProfile, loading]);

  const updateProfile = React.useCallback((updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const resetSystem = React.useCallback(() => {
    localStorage.clear();
    setTasks([]);
    setWorkspaces([]);
    setNotifications([]);
    setUserProfile({
      name: "Operator",
      photo: "",
      bio: "Neural systems operator.",
      isFirstTime: true
    });
    
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, []);

  const addNotification = React.useCallback((title: string, desc: string, type: SystemNotification['type'] = 'system') => {
    const newNote: SystemNotification = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      desc,
      time: 'Just now',
      type
    };
    setNotifications(prev => [newNote, ...prev].slice(0, 10)); // Keep last 10
  }, []);

  // Periodic check for due tasks
  useEffect(() => {
    const notifiedTasks = new Set<string>();
    
    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach(task => {
        if (task.dueDate && !task.isDeleted && task.status !== 'completed' && !notifiedTasks.has(task.id)) {
          const dueDate = new Date(task.dueDate);
          if (dueDate < now) {
            notifiedTasks.add(task.id);
            addNotification('Task Overdue', `"${task.title}" is past its deadline.`, 'security');
          }
        }
      });
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks, addNotification]);

  const clearNotifications = React.useCallback(() => setNotifications([]), []);

  const createWorkspace = React.useCallback(async (name: string) => {
    const gradients = [
      'from-primary to-accent',
      'from-blue-500 to-cyan-400',
      'from-purple-500 to-pink-500',
      'from-emerald-400 to-cyan-500',
      'from-orange-400 to-red-500'
    ];
    
    const newWS: Workspace = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      ownerId: 'local',
      createdAt: new Date().toISOString(),
      icon: name.substring(0, 1).toUpperCase(),
      gradient: gradients[workspaces.length % gradients.length]
    };
    setWorkspaces(prev => [...prev, newWS]);
    addNotification('Workspace Created', `New workspace "${name}" operational.`, 'system');
    toast.success('Workspace created');
    return newWS;
  }, [workspaces.length, addNotification]);

  const deleteWorkspace = React.useCallback(async (id: string, deleteTasks: boolean = false) => {
    if (workspaces.length <= 1) {
      toast.error('Cannot delete the last workspace');
      return;
    }
    const targetWorkspace = workspaces.find(ws => ws.id !== id);
    if (!targetWorkspace) return;

    setWorkspaces(prev => prev.filter(ws => ws.id !== id));
    
    if (deleteTasks) {
      setTasks(prev => prev.map(t => 
        t.workspaceId === id ? { ...t, isDeleted: true, updatedAt: new Date().toISOString() } : t
      ));
      addNotification('Workspace Deleted', `The workspace and its tasks have been removed.`, 'security');
    } else {
      setTasks(prev => prev.map(t => 
        t.workspaceId === id ? { ...t, workspaceId: targetWorkspace.id } : t
      ));
      addNotification('Workspace Removed', `Office moved to ${targetWorkspace.name}.`, 'security');
    }
    
    toast.info(deleteTasks ? 'Workspace and tasks purged' : 'Workspace removed');
  }, [workspaces, addNotification]);

  const moveTaskToWorkspace = React.useCallback(async (taskId: string, workspaceId: string) => {
    setTasks(prev => {
        const task = prev.find(t => t.id === taskId);
        const ws = workspaces.find(w => w.id === workspaceId);
        if (!task || !ws) return prev;
        
        addNotification('Task Reassigned', `"${task.title}" moved to ${ws.name}.`, 'system');
        toast.success(`Moved to ${ws.name}`);
        
        return prev.map(t => 
          t.id === taskId ? { ...t, workspaceId, updatedAt: new Date().toISOString() } : t
        );
    });
  }, [workspaces, addNotification]);

  const createTask = React.useCallback(async (taskData: Partial<Task>) => {
    try {
      const newTask: Task = {
        id: Math.random().toString(36).substring(2, 9),
        title: taskData.title || 'Untitled Task',
        description: taskData.description || '',
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate,
        progress: 0,
        ownerId: 'local',
        workspaceId: taskData.workspaceId || (workspaces[0]?.id || 'ws1'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false,
        subtasks: taskData.subtasks || [],
        tags: taskData.tags || [],
      };
      setTasks(prev => [newTask, ...prev]);
      addNotification('Task Created', `New task "${newTask.title}" instantiated.`, 'system');
      toast.success('Task created successfully');
      return newTask;
    } catch (e) {
      toast.error('Failed to create task');
      return null;
    }
  }, [workspaces, addNotification]);

  const updateTask = React.useCallback(async (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => {
      const taskIndex = prev.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prev;
      
      const updatedTasks = [...prev];
      const oldTask = updatedTasks[taskIndex];
      const newTask = { ...oldTask, ...updates, updatedAt: new Date().toISOString() };
      updatedTasks[taskIndex] = newTask;
      
      // If completed, add notification
      if (updates.status === 'completed' && oldTask.status !== 'completed') {
        addNotification('Cycle Completed', `Neural Task "${oldTask.title}" synchronized.`, 'system');
      }
      
      return updatedTasks;
    });
  }, [addNotification]);

  const deleteTask = React.useCallback(async (taskId: string) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (!task) return prev;
      
      addNotification('Task Deleted', `"${task.title}" has been moved to trash.`, 'security');
      toast.info('Task moved to trash');
      
      return prev.map(t => 
        t.id === taskId ? { ...t, isDeleted: true, updatedAt: new Date().toISOString() } : t
      );
    });
  }, [addNotification]);

  const expandTaskAI = React.useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    toast.promise(async () => {
      const response = await fetch("/api/ai/expand-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskTitle: task.title, userProfile }),
      });
      
      if (!response.ok) throw new Error("AI Assistant unreachable");
      
      const data = await response.json();
      
      const newSubtasks = data.subtasks.map((st: string) => ({
        id: Math.random().toString(36).substring(2, 6),
        title: st,
        completed: false
      }));

      await updateTask(taskId, {
        description: data.summary,
        subtasks: [...(task.subtasks || []), ...newSubtasks],
        priority: data.priority.toLowerCase() as any,
        aiSummary: "Enriched by Orbita AI"
      });
      addNotification('AI Breakdown', `Task "${task.title}" expanded with ${data.subtasks.length} new sub-cycles.`, 'ai');
    }, {
      loading: 'AI Engine orchestrating task breakdown...',
      success: 'Task neural-mapped successfully',
      error: 'AI Expansion failed',
    });
  }, [tasks, userProfile, updateTask, addNotification]);

  const decomposeComplexInputAI = React.useCallback(async (input: string, workspaceId?: string) => {
    if (!input.trim()) return;

    toast.promise(async () => {
      const response = await fetch("/api/ai/decompose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, userProfile }),
      });
      
      if (!response.ok) throw new Error("AI Assistant unreachable");
      
      const { suggestedWorkspaceName, tasks: tasksToCreate } = await response.json();
      
      let targetWorkspaceId = workspaceId;

      // Logic: If more than 3 tasks or if no workspace ID was provided, create a dedicated workspace
      // This ensures large project inputs get their own creative folder
      if (tasksToCreate.length >= 4 || !targetWorkspaceId) {
        const newWS = await createWorkspace(suggestedWorkspaceName || "Neural Project Sector");
        targetWorkspaceId = newWS.id;
      }
      
      for (const t of tasksToCreate) {
        await createTask({
          title: t.title,
          description: t.description,
          priority: t.priority.toLowerCase() as any,
          workspaceId: targetWorkspaceId,
          subtasks: t.subtasks.map((st: string) => ({
            id: Math.random().toString(36).substring(2, 6),
            title: st,
            completed: false
          }))
        });
      }

      addNotification('Neural Decomposition', `Decomposed input into ${tasksToCreate.length} tasks within "${suggestedWorkspaceName}".`, 'ai');
    }, {
      loading: 'Orbita AI orchestrating neural decomposition...',
      success: 'Neural mapping complete. Workspace synchronized.',
      error: 'Decomposition failed',
    });
  }, [userProfile, createWorkspace, createTask, addNotification]);

  const contextValue = React.useMemo(() => ({ 
    tasks, 
    workspaces, 
    folders, 
    notifications,
    userProfile,
    loading, 
    updateProfile,
    resetSystem,
    createWorkspace,
    deleteWorkspace,
    moveTaskToWorkspace,
    createTask, 
    updateTask, 
    deleteTask, 
    expandTaskAI,
    decomposeComplexInputAI,
    clearNotifications,
    confirmAction,
    isConfirmOpen,
    confirmOptions,
    closeConfirm,
    reorderWorkspaces
  }), [
    tasks, workspaces, folders, notifications, userProfile, loading, 
    updateProfile, resetSystem, createWorkspace, deleteWorkspace, 
    moveTaskToWorkspace, createTask, updateTask, deleteTask, 
    expandTaskAI, decomposeComplexInputAI, clearNotifications, 
    confirmAction, isConfirmOpen, confirmOptions, closeConfirm, 
    reorderWorkspaces
  ]);

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}
