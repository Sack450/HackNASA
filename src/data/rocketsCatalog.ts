export interface Rocket {
  id: string;
  name: string;
  provider: string;
  maxPayloadLEOKg: number;
  fairingDiameterM: number;
  costUSD: number;
  reliabilityPercent: number;
  description: string;
  color: string;
}

export const ROCKETS_CATALOG: Rocket[] = [
  {
    id: 'electron',
    name: 'Electron',
    provider: 'Rocket Lab',
    maxPayloadLEOKg: 300,
    fairingDiameterM: 1.2,
    costUSD: 7500000,
    reliabilityPercent: 94,
    description: 'Lanzador ligero dedicado para microsatélites en órbita baja.',
    color: '#0f172a'
  },
  {
    id: 'falcon9',
    name: 'Falcon 9 Block 5',
    provider: 'SpaceX',
    maxPayloadLEOKg: 22800,
    fairingDiameterM: 5.2,
    costUSD: 67000000,
    reliabilityPercent: 99.2,
    description: 'Vehículo reutilizable de capacidad media-pesada de alta confiabilidad.',
    color: '#f8fafc'
  },
  {
    id: 'sls_block1',
    name: 'Space Launch System (SLS)',
    provider: 'NASA / Boeing',
    maxPayloadLEOKg: 95000,
    fairingDiameterM: 8.4,
    costUSD: 2000000000,
    reliabilityPercent: 100,
    description: 'Cohete superpesado de exploración profunda y programa Artemis.',
    color: '#f97316'
  }
];