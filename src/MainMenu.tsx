import React, { useState } from 'react';

// --- TIPOS DE DATOS ---
type MenuState = 'MAIN' | 'PLAY' | 'NEW_GAME' | 'LOAD_GAME' | 'SETTINGS' | 'CREDITS';

interface MainMenuProps {
  onStartNewGame: (difficultyId: string) => void;
  onLoadGame: (saveId: number) => void;
}

const DIFFICULTIES = [
  { id: 'relajado', title: 'Relajado', desc: 'Presupuestos ilimitados y sin degradación térmica. Ideal para aprender.' },
  { id: 'normal', title: 'Normal', desc: 'La experiencia estándar. Recursos balanceados y latencia de señal realista.' },
  { id: 'supervivencia', title: 'Supervivencia', desc: 'Presupuestos ajustados, alta radiación y fallos de componentes estocásticos.' },
  { id: 'personalizado', title: 'Personalizado', desc: 'Ajusta manualmente los multiplicadores de costo, masa y latencia.' },
  { id: 'creativo', title: 'Creativo', desc: 'Todo desbloqueado. Construye naves sin importar las leyes de la física.' },
];

const NASA_NEWS = [
  { date: '15 OCT 2026', title: 'Actualización Artemis III', summary: 'Nuevos módulos TRL 8 añadidos al catálogo de TechPort.' },
  { date: '12 OCT 2026', title: 'Tormenta Solar Detectada', summary: 'Aumento de radiación en órbitas marcianas. Ajusta tus escudos.' },
  { date: '08 OCT 2026', title: 'Misión Europa Clipper', summary: 'Datos de telemetría reales de Júpiter ya disponibles en el simulador.' },
];

const SAVED_GAMES = [
  { id: 1, name: 'Misión Júpiter-Alfa', playtime: '14h 22m', date: 'Ayer' },
  { id: 2, name: 'Satélite LEO Climático', playtime: '3h 10m', date: '10 Oct' },
];

