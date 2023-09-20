import { validationResult } from "express-validator";
// Importamos los Modelos
import { Precio, Categoria, Propiedad } from "../models/asociaciones.js";

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
        csrfToken: req.csrfToken(),
        // Pasamos los valores de los modelos en objetos
        categorias,
        precios,
        datos: {}
    })
}

// Función de agregar
const guardar = async (req, res) => {

    // Validaciones
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {

        // Consultar Modelo de Precio y Categoria
        const [ categorias, precios ] = await Promise.all([

            Categoria.findAll(),
            Precio.findAll()

        ])

        return res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            barra: true,
            csrfToken: req.csrfToken(),
            // Pasamos los valores de los modelos en objetos
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })

    }

    // Bloque de Crear Registro
    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body;

    const { id: usuarioId } = req.usuario;

    try {
        
        const propiedadGuardada = await Propiedad.create({

            // Le pasamos los valores a guardar
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId,
            usuarioId,
            imagen: ''

        })

        // Usaremos la información de propiedadGuardada para extraer la información
        const { id } = propiedadGuardada;

        res.redirect(`/propiedades/agregar-imagen/${id}`)

    } catch (error) {
        console.log(error);
    }

}

export {
    admin,
    crear,
    guardar
}