
import React, { useState } from 'react';
import { OptimizationResponse, ExecutionResult, AgentStatus } from '../types';
import { Copy, Check, Play, Terminal, Zap, FileJson, ShieldCheck, Trophy, Eye, Lock, Layers, Activity, ChevronRight, AlertTriangle, ShieldAlert, Cpu, BookOpen, GraduationCap } from 'lucide-react';
import { executeOptimizedPrompt } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface OptimizationResultProps {
  result: OptimizationResponse;
  targetModel: string;
}

export const OptimizationResult: React.FC<OptimizationResultProps> = ({ result, targetModel }) => {
  const [copied, setCopied] = useState(false);
  const [execution, setExecution] = useState<ExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'workflow' | 'prompt' | 'preview'>('workflow');

  const handleCopy = () => {
    navigator.clipboard.writeText(result.optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecute = async () => {
    setActiveTab('preview');
    setExecution({ loading: true, output: '', model: targetModel, mediaType: 'text' });
    try {
      const { output, mediaType } = await executeOptimizedPrompt(result.optimizedPrompt, targetModel);
      setExecution({ loading: false, output, model: targetModel, mediaType });
    } catch (error) {
      setExecution({ loading: false, output: '', model: targetModel, error: 'Simulation failed.', mediaType: 'text' });
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/40 backdrop-blur-3xl">
      {/* HEADER NAVEGACIÓN V4 */}
      <div className="flex-shrink-0 px-8 py-5 border-b border-white/5 flex items-center justify-between bg-zinc-950/50">
         <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-white/5 shadow-inner">
             <TabButton active={activeTab === 'workflow'} onClick={() => setActiveTab('workflow')} icon={<GraduationCap size={15} />} label="Loop Educativo" />
             <TabButton active={activeTab === 'prompt'} onClick={() => setActiveTab('prompt')} icon={<FileJson size={15} />} label="Artefacto Final" />
             <TabButton active={activeTab === 'preview'} onClick={() => setActiveTab('preview')} icon={<Activity size={15} />} label="Validación" />
         </div>
         <div className="flex items-center gap-5">
             <div className="flex flex-col items-end">
                <span className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">Governance Dashboard</span>
                <span className="text-xs font-black text-blue-500">V4.0 MULTILINGUAL</span>
             </div>
             <button onClick={handleCopy} className="w-12 h-12 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 transition-all border border-white/10 flex items-center justify-center shadow-xl">
                {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
            </button>
         </div>
      </div>

      <div className="flex-grow relative overflow-hidden">
          
          {/* TAB 1: WORKFLOW (EDUCATIVO) */}
          <div className={`absolute inset-0 p-8 flex flex-col gap-8 transition-all duration-500 ${activeTab === 'workflow' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="grid grid-cols-4 gap-4">
                  <MetricCard icon={<Eye size={14} />} label="Claridad" score={result.qualityMetrics.clarity} color="blue" />
                  <MetricCard icon={<ShieldCheck size={14} />} label="Seguridad" score={result.qualityMetrics.security} color="emerald" />
                  <MetricCard icon={<Zap size={14} />} label="Eficiencia" score={result.qualityMetrics.efficiency} color="yellow" />
                  <MetricCard icon={<Layers size={14} />} label="Robustez" score={result.qualityMetrics.robustness} color="purple" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow overflow-hidden">
                {/* LÍNEA DE TIEMPO DE AGENTES */}
                <div className="flex flex-col gap-5 overflow-y-auto custom-scrollbar pr-3">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Cpu size={14} /> Trazabilidad de Agentes
                    </h3>
                    {result.workflowSteps?.map((step, idx) => (
                        <div key={idx} className="flex gap-4 group">
                            <div className="flex flex-col items-center">
                                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center border-2 shadow-lg transition-all ${
                                    step.status === 'success' ? 'bg-blue-600/20 border-blue-500/40 text-blue-400' : 
                                    step.status === 'alert' ? 'bg-red-600/20 border-red-500/40 text-red-400 animate-pulse' :
                                    'bg-zinc-800 border-zinc-700 text-zinc-500'
                                }`}>
                                    {step.agent === 'Verificador' ? <ShieldCheck size={16} /> : <span className="text-xs font-black">{idx + 1}</span>}
                                </div>
                                {idx < result.workflowSteps.length - 1 && <div className="w-[2px] h-full bg-zinc-800 group-hover:bg-blue-500/20 transition-colors my-1" />}
                            </div>
                            <div className="flex-grow pb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-black text-zinc-200 uppercase tracking-wider">Agente {step.agent}</span>
                                    <span className="text-[9px] font-mono text-zinc-600">{new Date(step.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <div className="bg-zinc-950/60 border border-white/5 rounded-2xl p-4 text-[11px] text-zinc-400 leading-relaxed shadow-inner italic">
                                    {step.output || "Tarea completada bajo los estándares de gobernanza V4."}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* EXPLICACIÓN DIDÁCTICA */}
                <div className="bg-zinc-950/40 border border-white/5 rounded-[32px] p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center gap-3 text-blue-400">
                      <GraduationCap size={24} />
                      <h3 className="text-sm font-black uppercase tracking-widest">¿Por qué este prompt funciona?</h3>
                    </div>
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="w-1.5 h-auto bg-blue-600 rounded-full" />
                        <div>
                          <h4 className="text-[11px] font-black text-zinc-300 uppercase mb-1">Estrategia Cognitiva</h4>
                          <p className="text-xs text-zinc-500 leading-relaxed">{result.explanation}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-1.5 h-auto bg-emerald-600 rounded-full" />
                        <div>
                          <h4 className="text-[11px] font-black text-zinc-300 uppercase mb-1">Capa de Seguridad</h4>
                          <p className="text-xs text-zinc-500 leading-relaxed">{result.auditLog}</p>
                        </div>
                      </div>
                      <div className="p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen size={14} className="text-blue-400" />
                          <span className="text-[10px] font-black text-blue-400 uppercase">Glosario de Técnicas</span>
                        </div>
                        <ul className="space-y-3 text-[10px] text-zinc-400">
                          <li><strong className="text-zinc-200">PPA:</strong> Cambiamos la estructura para que la IA no pueda ser engañada.</li>
                          <li><strong className="text-zinc-200">Sándwich:</strong> Recordamos lo más importante al final para evitar olvidos.</li>
                          <li><strong className="text-zinc-200">Delimitadores XML:</strong> Usamos etiquetas para que la IA sepa qué es contexto y qué es instrucción.</li>
                        </ul>
                      </div>
                    </div>
                </div>
              </div>
          </div>

          {/* TAB 2: PROMPT (ARTEFACTO) */}
          <div className={`absolute inset-0 flex flex-col transition-all duration-500 ${activeTab === 'prompt' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="flex-grow relative bg-zinc-950/40">
                  <textarea readOnly className="w-full h-full bg-transparent p-10 text-zinc-300 font-mono text-[14px] leading-8 resize-none focus:outline-none custom-scrollbar" value={result.optimizedPrompt} />
                  <div className="absolute bottom-10 right-10 flex gap-4">
                     <button onClick={handleExecute} className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all text-xs font-black shadow-2xl shadow-blue-900/60 uppercase tracking-widest">
                        <Play size={14} fill="currentColor" /> Probar Prompt
                     </button>
                  </div>
              </div>
          </div>

          {/* TAB 3: PREVIEW */}
          <div className={`absolute inset-0 flex flex-col transition-all duration-500 ${activeTab === 'preview' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
             {execution?.loading ? (
                 <div className="flex-grow flex flex-col items-center justify-center gap-6 bg-zinc-950/30">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-2xl shadow-blue-500/20" />
                    <div className="text-center">
                      <span className="text-sm font-black tracking-widest animate-pulse text-blue-400 block mb-2 uppercase">Validando en Sandbox...</span>
                      <span className="text-[10px] text-zinc-600 font-mono">Verificando integridad del artefacto generado</span>
                    </div>
                 </div>
             ) : execution?.output ? (
                 <div className="flex-grow overflow-y-auto p-12 custom-scrollbar bg-zinc-950/60">
                    <div className="w-full prose prose-invert prose-blue max-w-none prose-p:text-zinc-300 prose-headings:text-white prose-headings:font-black">
                         <ReactMarkdown>{execution.output}</ReactMarkdown>
                    </div>
                 </div>
             ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-zinc-800">
                    <ShieldAlert size={64} strokeWidth={1} />
                    <p className="text-sm mt-6 font-black uppercase tracking-[0.3em]">Validación Pendiente</p>
                </div>
             )}
          </div>
      </div>

      {/* FOOTER MULTILINGUAL */}
      <div className="flex-shrink-0 h-14 border-t border-white/5 bg-zinc-950/80 px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Integridad: Certificada</span>
              </div>
              <div className="h-4 w-[1px] bg-white/10" />
              <div className="flex items-center gap-2">
                  <Zap size={16} className="text-blue-500" />
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Idioma: Detectado & Sincronizado</span>
              </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
             <span className="text-[10px] text-zinc-600 font-mono font-bold">NODE: {Math.random().toString(16).slice(2, 12).toUpperCase()}</span>
          </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
    <button onClick={onClick} className={`px-5 py-2.5 rounded-xl text-[11px] font-black transition-all flex items-center gap-2.5 tracking-wider ${active ? 'bg-zinc-800 text-blue-400 shadow-xl' : 'text-zinc-600 hover:text-zinc-400'}`}>
        {icon} <span>{label.toUpperCase()}</span>
    </button>
);

const MetricCard = ({ icon, label, score, color }: { icon: React.ReactNode, label: string, score: number, color: string }) => {
    const colorClasses = {
        blue: 'bg-blue-500/5 border-blue-500/20 text-blue-400 shadow-blue-950/20',
        emerald: 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 shadow-emerald-950/20',
        purple: 'bg-purple-500/5 border-purple-500/20 text-purple-400 shadow-purple-950/20',
        yellow: 'bg-yellow-500/5 border-yellow-500/20 text-yellow-400 shadow-yellow-950/20',
    }[color] || '';
    return (
        <div className={`rounded-2xl p-4 border flex flex-col gap-2 transition-all hover:scale-[1.02] shadow-xl ${colorClasses}`}>
            <div className="flex items-center gap-2 opacity-60">
                {icon} <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-xl font-mono font-black leading-none">{score}</span>
                <span className="text-[10px] opacity-40 font-mono font-bold">/100</span>
            </div>
        </div>
    )
}
