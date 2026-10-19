import React from 'react';
import { MISSIONS_CATALOG, Mission } from '../data/missionsCatalog';
import { Target, DollarSign, Scale, ArrowRight } from 'lucide-react';

interface MissionSelectorProps {
  onSelectMission: (mission: Mission) => void;
}

export const MissionSelector: React.FC<MissionSelectorProps> = ({ onSelectMission }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-10 font-sans flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold tracking-[0.3em] uppercase text-cyan-400 mb-2 text-center">Contratos de Misión</h1>
        <p className="text-slate-400 text-center tracking-widest text-sm mb-10">Selecciona tu objetivo principal para esta campaña</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MISSIONS_CATALOG.map((mission) => (
            <div 
              key={mission.id}
              onClick={() => onSelectMission(mission)}
              className="bg-slate-900 border border-slate-700 hover:border-cyan-400 hover:bg-slate-800 p-6 rounded-lg cursor-pointer transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white tracking-widest uppercase">{mission.title}</h2>
                <Target className="text-cyan-500 group-hover:scale-110 transition-transform" />
              </div>
              
              <p className="text-slate-400 text-sm mb-6 min-h-[60px]">{mission.description}</p>
              
              <div className="space-y-2 text-xs font-mono text-slate-300 mb-6 border-t border-slate-700 pt-4">
                <div className="flex justify-between">
                  <span className="flex items-center gap-2"><DollarSign size={14}/> Presupuesto Base:</span>
                  <span className="text-green-400">${(mission.budgetUSD / 1e6).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2"><Scale size={14}/> Límite de Masa Recomendado:</span>
                  <span className="text-cyan-400">{mission.maxMassKg} kg</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-cyan-500 text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                Aceptar Contrato <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};