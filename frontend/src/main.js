import './style.css'
import { createMarker } from './components/markers.js'
import { setupChoropleth } from './components/choropleth.js'
import L, { map } from 'leaflet';
import 'leaflet.markercluster';
import { getSolicitacoes } from './hooks/getSolicitacoes.js'
import { MAP_CONTAINER } from './components/Elements.js'
import axios from 'axios';
import Cookies from 'js-cookie';




export async function Main() {
  const mapMenager = new MapGenerator();
  // let token = Cookies.get('token');
  // console.log('token', token);
  // // let fluxDetails = await axios.get('https://forms-homo.salvador.ba.gov.br/api/flow/fluxo-apagar/'+slug, { headers: { Authorization: `Bearer ${token}` } });
  mapMenager.solicitacoes = await getSolicitacoes();


  if (mapMenager.solicitacoes.length < 1) {
    document.querySelector('#spinner').querySelector('p').innerHTML = 'Nenhuma solicitação encontrada'
    return
  }

  let attribution = 'Monitoramento <img src="https://forms-homo.salvador.ba.gov.br/uploads/documentos/6cae515fa9a8415f9adb956541ced641.png" width="15px" height="12px"> <a href="https://atendimento156-homo.salvador.ba.gov.br" target="_blank">Botão Lilás</a>'

  let osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 10,
    attribution: attribution
  })

  osm.addTo(mapMenager.map);

  // let osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  //   maxZoom: 19,
  //   minZoom: 10,
  //   attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
  // });

  let Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: attribution
  });

  let Stadia_StamenToner = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 0,
    maxZoom: 20,
    attribution: attribution,
    ext: 'png'
  });

  let baseMaps = {
    'OpenStreetMap': osm,
    // 'OpenStreetMap HOT': osmHOT,
    'Esri WorldImagery': Esri_WorldImagery,
    'Stadia StamenToner': Stadia_StamenToner
  };

  ;
  let cluster = L.markerClusterGroup({
    maxClusterRadius: 10
  })
  mapMenager.addMarkers(cluster);

  setupChoropleth({ layer: cluster, data: mapMenager.bairrosCounts });

  cluster.addTo(mapMenager.map);

  let overlays = {
    'Solicitações': cluster
  };


  let layerControl = L.control.layers(baseMaps, overlays);
  layerControl.addTo(mapMenager.map);


  // let polygon = L.polygon(
  //   [

  //     [
  //       -12.9051149976,
  //       -38.327146995965
  //     ],
  //     [
  //       -12.909153504234,
  //       -38.335599926568
  //     ],
  //     [
  //       -12.82879,
  //       -38.46652
  //     ]
  //   ]
  // ).addTo(mapMenager.map);

  addLegend(mapMenager.map, mapMenager.bairrosCounts);


  document.querySelector('#spinner').remove()

}

function addLegend(map, data) {
  let legend = L.control({ position: 'bottomleft' });
  let content = '';
  let higher = 0
  for (let key in data) {
    if (data[key] > higher) {
      higher = data[key]
    }
  }
  legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend');
    let grades = [Math.round(higher * 0.875), Math.round(higher * 0.75), Math.round(higher * 0.625), Math.round(higher * 0.5), Math.round(higher * 0.375), Math.round(higher * 0.25), Math.round(higher * 0.125)];
    let labels = [];
    for (let i = 0; i < grades.length; i++) {
      if (i == 0) {
        labels.push(`<i class="square" style="background:${getColor(grades[i], data)}"></i> <strong class="text-md">${grades[i]}+</strong>`)
      } else if (i == (grades.length - 1)) {
        labels.push(`<i class="square" style="background:${getColor(grades[i], data)}"></i> <strong class="text-md">${grades[i]} - 0</strong>`)
      } else {
        labels.push(`<i class="square" style="background:${getColor(grades[i], data)}"></i> <strong class="text-md">${grades[i - 1]} - ${grades[i]}</strong>`);
      }
    }
    let div_labels = document.createElement('div');
    div_labels.innerHTML = labels.join('<br>');
    let div_info = document.createElement('div');
    div_info.classList.add('flex', 'gap-2', 'flex-col');
    div_info.innerHTML = `
    <div>
      <i class="text-[16px] fa-solid fa-venus text-[#ff1493]" aria-hidden="true"></i>
      <label class="text-[16px]">Solicitação sem MP</label>
    </div>
    <div>
      <i class="text-[16px] fa-solid fa-venus gradient-text" aria-hidden="true"></i>
      <label class="text-[16px]">Solicitação com MP</label>
    </div>   
    <div>
      <i class="text-[16px] fa-solid fa-car text-[#ff1493]" aria-hidden="true"></i>
      <label class="text-[16px]">Solicitação com Viatura</label>
    </div>
        <div>
      <i class="text-[16px] fa-solid fa-car gradient-text" aria-hidden="true"></i>
      <label class="text-[16px]">Solicitação com Viatura + MP</label>
    </div>
    
    `
    div.appendChild(div_info)
    div.appendChild(div_labels)
    div.classList.add('bg-white', 'p-2', 'rounded', 'border', 'flex', 'flex-col', 'gap-2');
    content = div.innerHTML
    div.innerHTML = '<i class="fa-solid fa-circle-info text-2xl"></i>'
    return div;
  }

  legend.addTo(map);

  let legendHTML = document.querySelector('.legend');
  legendHTML.addEventListener('mouseleave', () => {
    legendHTML.innerHTML = '<i class="fa-solid fa-circle-info text-2xl"></i>';
  })

  legendHTML.addEventListener('mouseenter', () => {
    legendHTML.innerHTML = content
  })
}

