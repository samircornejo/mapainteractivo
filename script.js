const map = L.map('map').setView([-9.19, -75.015], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let provinceLayer = null;
let districtLayer = null;
let schoolLayer = null;
let selectedProvince = null;
let selectedDistrict = null;

function getIncidencias(nombre) {
  const total = Math.floor(Math.random() * 20);
  const razones = ['Bullying', 'Acoso', 'Violencia física', 'Discriminación'];
  const seleccionadas = razones.sort(() => 0.5 - Math.random()).slice(0, Math.min(5, total));
  return { total, razones: seleccionadas };
}

document.getElementById('reset-btn').addEventListener('click', () => {
  map.flyTo([-9.19, -75.015], 6);
  if (provinceLayer) map.removeLayer(provinceLayer);
  if (districtLayer) map.removeLayer(districtLayer);
  if (schoolLayer) map.removeLayer(schoolLayer);
  selectedProvince = null;
  selectedDistrict = null;
  document.querySelector('#school-name').textContent = '';
  document.querySelector('#school-table tbody').innerHTML = '';
});

fetch('departments.geojson')
  .then(res => res.json())
  .then(departments => {
    L.geoJSON(departments, {
      onEachFeature: (feature, layer) => {
        const depName = feature.properties.name;
        const depCode = feature.properties.code;
        const { total } = getIncidencias(depName);

        layer.bindTooltip(`${depName} — ${total} incidencias`, { sticky: true });
        layer.setStyle({ color: '#000', weight: 1, fillOpacity: 0 });

        layer.on('mouseover', () => layer.setStyle({ fillOpacity: 0.2 }));
        layer.on('mouseout', () => layer.setStyle({ fillOpacity: 0 }));

        layer.on('click', () => {
          map.flyToBounds(layer.getBounds(), { animate: true, duration: 0.5 });

          if (provinceLayer) map.removeLayer(provinceLayer);
          if (districtLayer) map.removeLayer(districtLayer);
          if (schoolLayer) map.removeLayer(schoolLayer);
          selectedProvince = null;
          selectedDistrict = null;
          document.querySelector('#school-name').textContent = '';
          document.querySelector('#school-table tbody').innerHTML = '';

          fetch('provinces.geojson')
            .then(res => res.json())
            .then(provinces => {
              const filtered = provinces.features.filter(
                f => f.properties.department_code === depCode
              );

              provinceLayer = L.geoJSON({ type: 'FeatureCollection', features: filtered }, {
                onEachFeature: (provFeature, provLayer) => {
                  const provName = provFeature.properties.name;
                  const provCode = provFeature.properties.code;
                  const { total } = getIncidencias(provName);

                  provLayer.bindTooltip(`${provName} — ${total} incidencias`, { sticky: true });
                  provLayer.setStyle({ color: '#000', weight: 1, fillOpacity: 0 });

                  provLayer.on('mouseover', () => provLayer.setStyle({ fillOpacity: 0.2 }));
                  provLayer.on('mouseout', () => {
                    if (selectedProvince !== provLayer) {
                      provLayer.setStyle({ fillOpacity: 0 });
                    }
                  });

                  provLayer.on('click', () => {
                    map.flyToBounds(provLayer.getBounds(), { animate: true, duration: 0.5 });

                    if (districtLayer) map.removeLayer(districtLayer);
                    if (schoolLayer) map.removeLayer(schoolLayer);
                    selectedDistrict = null;
                    document.querySelector('#school-name').textContent = '';
                    document.querySelector('#school-table tbody').innerHTML = '';

                    if (selectedProvince) selectedProvince.setStyle({ fillOpacity: 0 });
                    selectedProvince = provLayer;
                    selectedProvince.setStyle({ fillOpacity: 0.3, fillColor: '#FFD54F' });

                    fetch('districts.geojson')
                      .then(res => res.json())
                      .then(districts => {
                        const filteredDist = districts.features.filter(
                          f => f.properties.province_code === provCode
                        );

                        districtLayer = L.geoJSON({ type: 'FeatureCollection', features: filteredDist }, {
                          onEachFeature: (distFeature, distLayer) => {
                            const distName = distFeature.properties.name;
                            const { total } = getIncidencias(distName);

                            distLayer.bindTooltip(`${distName} — ${total} incidencias`, { sticky: true });
                            distLayer.setStyle({ color: '#000', weight: 1, fillOpacity: 0 });

                            distLayer.on('mouseover', () => distLayer.setStyle({ fillOpacity: 0.2 }));
                            distLayer.on('mouseout', () => {
                              if (selectedDistrict !== distLayer) {
                                distLayer.setStyle({ fillOpacity: 0 });
                              }
                            });

                            distLayer.on('click', () => {
                              if (selectedDistrict) {
                                selectedDistrict.setStyle({ fillOpacity: 0 });
                                selectedDistrict.unbindTooltip();
                              }

                              selectedDistrict = distLayer;
                              selectedDistrict.setStyle({ fillOpacity: 0.3, fillColor: '#64B5F6' });
                              selectedDistrict.unbindTooltip();

                              map.flyToBounds(distLayer.getBounds(), { animate: true, duration: 0.5 });

                              if (schoolLayer) map.removeLayer(schoolLayer);
                              schoolLayer = L.layerGroup();

                              const bounds = distLayer.getBounds();
                              const center = bounds.getCenter();
                              const schoolTableBody = document.querySelector('#school-table tbody');
                              const schoolNameHeader = document.getElementById('school-name');
                              schoolTableBody.innerHTML = '';
                              schoolNameHeader.textContent = '';

                              for (let i = 0; i < 5; i++) {
                                const offsetLat = (Math.random() - 0.5) * 0.02;
                                const offsetLng = (Math.random() - 0.5) * 0.02;
                                const lat = center.lat + offsetLat;
                                const lng = center.lng + offsetLng;
                                const nombre = `Colegio de prueba ${i + 1}`;
                                const { total, razones } = getIncidencias(nombre);

                                const marker = L.marker([lat, lng]).bindTooltip(nombre, { sticky: true });
                                marker.on('click', () => {
                                  schoolTableBody.innerHTML = '';
                                  schoolNameHeader.textContent = nombre;

                                  for (let j = 0; j < total; j++) {
                                    const motivo = razones[j % razones.length];
                                    const agresor = `Alumno ${Math.floor(Math.random() * 30 + 1)}`;
                                    const victima = `Alumno ${Math.floor(Math.random() * 30 + 1)}`;

                                    const row = document.createElement('tr');
                                    row.innerHTML = `
                                      <td>${j + 1}</td>
                                      <td>${motivo}</td>
                                      <td>${agresor}</td>
                                      <td>${victima}</td>
                                    `;
                                    schoolTableBody.appendChild(row);
                                  }
                                });

                                schoolLayer.addLayer(marker);
                              }

                              schoolLayer.addTo(map);
                            });
                          }
                        }).addTo(map);
                      });
                  });
                }
              }).addTo(map);
            });
        });
      }
    }).addTo(map);
  });