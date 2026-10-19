import React, { useState } from 'react';
import { COMPONENTS_CATALOG, SatelliteComponent } from '../data/componentsCatalog';
import { Battery, Zap, Scale, DollarSign, Satellite, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SatelliteHangarProps {
  onLaunchMission: (configuredComponents: SatelliteComponent[]) => void;
  onBackToMenu: () => void;
}

export const SatelliteHangar: React.FC<SatelliteHangarProps> = ({ onLaunchMission, onBackToMenu }) => {
  // Estado de componentes seleccionados (por defecto inicia con configuración básica)
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'sensor-co2-std',
    'panel-rigid-small',
    'bat-li-ion-small',
    'comm-s-band'
  ]);

  const maxBudgetUSD = 30000000; // \$30M Presupuesto máximo
  const maxMassKg = 300;         // 300 kg Límite de carga del cohete Electron

  // Alternar selección de componentes
  const toggleComponent = (comp: SatelliteComponent) => {
    if (selectedIds.includes(comp.id)) {
      setSelectedIds(selectedIds.filter(id => id !== comp.id));
    } else {
      // Reemplaza componente de la misma categoría para evitar duplicados en este prototipo
      const categoryFiltered = selectedIds.filter(
        id => COMPONENTS_CATALOG.find(c => c.id === id)?.category !== comp.category
      );
      setSelectedIds([...categoryFiltered, comp.id]);
    }
  };

  // Cálculos de ingeniería en tiempo real
  const selectedComponents = COMPONENTS_CATALOG.filter(c => selectedIds.includes(c.id));
  
  const totalMassKg = selectedComponents.reduce((sum, c) => sum + c.massKg, 0);
  const totalCostUSD = selectedComponents.reduce((sum, c) => sum + c.costUSD, 0);
  
  const powerGenerationW = Math.abs(
    selectedComponents.filter(c => c.powerConsumptionW < 0).reduce((sum, c) => sum + c.powerConsumptionW, 0)
  );
  const powerConsumptionW = selectedComponents
    .filter(c => c.powerConsumptionW > 0)
    .reduce((sum, c) => sum + c.powerConsumptionW, 0);

  const netPowerDaylightW = powerGenerationW - powerConsumptionW;
  const isBatterySufficient = powerGenerationW >= powerConsumptionW * 1.5; // Margen para cargar batería

  const isMassValid = totalMassKg <= maxMassKg;
  const isCostValid = totalCostUSD <= maxBudgetUSD;
  const hasPayload = selectedComponents.some(c => c.category === 'PAYLOAD');
  const isReadyToLaunch = isMassValid && isCostValid && hasPayload && netPowerDaylightW > 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col font-sans">
      
      {/* Encabezado de la Misión */}
      <div className="flex justify-between items-center border-b border-cyan-500/30 pb-4 mb-6">
        <div>
          <span className="text-cyan-400 text-xs tracking-[0.3em] uppercase">Misión 01 • Órbita Baja Terrestre (LEO)</span>
          <h1 className="text-3xl font-bold tracking-wider uppercase text-white">Ensamblaje del Satélite Climático</h1>
        </div>
        <button 
          onClick={onBackToMenu}
          className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 uppercase tracking-widest transition-colors"
        >
          Volver al Menú
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        
        {/* Catálogo de Módulos (2 Columnas en escritorio) */}
        <div className="lg:col-span-2 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)] pr-2">
          {['PAYLOAD', 'SOLAR', 'BATTERY', 'COMM'].map((cat) => (
            <div key={cat} className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg">
              <h2 className="text-sm font-semibold tracking-widest uppercase text-cyan-400 mb-3">
                {cat === 'PAYLOAD' ? '1. Carga Útil (Sensores)' : 
                 cat === 'SOLAR' ? '2. Generación de Energía' : 
                 cat === 'BATTERY' ? '3. Almacenamiento (Baterías)' : '4. Telecomunicaciones'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {COMPONENTS_CATALOG.filter(c => c.category === cat).map((comp) => {
                  const isSelected = selectedIds.includes(comp.id);
                  return (
                    <div
                      key={comp.id}
                      onClick={() => toggleComponent(comp)}
                      className={`cursor-pointer p-4 border transition-all rounded ${
                        isSelected 
                          ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]' 
                          : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-white tracking-wide text-sm">{comp.name}</span>
                        <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-cyan-300 font-mono">
                          {comp.specValue}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3 leading-relaxed">{comp.description}</p>
                      <div className="flex justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-2 font-mono">
                        <span>Masa: {comp.massKg} kg</span>
                        <span>Costo: \${(comp.costUSD / 1e6).toFixed(1)}M</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Panel Lateral: Dashboard de Márgenes de Ingeniería */}
        <div className="bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between rounded-lg backdrop-blur-md">
          <div>
            <h2 className="text-lg font-bold tracking-wider uppercase text-white mb-6 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Satellite className="text-cyan-400" size={20} /> Balance de Sistemas
            </h2>

            <div className="space-y-6">
              
              {/* Presupuesto de Masa */}
              <div>
                <div className="flex justify-between text-xs tracking-widest mb-1">
                  <span className="text-slate-400 flex items-center gap-1"><Scale size={14} /> MASA TOTAL</span>
                  <span className={isMassValid ? 'text-cyan-400' : 'text-red-400 font-bold'}>
                    {totalMassKg} / {maxMassKg} kg
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${isMassValid ? 'bg-cyan-400' : 'bg-red-500'}`}
                    style={{ width: `${Math.min((totalMassKg / maxMassKg) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Presupuesto Financiero */}
              <div>
                <div className="flex justify-between text-xs tracking-widest mb-1">
                  <span className="text-slate-400 flex items-center gap-1"><DollarSign size={14} /> COSTO ESTIMADO</span>
                  <span className={isCostValid ? 'text-cyan-400' : 'text-red-400 font-bold'}>
                    ${(totalCostUSD / 1e6).toFixed(1)}M / ${(maxBudgetUSD / 1e6).toFixed(0)}M
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${isCostValid ? 'bg-cyan-400' : 'bg-red-500'}`}
                    style={{ width: `${Math.min((totalCostUSD / maxBudgetUSD) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Balance Energético */}
              <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400 tracking-widest flex items-center gap-1 mb-2">
                  <Zap size={14} className="text-yellow-400" /> BALANCE DE ENERGÍA (LEO)
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Generación (Luz):</span>
                  <span className="text-green-400">+{powerGenerationW} W</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Consumo Continuo:</span>
                  <span className="text-red-400">-{powerConsumptionW} W</span>
                </div>
                <div className="flex justify-between text-xs font-mono pt-2 border-t border-slate-800">
                  <span className="text-slate-300 font-bold">Margen Neto Día:</span>
                  <span className={netPowerDaylightW > 0 ? 'text-cyan-400 font-bold' : 'text-red-400 font-bold'}>
                    {netPowerDaylightW > 0 ? `+${netPowerDaylightW} W` : `${netPowerDaylightW} W`}
                  </span>
                </div>
              </div>

              {/* Alertas de Ingeniería */}
              <div className="space-y-2 text-xs">
                {!isMassValid && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-950/40 p-2 rounded border border-red-900">
                    <AlertTriangle size={16} /> Exceso de masa para el vehículo de lanzamiento.
                  </div>
                )}
                {!isCostValid && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-950/40 p-2 rounded border border-red-900">
                    <AlertTriangle size={16} /> Presupuesto excedido.
                  </div>
                )}
                {netPowerDaylightW <= 0 && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-950/40 p-2 rounded border border-red-900">
                    <AlertTriangle size={16} /> Generación solar insuficiente para la carga.
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Botón de Lanzamiento */}
          <button
            disabled={!isReadyToLaunch}
            onClick={() => onLaunchMission(selectedComponents)}
            className={`w-full py-4 uppercase tracking-[0.2em] font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              isReadyToLaunch 
                ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)] cursor-pointer' 
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            Aprobar PDR y Lanzar <ArrowRight size={18} />
          </button>

        </div>

      </div>
    </div>
  );
};