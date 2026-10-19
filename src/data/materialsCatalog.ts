export interface Material {
  id: string;
  name: string;
  massMultiplier: number;
  costMultiplier: number;
  color: string;
  roughness: number;
  metalness: number;
  description: string;
}

export interface ThermalCoating {
  id: string;
  name: string;
  massAdditionKg: number;
  costUSD: number;
  thermalEfficiency: number; // Porcentaje de reflexión de radiación
  color: string;
  roughness: number;
  metalness: number;
  description: string;
}

export const MATERIALS: Material[] = [
  { 
    id: 'aluminum', 
    name: 'Aluminio 7075-T6', 
    massMultiplier: 1.0, 
    costMultiplier: 1.0, 
    color: '#94a3b8', 
    roughness: 0.3, 
    metalness: 0.8, 
    description: 'Aleación equilibrada estándar para misiones en LEO.' 
  },
  { 
    id: 'carbon', 
    name: 'Fibra de Carbono (CFRP)', 
    massMultiplier: 0.55, 
    costMultiplier: 2.2, 
    color: '#1e293b', 
    roughness: 0.7, 
    metalness: 0.2, 
    description: 'Ultra ligero (-45% peso). Minimiza el uso de combustible.' 
  },
  { 
    id: 'titanium', 
    name: 'Titanio Grado 5', 
    massMultiplier: 1.4, 
    costMultiplier: 3.5, 
    color: '#475569', 
    roughness: 0.2, 
    metalness: 0.9, 
    description: 'Resistencia térmica extrema para radiación y calor solar.' 
  }
];

export const COATINGS: ThermalCoating[] = [
  { 
    id: 'none', 
    name: 'Sin Aislamiento (Metal Expuesto)', 
    massAdditionKg: 0, 
    costUSD: 0, 
    thermalEfficiency: 20, 
    color: '#64748b', 
    roughness: 0.3, 
    metalness: 0.8, 
    description: 'Riesgo de congelamiento acelerado en el eclipse terrestre.' 
  },
  { 
    id: 'kapton_gold', 
    name: 'Manta Kapton Dorada (MLI)', 
    massAdditionKg: 8, 
    costUSD: 800000, 
    thermalEfficiency: 95, 
    color: '#d97706', 
    roughness: 0.1, 
    metalness: 0.9, 
    description: 'Protección multicapa oficial de la NASA contra congelamiento.' 
  },
  { 
    id: 'mylar_silver', 
    name: 'Mylar Plateado MLI', 
    massAdditionKg: 5, 
    costUSD: 400000, 
    thermalEfficiency: 75, 
    color: '#e2e8f0', 
    roughness: 0.1, 
    metalness: 0.95, 
    description: 'Aislamiento reflectivo económico de grado medio.' 
  }
];