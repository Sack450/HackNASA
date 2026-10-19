import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls, Grid, Stage } from '@react-three/drei';
import * as THREE from 'three';

interface InstalledPartProps {
  position: [number, number, number];
  color: string;
  isSelected: boolean;
  onSelect: () => void;
}

// Representación 3D de un componente instalado
const InstalledPart: React.FC<InstalledPartProps> = ({ position, color, isSelected, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  return (
    <>
      <mesh
        ref={meshRef}
        position={position}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={isSelected ? '#22d3ee' : color} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Gizmo de Transformación (Estilo KSP) cuando la pieza está seleccionada */}
      {isSelected && (
        <TransformControls object={meshRef} mode="translate" size={0.75} />
      )}
    </>
  );
};

export const VAB3DEditor: React.FC = () => {
  const [selectedPartIndex, setSelectedPartIndex] = useState<number | null>(0);

  return (
    <div className="w-full h-[500px] bg-slate-950 border border-slate-800 rounded-lg overflow-hidden relative">
      {/* HUD flotante sobre el Canvas 3D */}
      <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md p-3 rounded border border-white/10 text-xs tracking-widest uppercase">
        Herramienta de Anclaje: <span className="text-cyan-400 font-bold">Traslación Activa</span>
      </div>

      <Canvas camera={{ position: [3, 3, 5], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        
        {/* Grilla del Hangar Estilo KSP */}
        <Grid infiniteGrid cellSize={0.5} sectionSize={2.0} fadeDistance={20} cellColor="#334155" sectionColor="#0891b2" />

        {/* Chasis Central de la Nave */}
        <mesh position={[0, 0, 0]} onClick={() => setSelectedPartIndex(null)}>
          <cylinderGeometry args={[0.6, 0.6, 1.8, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Módulo de Panel Solar Añadido con Gizmo */}
        <InstalledPart
          position={[1.1, 0, 0]}
          color="#1e3a8a"
          isSelected={selectedPartIndex === 0}
          onSelect={() => setSelectedPartIndex(0)}
        />

        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
};