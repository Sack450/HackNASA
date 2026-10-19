import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { COMPONENTS_CATALOG, SatelliteComponent } from '../data/componentsCatalog';
import { Battery, Zap, Scale, DollarSign, Satellite, ArrowRight, AlertTriangle, Eye, RotateCcw } from 'lucide-react';
import { MATERIALS, COATINGS, Material, ThermalCoating } from '../data/materialsCatalog';
import { Layers, Shield } from 'lucide-react';
interface SatelliteHangarProps {
  onLaunchMission: (configuredComponents: SatelliteComponent[]) => void;
  onBackToMenu: () => void;
}

// --- COMPONENTE 3D: MODELO DINÁMICO DEL SATÉLITE ---
const DynamicSatellite3D = ({ selectedIds }: { selectedIds: string[] }) => {
  const satelliteRef = useRef<THREE.Group>(null!);
const [selectedMaterial, setSelectedMaterial] = useState<Material>(MATERIALS[0]);
const [selectedCoating, setSelectedCoating] = useState<ThermalCoating>(COATINGS[1]);
  // Rotación suave e inerte de presentación
  useFrame((_, delta) => {
    if (satelliteRef.current) {
      satelliteRef.current.rotation.y += delta * 0.15;
    }
  });

  // Verificamos qué partes están seleccionadas
  const hasRigidSolar = selectedIds.includes('panel-rigid-small');
  const hasRosaSolar = selectedIds.includes('panel-rosa-large');
  const hasStdPayload = selectedIds.includes('sensor-co2-std');
  const hasHdPayload = selectedIds.includes('sensor-co2-hd');
  const hasSBandComm = selectedIds.includes('comm-s-band');
  const hasKaBandComm = selectedIds.includes('comm-ka-band');
  const hasLargeBattery = selectedIds.includes('bat-li-ion-large');

  return (
    <group ref={satelliteRef} position={[0, 0, 0]}>
      {/* 1. CHASIS PRINCIPAL (Bus del Satélite con cubierta dorada tipo MLI) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 1.6, 1.2]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Anillo de acople inferior (interfaz con el cohete) */}
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.5, 0.6, 0.2, 32]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 2. ENSAMBLAJE DE PANELES SOLARES (Lados Izquierdo y Derecho) */}
      {(hasRigidSolar || hasRosaSolar) && (
        <group>
          {/* Ala Izquierda */}
          <group position={[-0.7, 0, 0]}>
            {/* Brazo de extensión */}
            <mesh position={[-0.3, 0, 0]}>
              <boxGeometry args={[0.6, 0.08, 0.08]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} />
            </mesh>
            {/* Panel */}
            <mesh position={hasRosaSolar ? [-1.8, 0, 0] : [-1.2, 0, 0]}>
              <boxGeometry args={[hasRosaSolar ? 2.4 : 1.4, 0.04, 1.2]} />
              <meshStandardMaterial color="#1e3a8a" roughness={0.1} metalness={0.8} />
            </mesh>
          </group>

          {/* Ala Derecha */}
          <group position={[0.7, 0, 0]}>
            {/* Brazo de extensión */}
            <mesh position={[0.3, 0, 0]}>
              <boxGeometry args={[0.6, 0.08, 0.08]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} />
            </mesh>
            {/* Panel */}
            <mesh position={hasRosaSolar ? [1.8, 0, 0] : [1.2, 0, 0]}>
              <boxGeometry args={[hasRosaSolar ? 2.4 : 1.4, 0.04, 1.2]} />
              <meshStandardMaterial color="#1e3a8a" roughness={0.1} metalness={0.8} />
            </mesh>
          </group>
        </group>
      )}

      {/* 3. ENSAMBLAJE DE CARGA ÚTIL / SENSORES (Parte Superior) */}
      {(hasStdPayload || hasHdPayload) && (
        <group position={[0, 0.9, 0]}>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.35, 0.45, 0.4, 32]} />
            <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.2} />
          </mesh>
          {/* Lente o Sensor Óptico */}
          <mesh position={[0, 0.41, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.05, 32]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.0} metalness={1.0} />
          </mesh>
        </group>
      )}

      {/* 4. ENSAMBLAJE DE ANTENAS DE COMUNICACIÓN (Cara Frontal/Superior) */}
      {(hasSBandComm || hasKaBandComm) && (
        <group position={[0, 0.3, 0.65]} rotation={[Math.PI / 4, 0, 0]}>
          {/* Mástil */}
          <mesh position={[0, 0, 0.15]}>
            <cylinderGeometry args={[0.03, 0.03, 0.3, 16]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </mesh>
          {/* Plato de la Parabólica */}
          <mesh position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <sphereGeometry args={hasKaBandComm ? [0.45, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.4] : [0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.3} roughness={0.4} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* 5. MÓDULOS DE BATERÍA ADICIONALES (Laterales Internos) */}
      {hasLargeBattery && (
        <group>
          <mesh position={[0, 0, 0.62]}>
            <boxGeometry args={[0.7, 0.5, 0.08]} />
            <meshStandardMaterial color="#10b981" metalness={0.5} roughness={0.3} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// --- COMPONENTE PRINCIPAL DEL HANGAR ---
export const SatelliteHangar: React.FC<SatelliteHangarProps> = ({ onLaunchMission, onBackToMenu }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'sensor-co2-std',
    'panel-rigid-small',
    'bat-li-ion-small',
    'comm-s-band'
  ]);

  const maxBudgetUSD = 30000000;
  const maxMassKg = 300;

  const toggleComponent = (comp: SatelliteComponent) => {
    if (selectedIds.includes(comp.id)) {
      setSelectedIds(selectedIds.filter(id => id !== comp.id));
    } else {
      const categoryFiltered = selectedIds.filter(
        id => COMPONENTS_CATALOG.find(c => c.id === id)?.category !== comp.category
      );
      setSelectedIds([...categoryFiltered, comp.id]);
    }
  };

  const selectedComponents = COMPONENTS_CATALOG.filter(c => selectedIds.includes(c.id));
  // Reemplaza el cálculo de totalMassKg y totalCostUSD por estos:
const baseMassKg = selectedComponents.reduce((sum, c) => sum + c.massKg, 0);
const totalMassKg = Math.round(baseMassKg * selectedMaterial.massMultiplier + selectedCoating.massAdditionKg);

const baseCostUSD = selectedComponents.reduce((sum, c) => sum + c.costUSD, 0);
const totalCostUSD = baseCostUSD * selectedMaterial.costMultiplier + selectedCoating.costUSD;
  
  const powerGenerationW = Math.abs(
    selectedComponents.filter(c => c.powerConsumptionW < 0).reduce((sum, c) => sum + c.powerConsumptionW, 0)
  );
  const powerConsumptionW = selectedComponents
    .filter(c => c.powerConsumptionW > 0)
    .reduce((sum, c) => sum + c.powerConsumptionW, 0);

  const netPowerDaylightW = powerGenerationW - powerConsumptionW;

  const isMassValid = totalMassKg <= maxMassKg;
  const isCostValid = totalCostUSD <= maxBudgetUSD;
  const hasPayload = selectedComponents.some(c => c.category === 'PAYLOAD');
  const isReadyToLaunch = isMassValid && isCostValid && hasPayload && netPowerDaylightW > 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col font-sans">
      
      {/* Encabezado Superior */}
      <div className="flex justify-between items-center border-b border-cyan-500/30 pb-4 mb-4">
        <div>
          <span className="text-cyan-400 text-xs tracking-[0.3em] uppercase">Misión 01 • VAB Assembly Studio</span>
          <h1 className="text-2xl font-bold tracking-wider uppercase text-white">Ensamblaje del Satélite Climático</h1>
        </div>
        <button 
          onClick={onBackToMenu}
          className="px-4 py-2 text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 uppercase tracking-widest transition-colors"
        >
          Volver al Menú
        </button>
      </div>

      {/* Grid de 3 Columnas: Catálogo (Izquierda) | Visor 3D (Centro) | Balance (Derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* COLUMNA 1: Catálogo de Módulos (4 Cols) */}
        <div className="lg:col-span-4 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)] pr-2">
          {['PAYLOAD', 'SOLAR', 'BATTERY', 'COMM'].map((cat) => (
            <div key={cat} className="bg-slate-900/80 border border-slate-800 p-3 rounded">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-cyan-400 mb-2">
                {cat === 'PAYLOAD' ? '1. Carga Útil (Sensores)' : 
                 cat === 'SOLAR' ? '2. Generación de Energía' : 
                 cat === 'BATTERY' ? '3. Baterías' : '4. Telecomunicaciones'}
              </h2>
              <div className="space-y-2">
                {COMPONENTS_CATALOG.filter(c => c.category === cat).map((comp) => {
                  const isSelected = selectedIds.includes(comp.id);
                  return (
                    <div
                      key={comp.id}
                      onClick={() => toggleComponent(comp)}
                      className={`cursor-pointer p-3 border transition-all rounded ${
                        isSelected 
                          ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]' 
                          : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-white text-xs tracking-wide">{comp.name}</span>
                        <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 font-mono">
                          {comp.specValue}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-2 leading-tight">{comp.description}</p>
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
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

        {/* COLUMNA 2: VISOR 3D DE ENSAMBLAJE (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-lg p-2 flex flex-col relative overflow-hidden h-[500px] lg:h-auto">
          <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 text-[10px] tracking-widest text-slate-300 uppercase flex items-center gap-2">
            <Eye size={12} className="text-cyan-400" /> Vista Hangar VAB (Arrastra para rotar)
          </div>

          <div className="w-full h-full">
            <Canvas camera={{ position: [3.5, 2.5, 4.5], fov: 45 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} />
              <pointLight position={[-10, -10, -5]} intensity={0.5} color="#0284c7" />

              {/* Grilla del suelo estilo KSP */}
              <Grid infiniteGrid cellSize={0.5} sectionSize={2.0} fadeDistance={15} cellColor="#334155" sectionColor="#0891b2" />

              {/* Modelo 3D Interactivo */}
              <DynamicSatellite3D selectedIds={selectedIds} />

              <OrbitControls makeDefault minDistance={2} maxDistance={10} />
            </Canvas>
          </div>
        </div>

        {/* COLUMNA 3: DASHBOARD DE MÁRGENES DE INGENIERÍA (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between rounded-lg">
          <div>
            <h2 className="text-sm font-bold tracking-wider uppercase text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <Satellite className="text-cyan-400" size={18} /> Balance de Sistemas
            </h2>

            <div className="space-y-5">
              {/* Masa */}
              <div>
                <div className="flex justify-between text-xs tracking-widest mb-1">
                  <span className="text-slate-400 flex items-center gap-1"><Scale size={13} /> MASA TOTAL</span>
                  <span className={isMassValid ? 'text-cyan-400' : 'text-red-400 font-bold'}>
                    {totalMassKg} / {maxMassKg} kg
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${isMassValid ? 'bg-cyan-400' : 'bg-red-500'}`}
                    style={{ width: `${Math.min((totalMassKg / maxMassKg) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Presupuesto */}
              <div>
                <div className="flex justify-between text-xs tracking-widest mb-1">
                  <span className="text-slate-400 flex items-center gap-1"><DollarSign size={13} /> COSTO ESTIMADO</span>
                  <span className={isCostValid ? 'text-cyan-400' : 'text-red-400 font-bold'}>
                    ${(totalCostUSD / 1e6).toFixed(1)}M / ${(maxBudgetUSD / 1e6).toFixed(0)}M
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${isCostValid ? 'bg-cyan-400' : 'bg-red-500'}`}
                    style={{ width: `${Math.min((totalCostUSD / maxBudgetUSD) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Energía */}
              <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1.5">
                <div className="text-[11px] text-slate-400 tracking-widest flex items-center gap-1 mb-1">
                  <Zap size={13} className="text-yellow-400" /> BALANCE DE ENERGÍA (LEO)
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Generación (Luz):</span>
                  <span className="text-green-400">+{powerGenerationW} W</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Consumo Continuo:</span>
                  <span className="text-red-400">-{powerConsumptionW} W</span>
                </div>
                <div className="flex justify-between text-xs font-mono pt-1.5 border-t border-slate-800">
                  <span className="text-slate-300 font-bold">Margen Día:</span>
                  <span className={netPowerDaylightW > 0 ? 'text-cyan-400 font-bold' : 'text-red-400 font-bold'}>
                    {netPowerDaylightW > 0 ? `+${netPowerDaylightW} W` : `${netPowerDaylightW} W`}
                  </span>
                </div>
              </div>

              {/* Alertas */}
              <div className="space-y-1.5 text-[11px]">
                {!isMassValid && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-950/40 p-2 rounded border border-red-900">
                    <AlertTriangle size={14} /> Exceso de masa para el vehículo de lanzamiento.
                  </div>
                )}
                {!isCostValid && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-950/40 p-2 rounded border border-red-900">
                    <AlertTriangle size={14} /> Presupuesto excedido.
                  </div>
                )}
                {netPowerDaylightW <= 0 && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-950/40 p-2 rounded border border-red-900">
                    <AlertTriangle size={14} /> Generación solar insuficiente.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botón Aprobación PDR */}
          <button
            disabled={!isReadyToLaunch}
            onClick={() => onLaunchMission(selectedComponents)}
            className={`w-full py-3.5 uppercase tracking-[0.2em] font-bold text-xs flex items-center justify-center gap-2 transition-all mt-4 ${
              isReadyToLaunch 
                ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)] cursor-pointer' 
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            Aprobar PDR y Lanzar <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};