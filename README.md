# HackNASA - juego de Ingeniería y Misiones Espaciales

Plataforma interactiva de diseño, ensamblaje, integración orbital y centro de operaciones para misiones espaciales. Este proyecto combina conceptos reales de astrodinámica, ingeniería de sistemas y presupuestos aeroespaciales con gráficos 3D interactivos en tiempo real y telemetría en vivo vía APIs oficiales de la NASA.

---

## Resumen de Actualizaciones (Versión 1 - Actualizacion_V1)

En esta actualización se transformó la experiencia del simulador, pasando de un prototipo básico de selección a un ciclo completo de misión espacial en 3D:

### 1. Selector de Contratos y Misiones (`MissionSelector`)
* **Catálogo de Misiones**: Incorporación de misiones específicas (ej. *Satélite Climático LEO* y *Orbitador Marciano*).
* **Parámetros y Restricciones Reales**: Cada misión define sus propios objetivos, presupuestos financieros máximos en USD y límites estrictos de masa de carga útil.

### 2. Hangar de Ensamblaje Satelital 3D (VAB - `SatelliteHangar` & `DynamicSatellite3D`)
* **Visualización 3D en Tiempo Real**: Integración de `@react-three/fiber` y `@react-three/drei` con renderizado 3D interactivo del satélite según los componentes acoplados (chasis, paneles solares rígidos/ROSA, cargas útiles de espectrometría CO₂, antenas parabólicas en banda S/Ka y bancos de baterías).
* **Sistemas de Materiales y Aislamiento Térmico**:
  * Selección de materiales estructurales (Aluminio 7075-T6, Fibra de Carbono CFRP, Titanio Grado 5) con impacto directo en multiplicadores de masa y costo.
  * Opciones de aislamiento térmico multicapa (MLI) como Manta Kapton Dorada y Mylar Plateado con cálculo de eficiencia térmica.
* **Balances Dinámicos de Ingeniería**: Validación instantánea de márgenes de masa, límites de presupuesto y balance energético (generación solar vs. consumo continuo diurno/nocturno) antes de habilitar la aprobación PDR (*Preliminary Design Review*).

### 3.  Módulo de Integración y Selección del Lanzador (`RocketAssembly`)
* **Catálogo de Cohetes de Lanzamiento**: Comparativa técnica de lanzadores orbitales:
  * *Electron (Rocket Lab)*: Lanzador ligero para microsatélites.
  * *Falcon 9 Block 5 (SpaceX)*: Vehículo reutilizable mediano-pesado.
  * *SLS Block 1 (NASA/Boeing)*: Superpesado para espacio profundo.
* **Diagnóstico de Cofia y Capacidad**: Verificación automática de masa total del satélite vs. capacidad máxima a LEO (*Low Earth Orbit*) y compatibilidad volumétrica con la cofia.

### 4.  Pantalla de Secuencia de Lanzamiento (`LaunchLoadingScreen`)
* **Secuencia de Despegue Realista**: Animación con línea de tiempo cronometrada (*Ignición T-10s*, *Despegue T-0*, *Max-Q*, *MECO*, separación de cofia e inserción orbital con despliegue del satélite).

### 5. Centro de Control de Misión 3D y Telemetría en Vivo (`MissionControl3D`)
* **Simulación Orbital en 3D**: Renderizado orbital interactivo de la Tierra con atmósfera tenue, estrellas y trayectoria del satélite a 508 km de altitud.
* **Ciclo de Eclipse Solar / Sombra Terrestre**:
  * Detección matemática en tiempo real del paso por la sombra de la Tierra.
  * Variación térmica dinámica: ciclo cálido bajo radiación solar (+85°C) y enfriamiento extremo en eclipse (-120°C).
  * Descarga y recarga del banco de baterías según el estado de iluminación.
* **Recolección Científica de Datos**: Descarga acumulativa de telemetría espectral de CO₂ a través de la Red de Espacio Profundo (DSN).
* **Terminal de Enlace de Comandos (Uplink)**:
  * Consola interactiva para enviar comandos a la nave (`STATUS`, `PING`, `DEPLOY_ANTENNA`, `HEATER_ON`) con simulación de latencia de red en espacio exterior.
* **Conexión Directa con la API de la NASA JPL Horizons**:
  * Consulta en vivo a la API SSD/Horizons del *Jet Propulsion Laboratory* de la NASA para obtener datos orbitales y efemérides planetarias.

---

##  Pila Tecnológica

* **Frontend**: React 18, TypeScript, Vite.
* **Gráficos 3D**: Three.js, `@react-three/fiber`, `@react-three/drei`.
* **Estilos & UI**: Tailwind CSS, Lucide React (iconografía aeroespacial y de telemetría).
* **Fuentes de Datos**: NASA JPL SSD / Horizons API.

---

##  Instalación y Ejecución Local

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/Sack450/HackNASA.git
   cd HackNASA
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. Abrir en el navegador en la URL local indicada (usualmente `http://localhost:5173`).
