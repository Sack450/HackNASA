export interface Mission {
  id: string;
  title: string;
  target: string;
  budgetUSD: number;
  maxMassKg: number;
  description: string;
  objectives: string[];
}

export const MISSIONS_CATALOG: Mission[] = [
  {
    id: 'leo-climate',
    title: 'Satélite Climático LEO',
    target: 'Órbita Baja Terrestre (500 km)',
    budgetUSD: 30000000,
    maxMassKg: 300,
    description: 'Diseña un satélite para monitorear emisiones de CO2. Cuidado con el ciclo de eclipses.',
    objectives: ['Establecer órbita estable', 'Recolectar 50 GB de datos espectrales', 'Sobrevivir 5 ciclos de sombra']
  },
  {
    id: 'mars-orbiter',
    title: 'Orbitador Marciano',
    target: 'Órbita de Marte (1.5 AU)',
    budgetUSD: 150000000,
    maxMassKg: 1200,
    description: 'Sonda interplanetaria. La latencia de señal será de ~12 minutos. Requiere alta protección térmica.',
    objectives: ['Escapar de la gravedad terrestre', 'Establecer enlace DSN de alta ganancia', 'Mapear superficie marciana']
  }
];