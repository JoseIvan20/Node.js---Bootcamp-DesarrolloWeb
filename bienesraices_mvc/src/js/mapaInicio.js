(function() {

    const lat = 19.5575357; // Latitud
    const lng = -99.1246216; // Longitud
    const mapa = L.map('mapa').setView([lat, lng ], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

})