

import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Activity, Zap, Shield, Server, Terminal, BarChart3, Pause, UserPlus, Trophy, Brain } from 'lucide-react';
import { SIMULATION_SCENARIOS } from '../constants';
import { optimizePrompt, generateDynamicScenario } from '../services/geminiService';
import { OptimizationFramework, OptimizationRequest, ModelType, SimulationResult } from '../types';

export const BenchmarkDashboard: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Statistics
  const totalRuns = results.length;
  const targetRuns = 100;
  const progress = Math.min((totalRuns / targetRuns) * 100, 100);
  
  const avgScore = totalRuns > 0 
    ? Math.round(results.reduce((acc, curr) => acc + curr.qualityMetrics.overall, 0) / totalRuns) 
    : 0;

  const strategiesUsed = results.reduce((acc, curr) => {
    const key = curr.frameworkUsed.split('(')[0].trim() || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const runNextSimulation = async () => {
      if (!isRunning) return;
      if (results.length >= targetRuns) {
        setIsRunning(false);
        return; // Stop at 100
      }

      let archetype = "";
      let promptText = "";

      // Mix: 20% Static, 80% Dynamic to ensure variety for 100 users
      const useDynamic = Math.random() > 0.2;

      if (useDynamic) {
        try {
            const dynamicScenario = await generateDynamicScenario();
            archetype = dynamicScenario.archetype;
            promptText = dynamicScenario.prompt;
        } catch (e) {
            // Fallback
            archetype = "Anonymous User";
            promptText = "Ayúdame con una tarea compleja.";
        }
      } else {
         const scenario = SIMULATION_SCENARIOS[currentScenarioIndex % SIMULATION_SCENARIOS.length];
         archetype = scenario.archetype;
         promptText = scenario.prompt;
      }
      
      // Fix: Added missing isAdvancedMode property to satisfy OptimizationRequest interface
      const request: OptimizationRequest = {
        rawPrompt: promptText,
        isAdvancedMode: false,
        framework: OptimizationFramework.AUTO,
        useCoT: true,
        targetModel: ModelType.FAST // Use fast model for benchmark speed
      };

      try {
        const start = Date.now();
        const response = await optimizePrompt(request);
        const end = Date.now();

        const result: SimulationResult = {
          ...response,
          id: crypto.randomUUID(),
          timestamp: end,
          status: 'success',
          userArchetype: archetype
        };

        setResults(prev => [...prev, result]);
        setCurrentScenarioIndex(prev => prev + 1);

        // Auto-scroll
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }

      } catch (error) {
        console.error("Simulation error", error);
        // If error occurs, wait a bit longer before next try
        await new Promise(r => setTimeout(r, 2000));
      } finally {
        if (isRunning) {
            // Increased delay to 4000ms to avoid 429 during loops, plus service level retries handles bursts
            timeout = setTimeout(runNextSimulation, 4000); 
        }
      }
    };

    if (isRunning) {
      runNextSimulation();
    }

    return () => clearTimeout(timeout);
  }, [isRunning, currentScenarioIndex, results.length]);

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-200">
      
      {/* CONTROL BAR */}
      <div className="h-16 border-b border-white/5 bg-zinc-900/50 backdrop-blur flex items-center justify-between px-8 flex-shrink-0">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <Activity className="text-blue-500" size={20} />
                <h2 className="text-sm font-bold tracking-widest uppercase">Benchmark Lab</h2>
            </div>
            
            {/* Progress Bar for 100 users */}
            <div className="flex flex-col gap-1 w-48">
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>PROGRESS</span>
                    <span>{totalRuns}/{targetRuns} USERS</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-blue-500 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded border border-white/5">
                <Trophy size={14} className="text-yellow-500" />
                <span className="text-xs text-zinc-500">AVG SCORE:</span>
                <span className={`text-sm font-bold font-mono ${avgScore > 90 ? 'text-blue-400' : avgScore > 75 ? 'text-yellow-400' : 'text-zinc-400'}`}>
                    {avgScore}
                </span>
            </div>
        </div>

        <button
            onClick={toggleSimulation}
            disabled={results.length >= targetRuns}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-xs transition-all ${
                results.length >= targetRuns 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : isRunning 
                    ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20' 
                    : 'bg-blue-500 text-zinc-950 hover:bg-blue-400'
            }`}
        >
            {results.length >= targetRuns 
                ? "BENCHMARK COMPLETADO" 
                : isRunning 
                    ? <><Pause size={14} /> PAUSAR</> 
                    : <><Play size={14} /> SIMULAR 100 USUARIOS</>
            }
        </button>
      </div>

      <div className="flex-grow flex overflow-hidden">
          
          {/* LEFT: LIVE FEED */}
          <div className="flex-grow flex flex-col border-r border-white/5 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-zinc-950 to-transparent h-4 z-10" />
              
              <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar scroll-smooth">
                  {results.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-zinc-600 opacity-50">
                          <UserPlus size={48} strokeWidth={1} />
                          <p className="mt-4 text-sm font-mono">Esperando generación de usuarios sintéticos...</p>
                      </div>
                  )}
                  
                  {results.map((res, idx) => (
                      <div key={res.id} className="bg-zinc-900/40 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors animate-fade-in">
                          <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-mono text-zinc-500">#{idx + 1}</span>
                                  <div className="flex flex-col">
                                      <span className="text-xs font-bold text-zinc-200">{res.userArchetype}</span>
                                      <span className="text-[10px] font-mono text-blue-500 flex items-center gap-1">
                                         <Zap size={10} /> {res.frameworkUsed}
                                      </span>
                                  </div>
                              </div>
                              <div className={`flex items-center justify-center w-8 h-8 rounded-lg border font-bold text-xs ${
                                  res.qualityMetrics.overall >= 90 ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                  res.qualityMetrics.overall >= 75 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/10 border-red-500/20 text-red-400'
                              }`}>
                                  {res.qualityMetrics.overall}
                              </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                              <div className="opacity-60 bg-zinc-950/30 p-2 rounded border border-white/5">
                                  <p className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Prompt Original</p>
                                  <p className="text-xs font-mono text-zinc-400 line-clamp-2">"{res.originalPrompt}"</p>
                              </div>
                              <div className="bg-blue-900/10 rounded p-2 border border-blue-500/10">
                                  <p className="text-[10px] uppercase text-blue-400 font-bold mb-1 flex items-center gap-1">
                                      <Shield size={10} /> UX Audit Report
                                  </p>
                                  <p className="text-[11px] text-blue-200 leading-tight line-clamp-2">
                                      {res.auditLog}
                                  </p>
                              </div>
                          </div>
                      </div>
                  ))}
                  {isRunning && (
                       <div className="flex flex-col items-center justify-center py-6 gap-2 opacity-50">
                           <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                           <span className="text-[10px] font-mono text-blue-500">Generando Usuario #{results.length + 1}...</span>
                       </div>
                  )}
              </div>
          </div>

          {/* RIGHT: STATS PANEL */}
          <div className="w-80 bg-zinc-950 p-6 flex flex-col gap-6 overflow-y-auto border-l border-white/5">
              
               {/* ALIVE MEMORY SIMULATION */}
               <div className="bg-gradient-to-br from-purple-900/20 to-zinc-900 rounded-xl p-4 border border-purple-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-30">
                      <Brain size={48} />
                  </div>
                  <div className="flex items-center gap-2 mb-3 text-purple-300 relative z-10">
                      <Brain size={16} />
                      <span className="text-xs font-bold uppercase tracking-wide">UX Intelligence Core</span>
                  </div>
                  <div className="relative z-10 space-y-2">
                      <p className="text-[10px] text-purple-200/80 leading-relaxed">
                          Analizando patrones de usabilidad de {results.length} simulaciones...
                      </p>
                      {results.length > 5 && (
                          <div className="flex gap-1 flex-wrap">
                                <span className="text-[9px] px-2 py-0.5 bg-purple-500/20 rounded border border-purple-500/30 text-purple-200">A11y Checks</span>
                                <span className="text-[9px] px-2 py-0.5 bg-purple-500/20 rounded border border-purple-500/30 text-purple-200">Heuristic-Match</span>
                          </div>
                      )}
                  </div>
              </div>

              <div className="bg-zinc-900 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-4 text-zinc-400">
                      <BarChart3 size={16} />
                      <span className="text-xs font-bold uppercase tracking-wide">Methodologies Used</span>
                  </div>
                  <div className="space-y-3">
                      {(Object.entries(strategiesUsed) as [string, number][]).sort(([,a], [,b]) => b - a).map(([name, count]) => (
                          <div key={name}>
                              <div className="flex justify-between text-[10px] mb-1">
                                  <span className="text-zinc-300 truncate max-w-[150px]">{name}</span>
                                  <span className="text-zinc-500 font-mono">{totalRuns > 0 ? Math.round((count / totalRuns) * 100) : 0}%</span>
                              </div>
                              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                                    style={{ width: `${totalRuns > 0 ? (count / totalRuns) * 100 : 0}%` }}
                                  />
                              </div>
                          </div>
                      ))}
                      {totalRuns === 0 && <span className="text-xs text-zinc-600 italic">Sin datos aún</span>}
                  </div>
              </div>

              <div className="bg-zinc-900 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-2 text-zinc-400">
                      <Server size={16} />
                      <span className="text-xs font-bold uppercase tracking-wide">Estado del Sistema</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                       <div className="bg-black/20 p-2 rounded flex flex-col items-center justify-center">
                           <span className="text-xs text-zinc-500">Clarity</span>
                           <span className="text-sm font-mono text-blue-400">{(avgScore / 10).toFixed(1)}/10</span>
                       </div>
                       <div className="bg-black/20 p-2 rounded flex flex-col items-center justify-center">
                           <span className="text-xs text-zinc-500">Accessibility</span>
                           <span className="text-sm font-mono text-blue-400">WCAG 2.2</span>
                       </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
