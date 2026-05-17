export interface AIInsight {
  insights: string[];
  focusScore: number;
  recommendation: string;
}

export interface TaskExpansion {
  summary: string;
  subtasks: string[];
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  estimatedHours: number;
}

export const aiService = {
  async getInsights(taskHistory: any): Promise<AIInsight> {
    const response = await fetch("/api/ai/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskHistory }),
    });
    if (!response.ok) throw new Error("AI unavailable");
    return response.json();
  },

  async expandTask(taskTitle: string): Promise<TaskExpansion> {
    const response = await fetch("/api/ai/expand-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskTitle }),
    });
    if (!response.ok) throw new Error("AI expansion failed");
    return response.json();
  },

  async chat(message: string, context?: any): Promise<string> {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context }),
    });
    if (!response.ok) throw new Error("Chat unavailable");
    const data = await response.json();
    return data.response;
  }
};
