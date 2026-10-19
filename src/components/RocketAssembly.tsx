import React, { useState } from 'react';
import { ROCKETS_CATALOG, Rocket } from '../data/rocketsCatalog';
import { SatelliteComponent } from '../data/componentsCatalog';
import { Rocket as RocketIcon, ShieldCheck, AlertTriangle, ArrowRight, ArrowLeft, DollarSign, Scale } from 'lucide-react';

interface RocketAssemblyProps {
  configuredComponents: SatelliteComponent[];
  totalSatelliteMassKg: number;
  onProceedToControl: (selectedRocket: Rocket) => void;
  onBackToHangar: () => void;
}

export const RocketAssembly: React.FC<RocketAssemblyProps> = ({
  configuredComponents,
  totalSatelliteMassKg,
  onProceedToControl,
  onBackToHangar,
}) => {
  const [selectedRocket, setSelectedRocket] = useState<Rocket>(ROCKETS_CATALOG[0]);

  const isPayloadCompatible = totalSatelliteMassKg <= selectedRocket.maxPayloadLEOKg;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-cyan-500/30 pb-4 mb-6">
        <div>
          <span className="text-cyan-400 text-xs tracking-[0.3em] uppercase">Fase 02 • Integración Orbital</span>
          <h1 className="text-2xl font-bold tracking-wider uppercase text-white">Selección del Vehículo de Lanzamiento</h1>
        </div>
        <button
          onClick={onBackToHangar}
          className="px-4 py-2 text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={14} /> Volver al Hangar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Catálogo de Cohetes (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-cyan-400">Cohetes Disponibles</h2>
          <div className="space-y-3">
            {ROCKETS_CATALOG.map((rocket) => {
              const isSelected = selectedRocket.id === rocket.id;
              const fitsMass = totalSatelliteMassKg <= rocket.maxPayloadLEOKg;

              return (
                <div
                  key={rocket.id}
                  onClick={() => setSelectedRocket(rocket)}
                  className={`cursor-pointer p-4 border transition-all rounded-lg ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase">{rocket.provider}</span>
                      <h3 className="text-lg font-bold text-white tracking-wide">{rocket.name}</h3>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded font-mono ${fitsMass ? 'bg-green-950 text-green-400 border border-green-800' : 'bg-red-950 text-red-400 border border-red-800'}`}>
                      Capacidad: {rocket.maxPayloadLEOKg} kg
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">{rocket.description}</p>
                  
                  <div className="flex justify-between text-xs text-slate-300 font-mono border-t border-slate-800/80 pt-2">
                    <span>Costo: \${(rocket.costUSD / 1e6).toFixed(1)}M</span>
                    <span>Confiabilidad: {rocket.reliabilityPercent}%</span>
                    <span>Cofia: ∅ {rocket.fairingDiameterM}m</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inspección de Cofia e Integración (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 p-6 rounded-lg flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-wider uppercase text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <RocketIcon className="text-cyan-400" size={18} /> Diagnóstico de Integración en Cofia
            </h2>

            <div className="space-y-6">
              
              {/* Representación Gráfica de Masa */}
              <div className="bg-slate-950 p-4 rounded border border-slate-800">
                <div className="flex justify-between text-xs tracking-widest mb-2">
                  <span className="text-slate-400 flex items-center gap-1"><Scale size={14} /> MASA DEL SATÉLITE</span>
                  <span className={isPayloadCompatible ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                    {totalSatelliteMassKg} kg / {selectedRocket.maxPayloadLEOKg} kg Máx.
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${isPayloadCompatible ? 'bg-cyan-400' : 'bg-red-500'}`}
                    style={{ width: `${Math.min((totalSatelliteMassKg / selectedRocket.maxPayloadLEOKg) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Especificaciones de Lanzamiento */}
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-slate-500 block mb-1">PROVEEDOR</span>
                  <span className="text-white text-sm font-bold">{selectedRocket.provider}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-slate-500 block mb-1">COSTO DE MISIÓN</span>
                  <span className="text-cyan-400 text-sm font-bold">\${(selectedRocket.costUSD / 1e6).toFixed(1)}M USD</span>
                </div>
              </div>

              {/* Alertas */}
              {!isPayloadCompatible ? (
                <div className="flex items-center gap-3 text-red-400 bg-red-950/40 p-4 rounded border border-red-900 text-xs leading-relaxed">
                  <AlertTriangle size={24} className="shrink-0" />
                  <span><strong>Exceso de Carga:</strong> El satélite pesa {totalSatelliteMassKg} kg y supera la capacidad del cohete {selectedRocket.name} ({selectedRocket.maxPayloadLEOKg} kg). Selecciona un cohete más grande.</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-green-400 bg-green-950/40 p-4 rounded border border-green-900 text-xs leading-relaxed">
                  <ShieldCheck size={24} className="shrink-0" />
                  <span><strong>Integración Aprobada:</strong> Carga compatible con la cofia de {selectedRocket.fairingDiameterM}m de diámetro. Cohete listo para secuencia de ignición.</span>
                </div>
              )}

            </div>
          </div>

          <button
            disabled={!isPayloadCompatible}
            onClick={() => onProceedToControl(selectedRocket)}
            className={`w-full py-4 uppercase tracking-[0.2em] font-bold text-xs flex items-center justify-center gap-2 transition-all mt-6 ${
              isPayloadCompatible
                ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)] cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            Iniciar Lanzamiento y Monitoreo <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};