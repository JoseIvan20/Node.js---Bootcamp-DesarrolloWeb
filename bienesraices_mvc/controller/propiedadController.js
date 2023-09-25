import { validationResult } from "express-validator";
// Importamos los Modelos
import { Precio, Categoria, Propiedad } from "../models/asociaciones.js";

const admin = (req, res) => {
    res.render('propiedades/admin', {
        pagina: 'Mis propiedades'
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

// Función de agregar imagen
const agregarImagen = async (req, res) => {

    const { id } = req.params; 

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }
    
    // Validar que la propiedad no este publicada 
    if (propiedad.publicado) {
        return res.rendirect('/mis-propiedades')
    }
    
    // Validar que la propiedad pertence a quien visita está página
    if( req.usuario.id.toString() !== propiedad.usuarioId.toString() ){

        return res.redirect('/mis-propiedades')

    }else {

    }


    res.render('propiedades/agregar-imagen', {
        // Creamos la vista
        pagina: `Agregar Imagen: ${propiedad.titulo}`, // L e proporcionamos el titulo que le hemos dado a la propiedad
        propiedad
    })

}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
}