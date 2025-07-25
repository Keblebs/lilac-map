import L from 'leaflet';
import { getSolicitacoes } from '../hooks/getSolicitacoes';

export function addMarkers(markers, map, slug, key) {
    let soli = getSolicitacoes(slug, key)
    console.log(soli);
    soli.forEach(s => {
        console.log(s);
    });
    // markers.forEach(marker => {
    //     let mark = L.marker([marker.lat, marker.lng])
    //     mark.addTo(map)
    //         .bindPopup(marker.popup || 'No popup content');
    // });
}


export function createMarker({ lat, lng, data }) {
    if (typeof L === 'undefined') {
        throw new Error('Leaflet library not found');
    }

    const icon = L.divIcon({
        className: 'custom-div-icon',
        html: '<i class="fa-solid fa-venus text-[16px] text-[#f7143c]"></i>',
        iconSize: [24, 24]
    });

    const marker = L.marker([lat, lng], { icon });

    marker.on('click', (event) => {
        const rightPanel = document.querySelector('.rightPanel');

        if (!rightPanel) {
            console.warn('Right panel element not found');
            return;
        }

        // // Sanitizar o conteúdo se necessário
        // let rightPanelContent = ''
        // if (data && data.respostas) {
        //     rightPanelContent += `<div><strong class="text-[#ca1c3c]" >Protocolo:</strong> ${data.protocolo}</div>`
        //     rightPanelContent += `<div><strong class="text-[#ca1c3c]" >Status:</strong> ${data.status}</div>`
        //     rightPanelContent += `<div><strong class="text-[#ca1c3c]" >Hora da Solicitação:</strong> ${new Date(data.created_at).toLocaleString()}</div>`
        //     data.respostas.forEach(r => {
        //         for (let key in r) {
        //             let item = r[key]
        //             rightPanelContent += `<div><strong class="text-[#ca1c3c]" >${item.titulo}:</strong> ${item.resposta}</div>`
        //         }
        //     })
        // }

        const evento = new CustomEvent('marcadorClicado', { detail: { data: data } });
        window.dispatchEvent(evento);

        // rightPanel.querySelector('.fields').innerHTML = rightPanelContent
        // rightPanel.classList.remove('hidden');
        // rightPanel.classList.add('flex');

        document.querySelectorAll('.marker-selected').forEach(el => {
            el.classList.remove('marker-selected');
        });

        // Adicionar classe ao marcador clicado
        if (event.target._icon) {
            event.target._icon.classList.add('marker-selected');
        }
    });

    return marker;
}