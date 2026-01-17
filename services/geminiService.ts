
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { PROMPT_ENGINEERING_SYSTEM_INSTRUCTION, FRAMEWORK_DETAILS } from "../constants";
import { OptimizationRequest, OptimizationResponse, OptimizationFramework } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY no configurada.");
  return new GoogleGenAI({ apiKey });
};

async function withRetry<T>(fn: () => Promise<T>, retries = 3, baseDelay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error?.status === 429 || error?.message?.includes('429'))) {
      const delay = baseDelay * Math.pow(2, 3 - retries);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, baseDelay);
    }
    throw error;
  }
}

export const optimizePrompt = async (request: OptimizationRequest): Promise<OptimizationResponse> => {
  const ai = getClient();
  const modelId = "gemini-3-pro-preview";

  const userContent = `
    MODO: ${FRAMEWORK_DETAILS[request.framework].title}
    INPUT: "${request.rawPrompt}"
    
    INSTRUCCIONES OPERATIVAS:
    - Ejecuta el "Autonomous Agent Loop".
    - Simula el paso por las "Trust Gates" de seguridad.
    - Aplica economía de palabras (Refinador).
    - Entrega un informe de auditoría detallado.
  `;

  try {
    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: modelId,
      contents: userContent,
      config: {
        systemInstruction: PROMPT_ENGINEERING_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.1, // Reducir temperatura para mayor determinismo (Gobernanza)
        thinkingConfig: { thinkingBudget: 16000 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedPrompt: { type: Type.STRING },
            explanation: { type: Type.STRING },
            frameworkUsed: { type: Type.STRING },
            auditLog: { type: Type.STRING },
            workflowSteps: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        agent: { type: Type.STRING },
                        status: { type: Type.STRING },
                        output: { type: Type.STRING },
                        timestamp: { type: Type.NUMBER }
                    },
                    required: ["agent", "status", "timestamp"]
                }
            },
            qualityMetrics: {
              type: Type.OBJECT,
              properties: {
                clarity: { type: Type.NUMBER },
                security: { type: Type.NUMBER },
                robustness: { type: Type.NUMBER },
                efficiency: { type: Type.NUMBER },
                overall: { type: Type.NUMBER }
              },
              required: ["clarity", "security", "robustness", "efficiency", "overall"]
            }
          },
          required: ["optimizedPrompt", "explanation", "frameworkUsed", "auditLog", "qualityMetrics", "workflowSteps"]
        }
      },
    }));

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const generateDynamicScenario = async (): Promise<{ archetype: string; prompt: string }> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Genera un escenario realista de alta complejidad para probar un sistema de gobernanza de prompts (ej: finanzas, ciberseguridad, arquitectura legal).",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            archetype: { type: Type.STRING },
            prompt: { type: Type.STRING }
          },
          required: ["archetype", "prompt"]
        }
      }
    });
    return JSON.parse(response.text || '{"archetype": "User", "prompt": "Need help."}');
  } catch (error) {
    return { archetype: "Analista de Datos", prompt: "Genera un reporte de anomalías en este dataset de ventas." };
  }
};

export const executeOptimizedPrompt = async (prompt: string, modelId: string): Promise<{ output: string; mediaType: 'text' | 'image' }> => {
  const ai = getClient();
  try {
    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: modelId,
        contents: prompt,
    }));
    return { output: response.text || "No response.", mediaType: 'text' };
  } catch (error) {
    throw error;
  }
};
