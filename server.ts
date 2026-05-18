import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Gemini Initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const MODELS = [
  "gemini-3-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
];

async function generateWithFallback(options: any) {
  let lastError: any;
  for (const model of MODELS) {
    try {
      console.log(`Neural Link: Attempting synthesis with ${model}...`);
      const response = await ai.models.generateContent({
        ...options,
        model: model,
      });
      return response;
    } catch (error: any) {
      lastError = error;
      const errorMsg = (error.message || "").toLowerCase();
      const statusCode = error.status || error.code || 0;
      
      const isQuota = statusCode === 429 || 
                     errorMsg.includes('429') || 
                     errorMsg.includes('resource_exhausted') || 
                     errorMsg.includes('quota') ||
                     errorMsg.includes('limit reached');
                     
      const isNotFound = statusCode === 404 || 
                        errorMsg.includes('404') || 
                        errorMsg.includes('not_found') || 
                        errorMsg.includes('not supported') ||
                        errorMsg.includes('not found');
      
      if (isQuota || isNotFound) {
        console.warn(`Neural Link: ${model} ${isQuota ? 'rate limited' : 'unavailable'}. Re-routing to peer node...`);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

/**
 * AI Complex Decomposition Endpoint
 */
app.post("/api/ai/decompose", async (req, res) => {
  try {
    const { input, userProfile } = req.body;
    if (!input) {
      return res.status(400).json({ error: "input is required" });
    }

    const systemContext = userProfile ? `User Profile: Name: ${userProfile.name}, Bio: ${userProfile.bio}.` : "User Profile: Not provided.";

    const response = await generateWithFallback({
      contents: `${systemContext}
      Act as the Orbita AI Neural Architect. You are analyzing a high-volume data stream.
      
      STEP 1: CONTEXT INFERENCE
      Analyze the input stream to infer the Industry, Project Type, and User's Role if not explicitly stated. Use this inferred context to tailor the task decomposition.
      
      STEP 2: PROJECT MAPPING
      Define a high-level "Sector" (Workspace) name that encapsulates this entire stream. If it's a meeting, name it after the project/topic discussed.
      
      STEP 3: NODAL DECOMPOSITION
      Extract a set of organized, actionable, and significant tasks (Nodes). 
      - Distinguish between "Action Items" (direct tasks) and "Strategic Goals".
      - For meeting transcripts: Identify specific stakeholders (people) mentioned and assign them to tasks.
      - Dependency Mapping: Identify if a task logically must follow another.
      - Ensure tasks are significant. Merge minor, related points into cohesive work packages.
      
      Input Stream: "${input}"
      
      For each Node (Task) identified: 
      1. title: Imperative, clear title.
      2. description: Detail the 'Why' and the 'Consensus' or 'Reasoning' behind the task.
      3. subtasks: A comprehensive, step-by-step checklist for execution.
      4. priority: Scale of urgency [Low, Medium, High, Critical].
      5. complexity: Numeric value [1-5] representing operational difficulty.
      6. estimatedTime: A human-readable estimate (e.g., "4h", "2d", "15m").
      7. tags: 2-3 specific, relevant technical or functional tags.
      8. stakeholders: Array of names identified as relevant to this task.
      9. dependencies: Array of other task titles this depends on.
      
      STEP 4: STRATEGIC SYNTHESIS
      Provide a 'strategicBrief' which is a short (2-sentence max) executive summary of the workload's core objective.
      
      Response Format: JSON object with 'suggestedWorkspaceName', 'strategicBrief', and an array of 'tasks'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedWorkspaceName: { type: Type.STRING },
            strategicBrief: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  subtasks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  priority: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
                  complexity: { type: Type.NUMBER },
                  estimatedTime: { type: Type.STRING },
                  tags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  stakeholders: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  dependencies: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["title", "description", "subtasks", "priority", "complexity", "estimatedTime", "tags"]
              }
            }
          },
          required: ["suggestedWorkspaceName", "strategicBrief", "tasks"]
        }
      }
    });

    const result = JSON.parse(response.text);
    res.json(result);
  } catch (error: any) {
    console.error("AI Decomposition Error:", error);
    const statusCode = error.status || error.code || 500;
    if (statusCode === 429 || error.message?.includes('429')) {
      return res.status(429).json({ error: "AI Neural Core is busy. Please wait 60 seconds." });
    }
    res.status(500).json({ error: "Failed to decompose input" });
  }
});

/**
 * AI Task Expansion Endpoint
 */
app.post("/api/ai/expand-task", async (req, res) => {
  try {
    const { taskTitle, userProfile } = req.body;
    if (!taskTitle) {
      return res.status(400).json({ error: "taskTitle is required" });
    }

    const systemContext = userProfile ? `User Context: ${userProfile.name}, bio: ${userProfile.bio}. Industry: ${userProfile.industry || 'General'}.` : "";

    const response = await generateWithFallback({
      contents: `${systemContext} Create a detailed execution plan for the following task: "${taskTitle}". 
      Break it down into actionable subtasks, provide a brief summary, suggest a priority (Low, Medium, High, Critical), estimate its complexity (1-5), and estimated duration.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            subtasks: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            priority: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
            complexity: { type: Type.NUMBER },
            estimatedTime: { type: Type.STRING }
          },
          required: ["summary", "subtasks", "priority", "complexity", "estimatedTime"]
        }
      }
    });

    const result = JSON.parse(response.text);
    res.json(result);
  } catch (error: any) {
    console.error("AI Expansion Error:", error);
    const statusCode = error.status || error.code || 500;
    if (statusCode === 429 || error.message?.includes('429')) {
      return res.status(429).json({ error: "AI Resources Exhausted. Please wait a moment." });
    }
    res.status(500).json({ error: "Failed to generate AI plan" });
  }
});

async function chatWithFallback(options: { message: string; context?: any }) {
  let lastError: any;
  for (const model of MODELS) {
    try {
      console.log(`Neural Link: Chat uplink with ${model}...`);
      const chat = ai.chats.create({
        model: model,
        config: {
          systemInstruction: "You are the Orbita AI Neural Core, a high-end productivity AI assistant. You help users optimize their workflows, break down complex projects into actionable nodes, and maintain peak operational efficiency. You are professional, futuristic, and highly actionable. Context: " + JSON.stringify(options.context || {}),
        },
      });
      const response = await chat.sendMessage({ message: options.message });
      return response;
    } catch (error: any) {
      lastError = error;
      const errorMsg = (error.message || "").toLowerCase();
      const statusCode = error.status || error.code || 0;
      
      const isQuota = statusCode === 429 || 
                     errorMsg.includes('429') || 
                     errorMsg.includes('resource_exhausted') || 
                     errorMsg.includes('quota') ||
                     errorMsg.includes('limit reached');
                     
      const isNotFound = statusCode === 404 || 
                        errorMsg.includes('404') || 
                        errorMsg.includes('not_found') || 
                        errorMsg.includes('not supported') ||
                        errorMsg.includes('not found');
      
      if (isQuota || isNotFound) {
        console.warn(`Neural Link: Chat node ${model} ${isQuota ? 'rate limited' : 'unavailable'}. Re-routing uplink...`);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

/**
 * AI Assistant Chat Endpoint
 */
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, context } = req.body;
    
    const response = await chatWithFallback({ message, context });
    res.json({ response: response.text });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    const statusCode = error.status || error.code || 500;
    if (statusCode === 429 || error.message?.includes('429')) {
      return res.status(429).json({ error: "Assistant busy (Quota Limit). Please retry shortly." });
    }
    res.status(500).json({ error: "AI Assistant unavailable" });
  }
});

/**
 * Productivity Insights Endpoint
 */
app.post("/api/ai/insights", async (req, res) => {
  try {
    const { taskHistory } = req.body;
    
    const response = await generateWithFallback({
      contents: "Analyze this task history and provide 3 smart productivity insights and a 'Focus Score' (1-100). Task History: " + JSON.stringify(taskHistory),
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            focusScore: { type: Type.NUMBER },
            recommendation: { type: Type.STRING }
          },
          required: ["insights", "focusScore", "recommendation"]
        }
      }
    });

    res.json(JSON.parse(response.text));
  } catch (error: any) {
    console.error("AI Insights Error:", error);
    const statusCode = error.status || error.code || 500;
    if (statusCode === 429 || error.message?.includes('429')) {
      return res.status(429).json({ error: "Insights engine on cooldown (Quota). Try again later." });
    }
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

/**
 * AI Neural Synthesis Endpoint
 * Provides a high-level briefing of the current system state.
 */
app.post("/api/ai/synthesis", async (req, res) => {
  try {
    const { tasks, workspaces, userProfile } = req.body;
    
    const response = await generateWithFallback({
      contents: `User: ${userProfile?.name}. Bio: ${userProfile?.bio}.
      Analyze the following system state and provide a concise 'Neural Briefing'.
      - Identify bottlenecks or overdue priorities.
      - Suggest the top 3 high-impact actions for today.
      - Provide a motivational 'Operator Directive'.
      
      State: Workspaces: ${JSON.stringify(workspaces)}, Tasks: ${JSON.stringify(tasks.filter((t: any) => !t.isDeleted))}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            briefing: { type: Type.STRING },
            topActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            directive: { type: Type.STRING }
          },
          required: ["briefing", "topActions", "directive"]
        }
      }
    });

    res.json(JSON.parse(response.text));
  } catch (error: any) {
    console.error("AI Synthesis Error:", error);
    const statusCode = error.status || error.code || 500;
    if (statusCode === 429 || error.message?.includes('429')) {
      return res.status(429).json({ 
        error: "Neural Link Quota Exceeded", 
        message: "The AI Core is cooling down. Please retry in a few moments." 
      });
    }
    res.status(500).json({ error: "Synthesis engine offline" });
  }
});


// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
