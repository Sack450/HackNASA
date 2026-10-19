export interface SatelliteComponent {
  id: string;
  name: string;
  category: 'PAYLOAD' | 'SOLAR' | 'BATTERY' | 'COMM' | 'PROPULSION';
  massKg: number;
  powerConsumptionW: number;
  costUSD: number;
  description: string;
  specValue: string;
}

export type MaterialType = 'ALUMINUM_7075' | 'CARBON_COMPOSITE' | 'TITANIUM_G5';

export interface MaterialSpec {
  name: string;
  massMultiplier: number;
  costMultiplier: number;
  thermalLimitMaxC: number;
}

export const MATERIALS_DATABASE: Record<MaterialType, MaterialSpec> = {
  ALUMINUM_7075: { name: 'Aluminio 7075-T6', massMultiplier: 1.0, costMultiplier: 1.0, thermalLimitMaxC: 120 },
  CARBON_COMPOSITE: { name: 'Composite Fibra de Carbono', massMultiplier: 0.55, costMultiplier: 2.8, thermalLimitMaxC: 180 },
  TITANIUM_G5: { name: 'Titanio Grado 5', massMultiplier: 1.4, costMultiplier: 3.5, thermalLimitMaxC: 400 }
};

export const COMPONENTS_CATALOG: SatelliteComponent[] = [
  // CARGAS ÚTILES
  {
    id: 'sensor-co2-std',
    name: 'Espectrómetro CO₂ (Standard)',
    category: 'PAYLOAD',
    massKg: 85,
    powerConsumptionW: 120,
    costUSD: 12000000,
    description: 'Mide concentraciones atmosféricas de carbono. Genera 150 GB/día.',
    specValue: '150 GB/día'
  },
  {
    id: 'sensor-co2-hd',
    name: 'Sensor Lidar Multiespectral (Avanzado)',
    category: 'PAYLOAD',
    massKg: 180,
    powerConsumptionW: 280,
    costUSD: 28000000,
    description: 'Alta resolución espacial de gases de efecto invernadero.',
    specValue: '600 GB/día'
  },

  // PANELES SOLARES
  {
    id: 'panel-rigid-small',
    name: 'Paneles Rígidos 4m²',
    category: 'SOLAR',
    massKg: 18,
    powerConsumptionW: -450,
    costUSD: 2500000,
    description: 'Arreglo solar desplegable básico de silicio.',
    specValue: '450W (Luz)'
  },
  {
    id: 'panel-rosa-large',
    name: 'Panel Desplegable ROSA 10m²',
    category: 'SOLAR',
    massKg: 35,
    powerConsumptionW: -1200,
    costUSD: 7500000,
    description: 'Tecnología Roll-Out Solar Array con alta eficiencia GaAs.',
    specValue: '1200W (Luz)'
  },

  // BATERÍAS
  {
    id: 'bat-li-ion-small',
    name: 'Batería Li-Ion 2.5 kWh',
    category: 'BATTERY',
    massKg: 20,
    powerConsumptionW: 0,
    costUSD: 1200000,
    description: 'Almacenamiento estándar para eclipses cortos.',
    specValue: '2.5 kWh'
  },
  {
    id: 'bat-li-ion-large',
    name: 'Módulo de Baterías Solid-State 6.0 kWh',
    category: 'BATTERY',
    massKg: 42,
    powerConsumptionW: 0,
    costUSD: 3800000,
    description: 'Alta densidad energética para misiones de larga duración.',
    specValue: '6.0 kWh'
  },

  // COMUNICACIONES
  {
    id: 'comm-s-band',
    name: 'Antena Parabólica Banda S',
    category: 'COMM',
    massKg: 12,
    powerConsumptionW: 40,
    costUSD: 1800000,
    description: 'Enlace de datos de velocidad media con la red terrestre (DSN).',
    specValue: '50 Mbps'
  },
  {
    id: 'comm-ka-band',
    name: 'Arreglo Enfaseado Banda Ka',
    category: 'COMM',
    massKg: 28,
    powerConsumptionW: 110,
    costUSD: 5200000,
    description: 'Alta velocidad de transferencia de macrodatos científicos.',
    specValue: '450 Mbps'
  }
];