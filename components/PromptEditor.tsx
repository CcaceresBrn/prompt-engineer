
import React, { useState } from 'react';
import { OptimizationFramework, OptimizationRequest, ModelType, CoStarFields } from '../types';
import { Sparkles, BrainCircuit, MessageSquare, ChevronDown, Sliders, Zap, ShieldCheck, PenTool, Layout, FileText, Info, Target, HelpCircle } from 'lucide-react';
import { INITIAL_PROMPT_PLACEHOLDER, FRAMEWORK_DETAILS } from '../constants';

interface PromptEditorProps {
  request: OptimizationRequest;
  setRequest: React.Dispatch<React.SetStateAction<OptimizationRequest>>;
  onOptimize: () => void;
  isOptimizing: boolean;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  request,
  setRequest,
  onOptimize,
  isOptimizing,
}) => {
  const [activeTab, setActiveTab] = useState<'brief' | 'costar'>('brief');
  const [showGuide, setShowGuide] = useState(false);

  const updateCostar = (field: keyof CoStarFields, value: string) => {
    setRequest(prev => ({
      ...prev,
      costar: { ...prev.costar!, [field]: value }
    }));
  };

  const handleTabChange = (tab: 'brief' | 'costar') => {
    setActiveTab(tab);
    setRequest(prev => ({ 
      ...prev, 
      isAdvancedMode: tab === 'costar',
      framework: tab === 'costar' ? OptimizationFramework.COSTAR : OptimizationFramework.AUTO,
      costar: prev.costar || { context: '', objective: '', style: '', tone: '', audience: '', response: '' }
    }));
  };

  const currentFW = FRAMEWORK_DETAILS[request.framework];

  return (
    <div className="flex flex-col gap-6">
      {/* CARD 1: CONFIGURACIÓN COGNITIVA */}
      <section className="glass-panel p-1 rounded-[32px] flex flex-col gap-1 shadow-2xl shadow-blue-900/10">
        <div className="bg-zinc-900/60 rounded-[28px] p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                      <BrainCircuit size={20} />
                    </div>
                    <div>
                      <h2 className="text-xs font-black tracking-widest uppercase text-white">Configuración del Arquitecto</h2>
                      <p className="text-[10px] text-zinc-500 font-bold">V4.0 INTELLIGENCE CORE</p>
                    </div>
                </div>
                <div className="flex bg-zinc-950/80 p-1 rounded-2xl border border-white/5 shadow-inner">
                    <button 
                        onClick={() => handleTabChange('brief')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${activeTab === 'brief' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-400'}`}
                    >
                        LENGUAJE NATURAL
                    </button>
                    <button 
                        onClick={() => handleTabChange('costar')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${activeTab === 'costar' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-400'}`}
                    >
                        MODO CO-STAR
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest flex items-center gap-2">
                        <Target size={12} className="text-blue-500" />
                        Metodología de Razonamiento
                      </label>
                      <button 
                        onClick={() => setShowGuide(!showGuide)}
                        className="text-[10px] text-blue-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <Info size={10} /> {showGuide ? 'Ocultar Guía' : 'Ver Beneficios'}
                      </button>
                    </div>
                    <div className="relative">
                        <select
                            className="w-full appearance-none bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-bold py-4 px-5 rounded-2xl focus:outline-none focus:border-blue-500/40 transition-all cursor-pointer shadow-lg"
                            value={request.framework}
                            onChange={(e) => setRequest({ ...request, framework: e.target.value as OptimizationFramework })}
                        >
                            {Object.values(OptimizationFramework).map((fw) => (
                                <option key={fw} value={fw}>{FRAMEWORK_DETAILS[fw as OptimizationFramework].title}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    </div>
                </div>

                {showGuide && (
                  <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 animate-fade-in">
                    <h4 className="text-[11px] font-black text-blue-400 uppercase mb-2">{currentFW.title}</h4>
                    <p className="text-[11px] text-zinc-400 mb-3 leading-relaxed">{currentFW.benefit}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-zinc-500 uppercase">Uso ideal:</span>
                      <span className="text-[10px] text-zinc-300 font-medium">{currentFW.whenToUse}</span>
                    </div>
                  </div>
                )}
            </div>

            <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-950/40 border border-white/5">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400"><Zap size={16} /></div>
                    <div className="flex flex-col"><span className="text-[9px] text-zinc-600 font-black uppercase">Motor Activo</span><span className="text-[11px] text-zinc-300 font-mono">Gemini 3 Pro</span></div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-950/40 border border-white/5">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400"><ShieldCheck size={16} /></div>
                    <div className="flex flex-col"><span className="text-[9px] text-zinc-600 font-black uppercase">Seguridad</span><span className="text-[11px] text-zinc-300 font-mono">PPA Protected</span></div>
                </div>
            </div>
        </div>
      </section>

      {/* CARD 2: ÁREA DE ENTRADA */}
      <section className="glass-panel p-1 rounded-[32px] flex-grow flex flex-col transition-all relative min-h-[350px] shadow-2xl">
        <div className="bg-zinc-900/60 rounded-[28px] p-6 flex-grow flex flex-col gap-5 overflow-hidden">
             <div className="flex items-center gap-2 text-zinc-400">
                {activeTab === 'brief' ? <MessageSquare size={18} className="text-blue-500" /> : <Layout size={18} className="text-blue-500" />}
                <span className="text-xs font-black tracking-widest uppercase text-white">{activeTab === 'brief' ? 'Input del Usuario' : 'Formulario CO-STAR'}</span>
             </div>

             <div className="flex-grow relative overflow-y-auto custom-scrollbar pr-3">
                {activeTab === 'brief' ? (
                    <textarea
                        className="w-full h-full bg-transparent border-none text-zinc-200 placeholder-zinc-700 focus:outline-none resize-none font-sans text-sm leading-8"
                        placeholder={INITIAL_PROMPT_PLACEHOLDER}
                        value={request.rawPrompt}
                        onChange={(e) => setRequest({ ...request, rawPrompt: e.target.value })}
                    />
                ) : (
                    <div className="space-y-6 animate-fade-in pb-24">
                        <CostarInput 
                          label="Contexto" 
                          info="Explica el escenario o la situación actual."
                          value={request.costar?.context || ''} 
                          onChange={(v) => updateCostar('context', v)} 
                          placeholder="Ej: Soy un analista financiero preparando un reporte..." 
                        />
                        <CostarInput 
                          label="Objetivo" 
                          info="¿Qué quieres conseguir exactamente?"
                          value={request.costar?.objective || ''} 
                          onChange={(v) => updateCostar('objective', v)} 
                          placeholder="Ej: Detectar anomalías en los gastos de marketing..." 
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <CostarInput label="Estilo" info="Ej: Técnico, Narrativo" value={request.costar?.style || ''} onChange={(v) => updateCostar('style', v)} placeholder="Formativo..." />
                            <CostarInput label="Tono" info="Ej: Profesional, Inspirador" value={request.costar?.tone || ''} onChange={(v) => updateCostar('tone', v)} placeholder="Serio..." />
                        </div>
                        <CostarInput label="Audiencia" info="¿Para quién es la respuesta?" value={request.costar?.audience || ''} onChange={(v) => updateCostar('audience', v)} placeholder="Inversores..." />
                        <CostarInput label="Formato" info="Ej: JSON, Tabla, Lista" value={request.costar?.response || ''} onChange={(v) => updateCostar('response', v)} placeholder="Markdown..." />
                    </div>
                )}
                
                <div className="absolute bottom-0 right-0 left-0 pt-12 pb-2 bg-gradient-to-t from-zinc-900 via-zinc-900 to-transparent z-10">
                     <button
                        onClick={onOptimize}
                        disabled={(!request.rawPrompt.trim() && activeTab === 'brief') || isOptimizing}
                        className={`w-full py-5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-3 tracking-[0.2em] shadow-2xl ${
                        (!request.rawPrompt.trim() && activeTab === 'brief') || isOptimizing
                            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-white/5'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40 border border-blue-400/20'
                        }`}
                    >
                        {isOptimizing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <span>EJECUTANDO AGENTES...</span>
                        </>
                        ) : (
                        <>
                            <Sparkles size={18} className="animate-pulse" />
                            <span>IGNICIÓN COGNITIVA</span>
                        </>
                        )}
                    </button>
                </div>
             </div>
        </div>
      </section>
    </div>
  );
};

const CostarInput = ({ label, info, value, onChange, placeholder }: { label: string, info: string, value: string, onChange: (v: string) => void, placeholder: string }) => (
    <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 ml-1">
          <label className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{label}</label>
          <div className="group relative">
            <HelpCircle size={10} className="text-zinc-600 cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-zinc-800 text-[9px] text-zinc-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-white/5 shadow-2xl">
              {info}
            </div>
          </div>
        </div>
        <textarea 
            className="w-full bg-zinc-950/40 border border-white/5 rounded-2xl p-4 text-xs text-zinc-300 placeholder-zinc-800 focus:outline-none focus:border-blue-500/30 transition-all min-h-[70px] resize-none shadow-inner"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    </div>
);