class MapGenerator {
  constructor() {
    this.map = this.setupMap();
    this.solicitacoes = null;
    this.bairrosCounts = {};
    this.markers = [];
    this.interactions();
  }


  addMarkers(layer) {
    let dataAux = new Date('2025-07-23T09:50:25.996338-03:00')
    this.solicitacoes.forEach(solicitacao => {
      if (new Date(solicitacao.created_at) < dataAux) return
      solicitacao.respostas.forEach(resposta => {
        // console.log(resposta)
        let bairro = ''
        let lat = ''
        let lon = ''
        Object.values(resposta).forEach(campo => {
          // console.log(campo.titulo.toLowerCase())
          if ('titulo' in campo && campo.titulo.toLowerCase().includes('cep')) {
            if ('latitude' in campo && 'longitude' in campo) {
              lat = campo.latitude
              lon = campo.longitude
            }
          } else if ('titulo' in campo && campo.titulo.toLowerCase().includes('bairro')) {
            bairro = campo.resposta
          }
        })

        if (bairro) {
          bairro = bairro.toUpperCase()
          if (bairro in this.bairrosCounts) {
            this.bairrosCounts[bairro]++;
          } else {
            this.bairrosCounts[bairro] = 1;
          }
        }

        if (lat && lon) {
          let marker = createMarker({
            lat: lat,
            lng: lon,
            data: solicitacao
          });
          this.markers.push(marker);
          marker.addTo(layer);
        }



        // if ("2981" in resposta && resposta['2981'].latitude && resposta['2981'].longitude) {
        //   let marker = createMarker({
        //     lat: resposta['2981'].latitude,
        //     lng: resposta['2981'].longitude,
        //     data: solicitacao,
        //   });
        //   this.markers.push(marker);
        //   marker.addTo(layer);

        //   // let bairro = String(resposta['2982'].resposta).toUpperCase();
        //   // if (bairro in this.bairrosCounts) {
        //   //   this.bairrosCounts[bairro]++;
        //   // } else {
        //   //   this.bairrosCounts[bairro] = 1;
        //   // }
        // }
        // else if ("2981" in resposta) {
        //   let bairro = String(resposta['2982'].resposta).toUpperCase();
        //   if (bairro in this.bairrosCounts) {
        //     this.bairrosCounts[bairro]++;
        //   } else {
        //     this.bairrosCounts[bairro] = 1;
        //   }
        // }
        //console.log(solicitacao);
      });
    });

  }


  setupMap() {
    // let map = L.map('map').setView([-12.974722, -38.476665], 11);

    const bounds = [
      [-12.673529, -38.142014],
      [-13.121558, -38.750152]
    ];

    let map = L.map('map', {
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
      minZoom: 11, // Rigidez da limitação (0.0 a 1.0)
      zoomControl: false
    }).setView([-12.974722, -38.476665], 12);

    setTimeout(() => { map.invalidateSize(); }, 100);
    return map
  }

  addLayers() {

  }

  interactions() {
    this.map.on('click', (e) => {
      document.querySelector('.rightPanel').classList.add('hidden');

      const evento = new CustomEvent('mapaClicado');
      window.dispatchEvent(evento);

    })
  }
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

Main();
