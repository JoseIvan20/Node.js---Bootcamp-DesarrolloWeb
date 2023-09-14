// Importamos los Modelos
import Precio from "../models/ModelPrecio.js"
import Categoria from "../models/ModelCategoria.js"

const admin = (req, res) => {
    res.render('propiedades/admin', {
        pagina: 'Mis propiedades',
        barra: true
    })
}

// formulario para crear una propiedad
const crear = async (req, res) => {

    // Consultar Modelo de Precio y Categoria
    const [ categorias, precios ] = await Promise.all([

        Categoria.findAll(),
        Precio.findAll()

    ])

    res.render('propiedades/crear', {
        pagina: 'Crear Propiedad',
        barra: true,
        // Pasamos los valores de los modelos en objetos
        categorias,
        precios
    })
}

export {
    admin,
    crear
}