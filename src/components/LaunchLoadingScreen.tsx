import React, { useEffect, useState } from 'react';
import { Rocket } from 'lucide-react';

interface LaunchLoadingScreenProps {
  onLaunchComplete: () => void;
}

export const LaunchLoadingScreen: React.FC<LaunchLoadingScreenProps> = ({ onLaunchComplete }) => {
  const [log, setLog] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sequence = [
      { time: 500, msg: "T-00:10: Secuencia de ignición iniciada...", prog: 10 },
      { time: 1500, msg: "T-00:00: ¡DESPEGUE! Vehículo liberado de la plataforma.", prog: 30 },
      { time: 3000, msg: "T+01:15: Superando Max-Q (Máxima presión aerodinámica).", prog: 50 },
      { time: 4500, msg: "T+02:30: MECO (Apagado del motor principal).", prog: 70 },
      { time: 6000, msg: "T+03:00: Separación de la cofia (Fairing separation) confirmada.", prog: 85 },
      { time: 7500, msg: "T+08:45: Inserción orbital exitosa. Desplegando satélite.", prog: 100 },
    ];

    sequence.forEach((step) => {
      setTimeout(() => {
        setLog((prev) => [...prev, step.msg]);
        setProgress(step.prog);
      }, step.time);
    });

    // Finalizar animación después de 9 segundos
    const finishTimer = setTimeout(() => {
      onLaunchComplete();
    }, 9000);

    return () => clearTimeout(finishTimer);
  }, [onLaunchComplete]);

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-10 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-8 animate-bounce">
          <Rocket size={64} className="text-white" />
        </div>
        
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden mb-6">
          <div 
            className="h-full bg-cyan-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="bg-slate-950 border border-slate-800 p-4 rounded h-48 overflow-y-auto">
          {log.map((line, idx) => (
            <div key={idx} className="text-xs mb-2">
              <span className="text-slate-500">[{new Date().toISOString().substring(11, 19)}]</span> {line}
            </div>
          ))}
          {progress < 100 && (
            <div className="text-xs animate-pulse text-slate-500 mt-2">_ Recibiendo telemetría...</div>
          )}
        </div>
      </div>
    </div>
  );
};