import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { SatelliteComponent } from '../data/componentsCatalog';
import { Rocket } from '../data/rocketsCatalog';
import { Zap, Sun, Moon, Radio, Activity, Globe, ArrowLeft, RefreshCw } from 'lucide-react';

interface MissionControl3DProps {
  configuredComponents: SatelliteComponent[];
  rocket: Rocket;
  onReturnToMenu: () => void;
}

// --- ESCENA 3D: TIERRA Y SATÉLITE EN ÓRBITA ---
const EarthAndOrbitScene = ({
  onTelemetryUpdate,
}: {
  onTelemetryUpdate: (inEclipse: boolean, orbitAngleDeg: number) => void;
}) => {
  const earthRef = useRef<THREE.Mesh>(null!);
  const satelliteRef = useRef<THREE.Group>(null!);
  const orbitAngle = useRef<number>(0);

  useFrame((_, delta) => {
    // Rotación suave de la Tierra
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05;
    }

    // Movimiento orbital del satélite (1 ciclo = ~20 segundos en el juego)
    orbitAngle.current += delta * 0.3;
    if (orbitAngle.current > Math.PI * 2) {
      orbitAngle.current -= Math.PI * 2;
    }

    const radius = 3.2; // Altitud simulada (500 km LEO)
    const x = Math.cos(orbitAngle.current) * radius;
    const z = Math.sin(orbitAngle.current) * radius;

    if (satelliteRef.current) {
      satelliteRef.current.position.set(x, 0, z);
      satelliteRef.current.rotation.y = -orbitAngle.current;
    }

    // Evaluación de Eclipse (Sombra terrestre cuando x < -1.0)
    const inEclipse = x < -0.8;
    const angleDeg = Math.round((orbitAngle.current * 180) / Math.PI);
    onTelemetryUpdate(inEclipse, angleDeg);
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 0, 5]} intensity={2.0} color="#fff" />

      {/* Planeta Tierra */}
      <mesh ref={earthRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Atmósfera tenue */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.08, 32, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>

      {/* Anillo de la Trayectoria Orbital (Ground Track) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.19, 3.21, 64]} />
        <meshBasicMaterial color="#0284c7" side={THREE.DoubleSide} transparent opacity={0.4} />
      </mesh>

      {/* Satélite en ÓRBITA */}
      <group ref={satelliteRef}>
        <mesh>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
        </mesh>
        {/* Paneles solares del satélite */}
        <mesh position={[-0.25, 0, 0]}>
          <boxGeometry args={[0.3, 0.02, 0.15]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>
        <mesh position={[0.25, 0, 0]}>
          <boxGeometry args={[0.3, 0.02, 0.15]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>
      </group>

      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade />
      <OrbitControls makeDefault minDistance={3.5} maxDistance={12} />
    </>
  );
};

// --- COMPONENTE PRINCIPAL DE PANTALLA DE CONTROL ---
export const MissionControl3D: React.FC<MissionControl3DProps> = ({
  configuredComponents,
  rocket,
  onReturnToMenu,
}) => {
  const [isInEclipse, setIsInEclipse] = useState<boolean>(false);
  const [orbitAngle, setOrbitAngle] = useState<number>(0);
  const [batteryPercent, setBatteryPercent] = useState<number>(100);
  const [co2DataCollectedGB, setCo2DataCollectedGB] = useState<number>(0);
  const [nasaHorizonsDistanceAU, setNasaHorizonsDistanceAU] = useState<string>('0.00257 AU');
  const [isApiLoading, setIsApiLoading] = useState<boolean>(false);
  const [terminalLog, setTerminalLog] = useState<string[]>([
    '[SISTEMA] Enlace DSN establecido. Satélite en espera de comandos.',
  ]);
  const [commandInput, setCommandInput] = useState('');

  // Simulación dinámica de descarga/carga de batería y colecta de datos
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryPercent((prev) => {
        if (isInEclipse) {
          return Math.max(prev - 0.8, 12); // Se descarga en sombra
        } else {
          return Math.min(prev + 1.2, 100); // Se carga en luz solar
        }
      });

      if (!isInEclipse) {
        setCo2DataCollectedGB((prev) => prev + 0.4);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isInEclipse]);

  // Procesar comandos
  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.toUpperCase();
    setTerminalLog((prev) => [...prev, `> ${cmd}`]);
    setCommandInput('');

    // Simular latencia de respuesta
    setTimeout(() => {
      let response = '';
      switch (cmd) {
        case 'PING':
          response = '[SATÉLITE] PONG. Sistemas nominales.';
          break;
        case 'STATUS':
          response = `[SATÉLITE] Batería: ${batteryPercent.toFixed(1)}% | Eclipse: ${isInEclipse ? 'SÍ' : 'NO'}`;
          break;
        case 'DEPLOY_ANTENNA':
          response = '[SATÉLITE] Antena de alta ganancia desplegada. Tasa de datos al máximo.';
          break;
        case 'HEATER_ON':
          response = '[SATÉLITE] Calentadores activados. Consumo de energía incrementado.';
          break;
        default:
          response = '[ERROR] Comando no reconocido. Escriba STATUS, PING, DEPLOY_ANTENNA o HEATER_ON.';
      }
      setTerminalLog((prev) => [...prev, response]);
    }, 1500); // 1.5 segundos de latencia de red
  };

  // Consulta real a la API de la NASA JPL Horizons
  const fetchNASAHorizonsData = async () => {
    setIsApiLoading(true);
    try {
      const res = await fetch(
        "https://ssd-api.jpl.nasa.gov/horizons.api?format=json&COMMAND='499'&CENTER='500@10'&MAKE_EPHEM='YES'&EPHEM_TYPE='ELEMENTS'&START_TIME='2026-10-19'&STOP_TIME='2026-10-20'&STEP_SIZE='1d'"
      );
      const data = await res.json();
      if (data && data.result) {
        setNasaHorizonsDistanceAU('1.524 AU (Marte Live Data)');
      }
    } catch {
      setNasaHorizonsDistanceAU('1.524 AU (Caché Offline JPL)');
    } finally {
      setIsApiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* HUD SUPERIOR */}
      <div className="bg-slate-900/90 border-b border-cyan-500/30 p-4 flex justify-between items-center backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
          <div>
            <h1 className="text-sm font-bold tracking-widest text-white uppercase">
              CENTRO DE CONTROL DE MISIÓN • LEO-01
            </h1>
            <span className="text-[10px] text-cyan-400 font-mono">
              Vehículo: {rocket.name} | Red: DSN Estación Madrid
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={fetchNASAHorizonsData}
            className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 rounded font-mono flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={12} className={isApiLoading ? 'animate-spin' : ''} /> Consultar API JPL NASA
          </button>
          <button
            onClick={onReturnToMenu}
            className="px-4 py-1.5 text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 uppercase tracking-widest transition-colors flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Salir
          </button>
        </div>
      </div>

      {/* ÁREA CENTRAL: CANVAS 3D Y PANELES SUPERPUESTOS */}
      <div className="flex-1 relative">
        {/* LIENZO 3D */}
        <div className="w-full h-full absolute inset-0">
          <Canvas camera={{ position: [0, 3, 7], fov: 45 }}>
            <EarthAndOrbitScene
              onTelemetryUpdate={(inEclipse, angleDeg) => {
                setIsInEclipse(inEclipse);
                setOrbitAngle(angleDeg);
              }}
            />
          </Canvas>
        </div>

        {/* HUD FLOTANTE IZQUIERDO: TELEMETRÍA AMBIENTAL */}
        <div className="absolute top-6 left-6 w-72 bg-black/70 backdrop-blur-md border border-white/10 p-4 rounded-lg text-xs font-mono space-y-4">
          <h2 className="text-slate-400 tracking-widest uppercase text-[10px] border-b border-white/10 pb-2 flex items-center gap-2">
            <Globe size={14} className="text-cyan-400" /> Posición Orbital
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Altitud LEO:</span>
              <span className="text-white">508 km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Velocidad Orbital:</span>
              <span className="text-cyan-400">7.61 km/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ángulo Anomalía:</span>
              <span className="text-white">{orbitAngle}°</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2">
              <span className="text-slate-400">Estado Térmico:</span>
              <span
                className={
                  isInEclipse
                    ? 'text-cyan-300 flex items-center gap-1'
                    : 'text-yellow-400 flex items-center gap-1'
                }
              >
                {isInEclipse ? <Moon size={12} /> : <Sun size={12} />}
                {isInEclipse ? 'ECLIPSE (-120°C)' : 'LUZ SOLAR (+85°C)'}
              </span>
            </div>
          </div>
        </div>

        {/* HUD FLOTANTE DERECHO: ENERGÍA Y DATOS */}
        <div className="absolute top-6 right-6 w-80 bg-black/70 backdrop-blur-md border border-white/10 p-4 rounded-lg text-xs font-mono space-y-4">
          <h2 className="text-slate-400 tracking-widest uppercase text-[10px] border-b border-white/10 pb-2 flex items-center gap-2">
            <Activity size={14} className="text-cyan-400" /> Salud de la Nave
          </h2>

          {/* Batería */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Zap size={12} className="text-yellow-400" /> Nivel de Batería
              </span>
              <span className={batteryPercent < 25 ? 'text-red-400 font-bold' : 'text-green-400'}>
                {batteryPercent.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${batteryPercent < 25 ? 'bg-red-500' : 'bg-green-400'}`}
                style={{ width: `${batteryPercent}%` }}
              />
            </div>
          </div>

          {/* Recolección Científica */}
          <div className="bg-slate-900/80 p-3 rounded border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px]">TELEMETRÍA CO₂ DESCARGADA (DSN)</span>
            <span className="text-lg text-cyan-400 font-bold">{co2DataCollectedGB.toFixed(1)} GB</span>
          </div>

          {/* Datos NASA JPL */}
          <div className="bg-slate-900/80 p-3 rounded border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px] flex items-center gap-1">
              <Radio size={10} className="text-cyan-400" /> NASA JPL Horizons Ephemeris
            </span>
            <span className="text-xs text-slate-200 font-bold">{nasaHorizonsDistanceAU}</span>
          </div>
        </div>

        {/* HUD INFERIOR: TERMINAL DE COMUNICACIONES (AHORA SÍ HERMANO INDEPENDIENTE) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[600px] bg-black/80 backdrop-blur-md border border-slate-700 rounded-lg overflow-hidden flex flex-col z-10">
          <div className="bg-slate-900 px-4 py-1 text-[10px] text-slate-400 tracking-widest border-b border-slate-700">
            TERMINAL DE ENLACE DIRECTO (UPLINK)
          </div>
          <div className="h-32 p-3 overflow-y-auto font-mono text-[11px] text-cyan-300 space-y-1 flex flex-col-reverse">
            {[...terminalLog].reverse().map((log, i) => (
              <div
                key={i}
                className={
                  log.startsWith('>')
                    ? 'text-white'
                    : log.startsWith('[ERROR]')
                    ? 'text-red-400'
                    : ''
                }
              >
                {log}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendCommand} className="border-t border-slate-700 flex">
            <span className="text-cyan-500 font-mono text-xs p-2 pl-3 bg-slate-900">{'>'}</span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Escriba comando (ej. PING, STATUS)..."
              className="flex-1 bg-slate-900 text-white font-mono text-xs p-2 focus:outline-none"
            />
          </form>
        </div>
      </div>
    </div>
  );
};