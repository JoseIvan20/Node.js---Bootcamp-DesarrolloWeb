(function () { 

    // Leeremos los datos que extraigamos del PIN u posición en el mapa
    const lat = 19.5575357; // Latitud
    const lng = -99.1246216; // Longitud
    const mapaInicio = L.map('mapa-inicio').setView([lat, lng ], 16);
    
    // Markers
    let markers = new L.FeatureGroup().addTo(mapaInicio)

    let propiedades = []

    // Filtro de busqueda
    const filtros = {
        
        categoria: '',
        precio: ''
        
    }

    const categoriasSelect = document.querySelector('#categorias')
    const preciosSelect = document.querySelector('#precios') 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapaInicio);

    // Filtrado de categoria y precio
    categoriasSelect.addEventListener('change', e => {
        
        filtros.categoria = +e.target.value
        // console.log(+e.target.value)
        filtrarPropiedades()
        
    })

    preciosSelect.addEventListener('change', e => {

        filtros.precio = +e.target.value
        // console.log(+e.target.value)
        filtrarPropiedades()

    })

    // Consumo del mapa
    const obtenerPorpiedades = async (req, res) => {

        try {
            
            const url = '/api/propiedades'
            const respuesta = await fetch(url)
            
            // Obtener cierta informacion a través del JSON
            propiedades = await respuesta.json()

            // Mostrar propiedades
            mostrarPropiedades(propiedades)

            console.log(propiedades)

        } catch (error) {

            console.log(error)

        }

    }

    // Mostrar las propiedades dentro del mapa
    const mostrarPropiedades = propiedades => {


        // Limpiar los markr previos
        markers.clearLayers()

        propiedades.forEach( propiedad => {

            // Agregar los pines
            const marker = new L.marker([
                propiedad?.lat,
                propiedad?.lng
            ],{
                autoPan: true, // Cuando de clic en el Marker, se centrará la vista
            })
            .addTo(mapaInicio) // Añadimos en el mapa
            .bindPopup(`

                <p class="text-teal-600 font-bold">
                    
                    ${propiedad.categoria.nombre}
                
                </p>
            
                <h1 class="text-sm font-bold text-slate-500 my-2"> 
                
                    ${ propiedad?.titulo }

                </h1>

                <img src="/uploads/${propiedad?.imagen}" alt="Imagen de la propiedad ${propiedad?.titulo}"></img>

                <p class="text-gray-600 font-bold">
                
                    ${propiedad.precio.nombre}
                
                </p>

                <a href="/propiedad/${propiedad.id}" class="bg-indigo-100 text-indigo-800 p-2 text-center rounded font-bold uppercase"> Ver propiedad </a>

            `) // Mensaje al cliqueal el pin

            markers.addTo(marker)

        })

    }

    // Filtrar 
    const filtrarPropiedades = () => {

        // console.log('Filtrando...')
        // Filtrar en base a las selecciones del usuario
        const resultado = propiedades.filter(filtrarCategoria).filter( filtrarPrecio ) // filter() -> Es un Array Method, iterará en est ecaso sobre las propiedades
        mostrarPropiedades(resultado)

    }

    const filtrarCategoria = propiedad => filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad

    const filtrarPrecio = propiedad => filtros.precio ? propiedad.precioId === filtros.precio : propiedad

    obtenerPorpiedades()

})()