export const MainMenu: React.FC<MainMenuProps> = ({ onStartNewGame, onLoadGame }) => {
  const [currentMenu, setCurrentMenu] = useState<MenuState>('MAIN');
  const [hoveredDifficulty, setHoveredDifficulty] = useState(DIFFICULTIES[1]);

  const NMSButton = ({ title, onClick, onMouseEnter }: { title: string, onClick: () => void, onMouseEnter?: () => void }) => (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className="w-full text-left px-6 py-4 text-white uppercase tracking-[0.3em] font-light transition-all duration-300 border-l-4 border-transparent hover:border-cyan-400 hover:bg-white/10 hover:pl-8 focus:outline-none"
    >
      {title}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200 font-sans flex overflow-hidden">
      
      {/* Columna Izquierda: Menús de Navegación */}
      <div className="w-1/3 min-w-[400px] h-screen flex flex-col justify-center border-r border-white/5 bg-black/40 backdrop-blur-md z-10">
        
        <div className="px-10 mb-16">
          <h1 className="text-4xl font-bold tracking-[0.4em] text-white mb-2 uppercase">Orbital</h1>
          <h2 className="text-2xl font-light tracking-[0.5em] text-cyan-500 uppercase">Architect</h2>
          <div className="h-px w-24 bg-cyan-500/50 mt-6"></div>
        </div>

        <div className="flex flex-col space-y-2 px-4">
          {/* MENÚ PRINCIPAL */}
          {currentMenu === 'MAIN' && (
            <>
              <NMSButton title="Jugar" onClick={() => setCurrentMenu('PLAY')} />
              <NMSButton title="Noticias NASA" onClick={() => setCurrentMenu('MAIN')} />
              <NMSButton title="Ajustes" onClick={() => setCurrentMenu('SETTINGS')} />
              <NMSButton title="Créditos" onClick={() => setCurrentMenu('CREDITS')} />
            </>
          )}

          {/* MENÚ JUGAR */}
          {currentMenu === 'PLAY' && (
            <>
              <NMSButton title="Continuar Partida" onClick={() => setCurrentMenu('LOAD_GAME')} />
              <NMSButton title="Nuevo Juego" onClick={() => setCurrentMenu('NEW_GAME')} />
              <div className="my-4 h-px w-full bg-white/10"></div>
              <NMSButton title="< Volver" onClick={() => setCurrentMenu('MAIN')} />
            </>
          )}

          {/* MENÚ NUEVO JUEGO (DIFICULTADES) */}
          {currentMenu === 'NEW_GAME' && (
            <>
              {DIFFICULTIES.map((diff) => (
                <NMSButton 
                  key={diff.id} 
                  title={diff.title} 
                  onMouseEnter={() => setHoveredDifficulty(diff)}
                  onClick={() => onStartNewGame(diff.id)} 
                />
              ))}
              <div className="my-4 h-px w-full bg-white/10"></div>
              <NMSButton title="< Volver" onClick={() => setCurrentMenu('PLAY')} />
            </>
          )}

          {/* MENÚ CARGAR PARTIDA */}
          {currentMenu === 'LOAD_GAME' && (
            <>
              {SAVED_GAMES.map((save) => (
                <div 
                  key={save.id} 
                  onClick={() => onLoadGame(save.id)}
                  className="group cursor-pointer px-6 py-4 border-l-4 border-transparent hover:border-cyan-400 hover:bg-white/10 transition-all"
                >
                  <div className="text-white tracking-[0.2em] uppercase">{save.name}</div>
                  <div className="text-sm text-slate-400 tracking-widest mt-1">Tiempo: {save.playtime} | {save.date}</div>
                </div>
              ))}
              <div className="my-4 h-px w-full bg-white/10"></div>
              <NMSButton title="< Volver" onClick={() => setCurrentMenu('PLAY')} />
            </>
          )}

          {/* AJUSTES Y CRÉDITOS */}
          {(currentMenu === 'SETTINGS' || currentMenu === 'CREDITS') && (
            <>
              <div className="px-6 py-4 text-slate-400 tracking-widest text-sm">
                {currentMenu === 'SETTINGS' ? 'Configuración de audio y gráficos.' : 'Desarrollado para NASA Space Apps Challenge.'}
              </div>
              <div className="my-4 h-px w-full bg-white/10"></div>
              <NMSButton title="< Volver" onClick={() => setCurrentMenu('MAIN')} />
            </>
          )}
        </div>
      </div>

      {/* Columna Derecha: Contenido Dinámico */}
      <div className="flex-1 p-16 flex flex-col justify-center relative">
        {(currentMenu === 'MAIN' || currentMenu === 'PLAY') && (
          <div className="max-w-xl animate-fade-in">
            <h3 className="text-cyan-500 tracking-[0.3em] uppercase text-sm mb-6 border-b border-white/10 pb-2">Transmisión de Red - DSN</h3>
            <div className="space-y-6">
              {NASA_NEWS.map((news, idx) => (
                <div key={idx} className="bg-white/5 p-6 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
                  <div className="text-xs text-cyan-400 mb-2 tracking-widest">{news.date}</div>
                  <h4 className="text-lg text-white uppercase tracking-wider mb-2">{news.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{news.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentMenu === 'NEW_GAME' && (
          <div className="max-w-xl animate-fade-in bg-black/60 p-10 border border-white/10 backdrop-blur-md">
            <h3 className="text-3xl text-white uppercase tracking-[0.2em] mb-4">{hoveredDifficulty.title}</h3>
            <div className="h-px w-16 bg-cyan-500 mb-6"></div>
            <p className="text-slate-300 text-lg leading-relaxed">{hoveredDifficulty.desc}</p>
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm tracking-widest text-slate-500">
              <div>MULTIPLI. COSTO: <span className="text-white">x{hoveredDifficulty.id === 'supervivencia' ? '1.5' : '1.0'}</span></div>
              <div>FALLOS SISTEMA: <span className="text-white">{hoveredDifficulty.id === 'supervivencia' ? 'ALTO' : 'NORMAL'}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};