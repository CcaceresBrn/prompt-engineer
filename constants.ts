
import { OptimizationFramework } from "./types";

export const PROMPT_ENGINEERING_SYSTEM_INSTRUCTION = `
### SISTEMA OPERATIVO: UX-ARCHITECT V4.0 (EDUCATIONAL & MULTILINGUAL)

<FILOSOFIA_DE_GOBERNANZA>
Actúas como el "Plano de Control de IA". Tu misión es transformar intenciones ambiguas en artefactos de software robustos.
REGLA CRÍTICA DE IDIOMA: Debes detectar el idioma del prompt original del usuario y responder (optimizedPrompt, explanation, auditLog) EXACTAMENTE en ese mismo idioma. Si el usuario escribe en español, todo el output debe ser en español.
</FILOSOFIA_DE_GOBERNANZA>

<ECOSISTEMA_MULTI_AGENTE>
Simula y reporta la actividad de 4 agentes especializados:
1. AGENTE ANALIZADOR: Extrae intención y entidades en el idioma del usuario.
2. AGENTE ENRIQUECEDOR (RAG): Inyecta contexto relevante.
3. AGENTE REFINADOR: Aplica "Economía de Palabras" y técnicas de ingeniería de prompts.
4. AGENTE VERIFICADOR: Escaneo OWASP y validación de seguridad.
</ECOSISTEMA_MULTI_AGENTE>

<REQUISITOS_TECNICOS_DEL_PROMPT_OPTIMIZADO>
- Usa Delimitadores XML (ej: <contexto>, <instrucciones>).
- Aplica Defensa Sándwich (reitera instrucciones clave al final).
- Usa PPA (Polymorphic Prompt Assembling) para evitar jailbreaks.
- Estructura el prompt para que sea modular y comprobable.
</REQUISITOS_TECNICOS_DEL_PROMPT_OPTIMIZADO>

<FORMATO_DE_SALIDA_JSON>
{
  "optimizedPrompt": "El prompt final enriquecido en el IDIOMA DEL USUARIO.",
  "explanation": "Explicación educativa de las técnicas de ingeniería aplicadas, en el IDIOMA DEL USUARIO.",
  "frameworkUsed": "Nombre de la estrategia aplicada.",
  "auditLog": "Registro de seguridad y cumplimiento, en el IDIOMA DEL USUARIO.",
  "workflowSteps": [
    { "agent": "Analizador", "status": "success", "output": "Descripción en el idioma del usuario", "timestamp": 123 }
  ],
  "qualityMetrics": {
      "clarity": 0-100,
      "security": 0-100,
      "robustness": 0-100,
      "efficiency": 0-100,
      "overall": 0-100
  }
}
</FORMATO_DE_SALIDA_JSON>
`;

export const INITIAL_PROMPT_PLACEHOLDER = "Escribe tu idea aquí (ej: 'ayúdame a diseñar una app de finanzas'). El sistema detectará tu idioma y optimizará la respuesta.";

export const FRAMEWORK_DETAILS: Record<OptimizationFramework, { title: string; subtitle: string; benefit: string; whenToUse: string; structure: string }> = {
  [OptimizationFramework.AUTO]: {
    title: "Arquitecto Automático",
    subtitle: "IA-Guided Selection",
    benefit: "El sistema analiza tu intención y elige la mejor técnica sin que tengas que configurar nada.",
    whenToUse: "Ideal para la mayoría de los casos cuando buscas el mejor resultado posible de forma rápida.",
    structure: "Detección -> Enrutamiento -> Optimización"
  },
  [OptimizationFramework.AGENT_LOOP]: {
    title: "V4 Autonomous Loop",
    subtitle: "Orquestación Multi-Agente",
    benefit: "Máxima calidad a través de la colaboración de agentes especializados que se corrigen entre sí.",
    whenToUse: "Cuando el resultado debe ser perfecto y pasar por filtros de seguridad y contexto profundos.",
    structure: "Analizador -> RAG -> Refinador -> Verificador"
  },
  [OptimizationFramework.RAG_ENHANCED]: {
    title: "Enriquecimiento RAG",
    subtitle: "Contextual Intelligence",
    benefit: "Inyecta conocimientos específicos y ejemplos reales en el prompt para evitar alucinaciones.",
    whenToUse: "Para tareas técnicas como programación o análisis de documentos extensos.",
    structure: "Búsqueda -> Fragmentación AST -> Inyección"
  },
  [OptimizationFramework.OWASP_SECURE]: {
    title: "Blindaje OWASP",
    subtitle: "Safety First",
    benefit: "Protege tu prompt contra manipulaciones malintencionadas o inyecciones de código.",
    whenToUse: "Obligatorio en entornos corporativos o cuando la IA manejará datos sensibles.",
    structure: "Análisis de Riesgo -> Sanitización -> Sándwich"
  },
  [OptimizationFramework.RDOLT_V3]: {
    title: "Razonamiento RDoLT",
    subtitle: "Recursive Logic",
    benefit: "Divide un problema complejo en capas lógicas para asegurar que la IA no pierda el hilo.",
    whenToUse: "Tareas de razonamiento matemático, lógico o planificación estratégica.",
    structure: "Nivel 1 (Fácil) -> Nivel 2 (Medio) -> Nivel 3 (Final)"
  },
  [OptimizationFramework.HEXAGONAL]: {
    title: "Diseño Hexagonal",
    subtitle: "Software Architecture",
    benefit: "Estructura las instrucciones como si fueran código modular, facilitando su mantenimiento.",
    whenToUse: "Para desarrolladores que quieren prompts que se integren en arquitecturas limpias.",
    structure: "Puertos -> Adaptadores -> Núcleo"
  },
  [OptimizationFramework.COSTAR]: {
    title: "CO-STAR Estándar",
    subtitle: "Structured Business",
    benefit: "Asegura que no falte información clave como el Tono, la Audiencia o el Objetivo.",
    whenToUse: "Marketing, redacción de correos y tareas de comunicación empresarial.",
    structure: "C-O-S-T-A-R Framework"
  },
  [OptimizationFramework.COSTAR_V2]: {
    title: "CO-STAR Empresarial",
    subtitle: "Advanced Corporate",
    benefit: "Versión extendida con reglas de gobernanza para cumplir con estándares de marca.",
    whenToUse: "Grandes organizaciones que requieren prompts alineados con su voz corporativa.",
    structure: "CO-STAR + Business Rules"
  }
};

export const SIMULATION_SCENARIOS = [
  { archetype: "Analista de Riesgos", prompt: "Analiza los riesgos de este producto financiero en el mercado de Latam." },
  { archetype: "Arquitecto de Software", prompt: "Refactoriza este código monolítico a microservicios usando Hexagonal." },
  { archetype: "Especialista en Seguridad", prompt: "Busca inyecciones SQL y vulnerabilidades OWASP en esta función de login." },
  { archetype: "Estratega de Producto", prompt: "Necesito un MVP para una app de economía circular en 3 meses." }
];
