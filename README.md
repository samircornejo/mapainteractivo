
🗺️ Mapa Interactivo de Incidencias en Colegios del Perú
Este proyecto es un sistema de filtrado geográfico que permite visualizar y explorar incidencias de violencia en colegios del Perú,
utilizando datos espaciales y una interfaz interactiva basada en Leaflet.

📌 Descripción
El sistema permite al usuario navegar por el mapa del Perú, seleccionando departamentos, provincias y distritos. Al seleccionar un distrito,
se generan colegios simulados como marcadores en el mapa. Al hacer clic en un colegio, se muestra una tabla detallada con las incidencias registradas, incluyendo:
- Número de incidencia
- Motivo (ej. bullying, acoso, violencia física)
- Agresor
- Víctima
Este enfoque permite filtrar y visualizar casos de violencia escolar de forma intuitiva y territorial.

🧰 Tecnologías utilizadas
- Leaflet.js — para renderizar el mapa interactivo.
- GeoJSON — para representar los límites geográficos de departamentos, provincias y distritos.
- HTML, CSS y JavaScript — para la estructura, estilo y lógica del sistema.

📂 Estructura del proyecto
📁 proyecto/
├── index.html         # Interfaz principal
├── style.css          # Estilos del mapa y panel lateral
├── script.js          # Lógica de filtrado y generación de incidencias
├── departments.geojson
├── provinces.geojson
└── districts.geojson



🚀 Cómo funciona
- El mapa carga los departamentos desde departments.geojson.
- Al hacer clic en un departamento, se filtran y muestran sus provincias.
- Al hacer clic en una provincia, se filtran y muestran sus distritos.
- Al hacer clic en un distrito:
- Se generan 5 colegios simulados como marcadores.
- Al hacer clic en un colegio, se muestra su nombre como subtítulo y una tabla con sus incidencias.

📊 Casos de uso
Este sistema puede adaptarse para:
- Visualizar reportes reales de violencia escolar desde bases de datos oficiales (ej. SISEVE).
- Filtrar por tipo de incidencia, nivel educativo o ubicación.
- Integrarse con sistemas de monitoreo educativo o dashboards regionales.

📦 Requisitos
- Navegador moderno compatible con JavaScript.
- Servidor local para cargar archivos GeoJSON (ej. Live Server, Python HTTP server).

🧪 Simulación
Actualmente, los colegios y sus incidencias se generan de forma aleatoria para fines de demostración. 
Puedes conectar el sistema a una base de datos real para mostrar información oficial.

