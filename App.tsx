
import React, { useState } from 'react';
import { PromptEditor } from './components/PromptEditor';
import { OptimizationResult } from './components/OptimizationResult';
import { BenchmarkDashboard } from './components/BenchmarkDashboard';
import { OptimizationFramework, OptimizationRequest, OptimizationResponse, ModelType } from './types';
import { optimizePrompt } from './services/geminiService';
import { LayoutGrid, Activity, PenTool, History, Settings, ShieldCheck, Cpu, ShieldAlert, Layers } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'workspace' | 'benchmark'>('workspace');
  
  const [request, setRequest] = useState<OptimizationRequest>({
    rawPrompt: '',
    isAdvancedMode: false,
    framework: OptimizationFramework.AGENT_LOOP,
    useCoT: true,
    targetModel: ModelType.SMART,
  });

  const [result, setResult] = useState<OptimizationResponse | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setError(null);
    try {
      const response = await optimizePrompt(request);
      setResult(response);
    } catch (err: any) {
      console.error(err);
      if (err?.status === 429 || err?.message?.includes('429')) {
        setError("⚠️ RATE LIMIT EXCEEDED. Retrying through Control Plane...");
      } else {
        setError("GOVERNANCE ERROR: Failed to reach agent loop.");
      }
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans text-zinc-200 selection:bg-blue-500/20 selection:text-blue-200">
      
      {/* SIDEBAR V3 */}
      <aside className="w-16 lg:w-20 flex-shrink-0 border-r border-white/5 bg-zinc-950 flex flex-col items-center py-6 gap-8 z-20">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-900/40 transform hover:scale-105 transition-all">
          <Cpu size={24} strokeWidth={2.5} />
        </div>

        <nav className="flex flex-col gap-4 w-full px-2">
          <SidebarIcon icon={<LayoutGrid size={22} />} active={activeView === 'workspace'} label="Architect" onClick={() => setActiveView('workspace')} />
          <SidebarIcon icon={<Activity size={22} />} active={activeView === 'benchmark'} label="Sim Lab" onClick={() => setActiveView('benchmark')} />
          <div className="h-[1px] bg-white/5 w-8 mx-auto my-2" />
          <SidebarIcon icon={<History size={20} />} label="Events" />
          <SidebarIcon icon={<Settings size={20} />} label="Config" />
        </nav>

        <div className="mt-auto flex flex-col items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-xs font-bold text-zinc-600">V3</div>
        </div>
      </aside>

      <main className="flex-grow flex flex-col relative overflow-hidden">
        {activeView === 'workspace' ? (
            <>
                <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-zinc-950/60 backdrop-blur-md z-10 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-sm font-black text-white tracking-tighter uppercase italic">
                      UX-ARCHITECT <span className="text-blue-500">V3.0</span>
                    </h1>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-blue-500" />
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Autonomous Governance Active</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Model Engine</span>
                        <span className="text-[11px] font-mono text-zinc-300">Gemini 3.0 Pro Ultra</span>
                    </div>
                </div>
                </header>

                <div className="flex-grow p-6 overflow-hidden bg-[#050505]">
                <div className="max-w-[1600px] mx-auto h-full grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 flex flex-col gap-6 h-full overflow-y-auto pr-2 pb-2">
                      <PromptEditor request={request} setRequest={setRequest} onOptimize={handleOptimize} isOptimizing={isOptimizing} />
                      {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[11px] font-mono flex items-start gap-3 animate-fade-in shadow-xl">
                          <ShieldAlert size={16} className="flex-shrink-0 mt-0.5" />
                          <span>{error}</span>
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-7 h-full">
                      <div className="h-full rounded-[32px] overflow-hidden glass-panel border border-white/10 shadow-2xl relative shadow-black/80">
                        {result ? <OptimizationResult result={result} targetModel={request.targetModel} /> : <EmptyState />}
                      </div>
                    </div>
                </div>
                </div>
            </>
        ) : (
            <BenchmarkDashboard />
        )}
      </main>
    </div>
  );
};

const SidebarIcon = ({ icon, active, label, onClick }: { icon: React.ReactNode, active?: boolean, label: string, onClick?: () => void }) => (
  <button onClick={onClick} className={`w-full aspect-square rounded-2xl flex items-center justify-center transition-all group relative ${active ? 'bg-blue-600/10 text-blue-400 shadow-inner' : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/50'}`}>
    {icon}
    <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-zinc-100 text-[10px] rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-white/5 shadow-2xl">
      {label.toUpperCase()}
    </div>
  </button>
);

const EmptyState = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 bg-zinc-950/20">
    <div className="relative mb-10">
      <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full" />
      <div className="w-24 h-24 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-700 relative z-10 shadow-2xl">
          <Cpu size={40} strokeWidth={1} className="animate-pulse" />
      </div>
    </div>
    <h3 className="text-zinc-100 font-black text-2xl mb-4 tracking-tight">AI Control Plane Ready</h3>
    <p className="text-zinc-500 text-sm max-w-sm leading-relaxed font-medium">
      Inicia el <span className="text-blue-500">Domain Agent Loop</span> para transformar intenciones ambiguas en artefactos de software auditables.
    </p>
    <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="p-4 bg-zinc-900/40 border border-white/5 rounded-2xl flex flex-col items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-500" />
            <span className="text-[10px] text-zinc-500 font-bold uppercase">OWASP Ready</span>
        </div>
        <div className="p-4 bg-zinc-900/40 border border-white/5 rounded-2xl flex flex-col items-center gap-2">
            <Layers size={20} className="text-purple-500" />
            <span className="text-[10px] text-zinc-500 font-bold uppercase">RAG/AST Active</span>
        </div>
    </div>
  </div>
);

export default App;
