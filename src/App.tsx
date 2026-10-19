import React, { useState } from 'react';
import { MainMenu } from './MainMenu';
import { MissionSelector } from './components/MissionSelector';
import { SatelliteHangar } from './components/SatelliteHangar';
import { RocketAssembly } from './components/RocketAssembly';
import { LaunchLoadingScreen } from './components/LaunchLoadingScreen';
import { MissionControl3D } from './components/MissionControl3D';
import { SatelliteComponent } from './data/componentsCatalog';
import { Rocket, ROCKETS_CATALOG } from './data/rocketsCatalog';
import { Mission } from './data/missionsCatalog';

type GameScreen = 'MENU' | 'MISSION_SELECT' | 'HANGAR' | 'ROCKET' | 'LOADING' | 'SIMULATION';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('MENU');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('normal');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [missionComponents, setMissionComponents] = useState<SatelliteComponent[]>([]);
  const [selectedRocket, setSelectedRocket] = useState<Rocket>(ROCKETS_CATALOG[0]);

  return (
    <main className="w-screen h-screen overflow-hidden bg-black">
      
      {/* 1. MENÚ PRINCIPAL */}
      {currentScreen === 'MENU' && (
        <MainMenu
          onStartNewGame={(diff) => {
            setSelectedDifficulty(diff);
            setCurrentScreen('MISSION_SELECT'); // Ahora va al selector de misiones primero
          }}
          onLoadGame={() => setCurrentScreen('SIMULATION')}
        />
      )}

      {/* 2. SELECCIÓN DE MISIÓN */}
      {currentScreen === 'MISSION_SELECT' && (
        <MissionSelector 
          onSelectMission={(mission) => {
            setSelectedMission(mission);
            setCurrentScreen('HANGAR');
          }}
        />
      )}

      {/* 3. HANGAR DEL SATÉLITE */}
      {currentScreen === 'HANGAR' && (
        <SatelliteHangar
          onBackToMenu={() => setCurrentScreen('MENU')}
          onLaunchMission={(configuredComponents) => {
            setMissionComponents(configuredComponents);
            setCurrentScreen('ROCKET');
          }}
        />
      )}

      {/* 4. ENSAMBLAJE DEL COHETE */}
      {currentScreen === 'ROCKET' && (
        <RocketAssembly
          configuredComponents={missionComponents}
          totalSatelliteMassKg={missionComponents.reduce((sum, c) => sum + c.massKg, 0)}
          onBackToHangar={() => setCurrentScreen('HANGAR')}
          onProceedToControl={(rocket) => {
            setSelectedRocket(rocket);
            setCurrentScreen('LOADING'); // Pasa a la pantalla de carga animada
          }}
        />
      )}

      {/* 5. PANTALLA DE CARGA / DESPEGUE */}
      {currentScreen === 'LOADING' && (
        <LaunchLoadingScreen 
          onLaunchComplete={() => setCurrentScreen('SIMULATION')}
        />
      )}

      {/* 6. CENTRO DE CONTROL 3D */}
      {currentScreen === 'SIMULATION' && (
        <MissionControl3D
          configuredComponents={missionComponents}
          rocket={selectedRocket}
          onReturnToMenu={() => setCurrentScreen('MENU')}
        />
      )}

    </main>
  );
}

export default App;