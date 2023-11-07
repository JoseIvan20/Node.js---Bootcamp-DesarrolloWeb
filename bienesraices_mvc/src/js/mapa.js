// Función que se invoca así misma
(function() {

    // Leeremos los datos que extraigamos del PIN u posición en el mapa
    const lat = document.querySelector('#lat').value || 19.5575357; // Latitud
    const lng = document.querySelector('#lng').value || -99.1246216; // Longitud
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    
    // Crear variable para añadir un PIN con laubicación de la Propiedad
    let marker;

    // Utilizar Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // El PIN
    marker = new L.marker([lat, lng], {
        draggable: true, // True para poder moverlo
        autoPan:true, //True para hacer zoom automático cuando el usuario arrastre el pin a otra parte del mapa
        title:"Mi primer pin",
        alt:"Pin",
        // icon : "/public/svg/pin.svg",
    })
    .addTo(mapa) 

    // Detectar el movimiento del pin
    marker.on('moveend', function (e) {
        marker = e.target
        
        // Declaramos una variable para almacenar la Lat y Lng
        const posicion = marker.getLatLng();

        mapa.panTo( new L.LatLng(posicion.lat, posicion.lng) ) // panTo lo que harà es centrar al momento de soltar el pin, y lo centraremos a las coordenadas respectivas

        // Obtener la información de las calles al soltar el PIN
        geocodeService.reverse().latlng(posicion, 13).run(function (error, resultado) {
            // console.log(resultado)

            marker.bindPopup(resultado.address.LongLabel);

            // Llamar a los campos para extraer la calle, lat y lng
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? ''; // textContent = Es algo que será visible 
            document.querySelector('#calle').value = resultado?.address?.Address ?? ''; // Calle
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? ''; // Latitud
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? ''; // Longitud

        }) 

    })

})()