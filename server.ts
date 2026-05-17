import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Gemini Initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

/**
 * AI Complex Decomposition Endpoint
 */
app.post("/api/ai/decompose", async (req, res) => {
  try {
    const { input, userProfile } = req.body;
    if (!input) {
      return res.status(400).json({ error: "input is required" });
    }

    const systemContext = userProfile ? `User Context: ${userProfile.name}, bio: ${userProfile.bio}. Industry/Focus: ${userProfile.industry || 'General'}. Role: ${userProfile.role || 'Operator'}.` : "";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${systemContext}
      Analyze the following input. It could be a meeting transcript, a rough summary, or a project brief.
      1. Identify the primary project, client, or main theme and suggest a short, creative workspace name (e.g. "Project X", "Client Name", "Orbita Dev").
      2. Decompose the content into a set of organized, actionable, and significant tasks. Focus on the main motives and essential steps. Do not ignore important details but merge minor items into substantial tasks.
      
      Input: "${input}"
      
      For each main task detected, provide: 
      1. A clear title.
      2. A concise description.
      3. A set of specific actionable subtasks (checklist items).
      4. A priority level (Low, Medium, High, Critical).
      
      Format the response as an object containing 'suggestedWorkspaceName' and the array of 'tasks'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedWorkspaceName: { type: Type.STRING },
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
                  priority: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] }
                },
                required: ["title", "description", "subtasks", "priority"]
              }
            }
          },
          required: ["suggestedWorkspaceName", "tasks"]
        }
      }
    });

    const result = JSON.parse(response.text);
    res.json(result);
  } catch (error) {
    console.error("AI Decomposition Error:", error);
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

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${systemContext} Create a detailed execution plan for the following task: "${taskTitle}". 
      Break it down into actionable subtasks, provide a brief summary, suggest a priority (Low, Medium, High, Critical), and estimate its complexity.`,
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
            estimatedHours: { type: Type.NUMBER }
          },
          required: ["summary", "subtasks", "priority"]
        }
      }
    });

    const result = JSON.parse(response.text);
    res.json(result);
  } catch (error) {
    console.error("AI Expansion Error:", error);
    res.status(500).json({ error: "Failed to generate AI plan" });
  }
});

/**
 * AI Assistant Chat Endpoint
 */
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, context } = req.body;
    
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are the Orbita AI Neural Core, a high-end productivity AI assistant. You help users optimize their workflows, break down complex projects into actionable nodes, and maintain peak operational efficiency. You are professional, futuristic, and highly actionable. Context: " + JSON.stringify(context || {}),
      },
    });

    const result = await chat.sendMessage({ message });
    res.json({ response: result.text });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: "AI Assistant unavailable" });
  }
});

/**
 * Productivity Insights Endpoint
 */
app.post("/api/ai/insights", async (req, res) => {
  try {
    const { taskHistory } = req.body;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
  } catch (error) {
    console.error("AI Insights Error:", error);
    res.status(500).json({ error: "Failed to generate insights" });
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
