import axios from 'axios';

export async function setupChoropleth({ layer, data }) {
    const response = await axios.get(import.meta.env.VITE_GET_MAP);
    const geojsonData = response.data;

    geojsonData.features.forEach(feature => {
        const bairro = String(feature.properties.nome_bairr).toUpperCase();
        feature.properties.count = data[bairro] || 0;
        // console.log(bairro, ':', feature.properties.count);
    });

    const geojsonLayer = L.geoJson(geojsonData, {
        style: function (feature) {
            return {
                fillColor: getColor(feature.properties.count, data),
                weight: 1,
                opacity: 1,
                color: 'gray',
                
                fillOpacity: 0.8
            };
        },
        onEachFeature(feature, layer) {
            // Criar tooltip
            const tooltipContent = `
        <div class="custom-tooltip">
            Bairro: <strong>${feature.properties.nome_bairr}</strong><br>
            Quantidade de Solicitações: <strong>${feature.properties.count}</strong>
        </div>
    `;

            layer.bindTooltip(tooltipContent, {
                permanent: false,
                direction: 'top',
                className: 'custom-tooltip-class'
            });

            // layer.style({
            //     // fillOpacity: 1,
            //     // color: 'gray',
            //     // weight: 1
            // });

            layer.on({
                mouseover: function (e) {
                    layer.openTooltip();
                    highlightFeature(e);
                },
                mouseout: function (e) {
                    layer.closeTooltip();
                    resetHighlight(e);
                }
            });
        }
    }).addTo(layer);

    function resetHighlight(e) {

        geojsonLayer.resetStyle(e.target);
    }

    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 2,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.6,
            fillColor: '#f7143c'
        });

        layer.bringToFront();
    }


    // map.fitBounds(geojsonLayer.getBounds());
}

function getColor(d, data) {
  let higher = 0
  for (let key in data) {
    if (data[key] > higher) {
      higher = data[key]
    }
  }
  return d >= (Math.round(higher * 0.875)) ? '#421d4d' :
    d >= (Math.round(higher * 0.75)) ? '#6c397b' :
      d >= (Math.round(higher * 0.625)) ? '#8c4684' :
        d >= (Math.round(higher * 0.5)) ? '#a26493' :
          d >= (Math.round(higher * 0.375)) ? '#b687ab' :
            d >= (Math.round(higher * 0.25)) ? '#c29bb8' :
              d >= (Math.round(higher * 0.125)) ? '#cba7c1' :
                '#d6bad0';
}