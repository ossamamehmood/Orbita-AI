export type Status = 'todo' | 'in-progress' | 'completed' | 'archived';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  ownerId: string;
  workspaceId: string;
  folderId?: string;
  title: string;
  description: string;
  aiSummary?: string;
  status: Status;
  priority: Priority;
  dueDate?: string;
  progress: number;
  tags: string[];
  subtasks: Subtask[];
  aiExecutionPlan?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  icon?: string;
  gradient?: string;
  createdAt: string;
}

export interface Folder {
  id: string;
  workspaceId: string;
  name: string;
  ownerId: string;
  icon?: string;
  color?: string;
  createdAt: string;
}

export interface AIPlan {
  summary: string;
  subtasks: string[];
  priority: Priority;
  estimatedHours: number;
}
