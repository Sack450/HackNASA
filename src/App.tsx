import React, { useState } from 'react';
import { MainMenu } from './MainMenu';
import { SatelliteHangar } from './components/SatelliteHangar';
import { SatelliteComponent } from './data/componentsCatalog';

type GameScreen = 'MENU' | 'HANGAR' | 'SIMULATION';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('MENU');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('normal');
  const [missionComponents, setMissionComponents] = useState<SatelliteComponent[]>([]);

  // Al elegir una dificultad en "Nuevo Juego"
  const handleStartNewGame = (difficultyId: string) => {
    setSelectedDifficulty(difficultyId);
    console.log(`Iniciando nueva partida en dificultad: ${difficultyId}`);
    setCurrentScreen('HANGAR'); // Pasa al Hangar de la Misión 1
  };

  // Al seleccionar una partida guardada
  const handleLoadGame = (saveId: number) => {
    console.log(`Cargando partida guardada ID: ${saveId}`);
    setCurrentScreen('SIMULATION'); // Salta directo a la simulación activa
  };

  return (
    <main className="w-screen h-screen overflow-hidden bg-black">
      {/* 1. MENÚ PRINCIPAL */}
      {currentScreen === 'MENU' && (
        <MainMenu 
          onStartNewGame={handleStartNewGame}
          onLoadGame={handleLoadGame}
        />
      )}

      {/* 2. HANGAR DE ENSAMBLAJE (MISIÓN 1) */}
      {currentScreen === 'HANGAR' && (
        <SatelliteHangar 
          onBackToMenu={() => setCurrentScreen('MENU')}
          onLaunchMission={(configuredComponents) => {
            setMissionComponents(configuredComponents);
            setCurrentScreen('SIMULATION');
          }}
        />
      )}

      {/* 3. SIMULACIÓN ORBITAL EN TIEMPO REAL */}
      {currentScreen === 'SIMULATION' && (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8">
          <div className="border border-cyan-500/30 bg-slate-900/80 p-8 rounded-lg max-w-2xl text-center backdrop-blur-md">
            <span className="text-cyan-400 text-xs tracking-[0.3em] uppercase block mb-2">
              Dificultad: {selectedDifficulty.toUpperCase()}
            </span>
            <h1 className="text-3xl font-bold tracking-wider text-white mb-4 uppercase">
              Centro de Control • Satélite Climático
            </h1>
            <p className="text-slate-400 mb-6 text-sm leading-relaxed">
              Satélite desplegado con {missionComponents.length > 0 ? missionComponents.length : '4'} módulos activos. 
              Monitoreando flujo de fotones solares y ciclo de sombra terrestre...
            </p>

            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setCurrentScreen('HANGAR')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-sm tracking-widest uppercase transition-colors"
              >
                Reconfigurar en Hangar
              </button>
              <button 
                onClick={() => setCurrentScreen('MENU')}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm tracking-widest uppercase transition-colors"
              >
                Menú Principal
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;