
export enum OptimizationFramework {
  AUTO = 'AUTO',
  AGENT_LOOP = 'Autonomous Agent Loop (V3.0)',
  RAG_ENHANCED = 'RAG + AST Chunking (Contexto)',
  OWASP_SECURE = 'OWASP LLMSVS (Seguridad)',
  RDOLT_V3 = 'RDoLT v3 (Razonamiento Recursivo)',
  HEXAGONAL = 'Hexagonal Design (Mantenibilidad)',
  COSTAR = 'COSTAR',
  COSTAR_V2 = 'CO-STAR v2 (Empresarial)'
}

export enum ModelType {
  SMART = 'gemini-3-pro-preview',
  FAST = 'gemini-3-flash-preview'
}

export interface CoStarFields {
  context: string;
  objective: string;
  style: string;
  tone: string;
  audience: string;
  response: string;
}

export enum AgentStatus {
  IDLE = 'idle',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error',
  SECURITY_ALERT = 'alert'
}

export interface AgentStep {
  agent: 'Analizador' | 'Enriquecedor' | 'Refinador' | 'Verificador';
  status: AgentStatus;
  output?: string;
  timestamp: number;
}

export interface QualityMetrics {
  clarity: number;
  security: number; // OWASP Compliance
  robustness: number; // Razonamiento profundo
  efficiency: number; // Economía de tokens/palabras
  overall: number;
}

export interface OptimizationRequest {
  rawPrompt: string;
  framework: OptimizationFramework;
  isAdvancedMode: boolean;
  targetModel: string;
  useCoT: boolean;
  contextFiles?: string[]; // Simulación de RAG
  costar?: CoStarFields;
}

export interface OptimizationResponse {
  originalPrompt: string;
  optimizedPrompt: string;
  explanation: string;
  frameworkUsed: string;
  auditLog: string; 
  qualityMetrics: QualityMetrics;
  workflowSteps: AgentStep[]; // El loop de agentes
}

export interface SimulationResult extends OptimizationResponse {
  id: string;
  timestamp: number;
  status: 'success' | 'error';
  userArchetype: string;
}

export interface ExecutionResult {
  output: string;
  mediaType: 'text' | 'image';
  model: string;
  loading: boolean;
  error?: string;
}
