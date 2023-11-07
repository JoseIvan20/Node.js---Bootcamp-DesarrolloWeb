import { validationResult } from "express-validator";
// Importamos los Modelos
import { Precio, Categoria, Propiedad } from "../models/asociaciones.js";
// Función 'unlink' => Eliminar un archivo del sistema
import { unlink } from "node:fs/promises"

const admin = async (req, res) => {

    // Leer Query String 
    // La renombramos como paginaActual parta evitar que afecte a las variables o parámetros de 'pagina'
    const { pagina: paginaActual } = req.query; 
    const expresion = /^[1-9]$/ // -> Expresiones regulares
                                // -> ^: Le índica que debe iniciar si o si con...  
                                // -> $: Le decimos que debe finalizar con...
    // Validación
    if ( !expresion.test(paginaActual) ) { // test() nos va retornar true o false
        return res.redirect('/mis-propiedades?pagina=1')
    }

    try {

        const { id } = req.usuario

        // Límites y Offset para el paginador
        const limit = 5 // Páginaremos de 10 en 10 / Yo lo haré con 5
        const offset = ((paginaActual * limit) - limit )

        const [ propiedades, total ] = await Promise.all( [

            await Propiedad.findAll( { 

                limit,
    
                offset, // Lo que hará es traerse los primeros 10 registros
    
                where: {
                    usuarioId : id
                },
                include: [ // Para cruzar información y jalar información
                
                                        // as => Alías
                    { model: Categoria, as: 'categoria' }, // Le decimos, incluye en este query el modelo de categorias
    
                    { model: Precio, as: 'precio' }
    
                ]
    
            } ),
            // Con esto tomamos la cantidad total de las propiedades
            Propiedad.count( {

                where: {

                    usuarioId: id

                }

            } )

        ] )

    res.render('propiedades/admin', {

        pagina: 'Mis propiedades',
        propiedades,
        csrfToken: req.csrfToken(),
        // Añadimos el paginador:
        paginas: Math.ceil( total / limit ),
        // Que nos retorne el número de la página en la que nos encontramos 
        paginaActual: Number(paginaActual),
        // Que registro de cuàl a cuàl estamos mostrando
        total,
        offset,
        limit

    })
        
    } catch (error) {
        console.log(error);
    }

    
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

    if (!propiedad ) {
        return res.redirect('/mis-propiedades')
    }
    
    // Validar que la propiedad no este publicada 
    if ( propiedad.publicado ) {
        return res.redirect('/mis-propiedades')
    }
    
    // Validar que la propiedad pertence a quien visita está página
    if( req.usuario.id.toString() !== propiedad.usuarioId.toString() ){

        return res.redirect('/mis-propiedades')

    }


    res.render('propiedades/agregar-imagen', {
        // Creamos la vista
        pagina: `Agregar Imagen: ${propiedad.titulo}`, // L e proporcionamos el titulo que le hemos dado a la propiedad
        csrfToken: req.csrfToken(), // Validamos los token de las imagenes de propiedades
        propiedad
    })

}

// Creamos una función para almacenar la imagen
const almacenarImagen = async(req, res, next) => {

    const { id } = req.params; 

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad ) {
        return res.redirect('/mis-propiedades')
    }
    
    // Validar que la propiedad no este publicada 
    if ( propiedad.publicado ) {
        return res.redirect('/mis-propiedades')
    }
    
    // Validar que la propiedad pertence a quien visita está página
    if( req.usuario.id.toString() !== propiedad.usuarioId.toString() ){

        return res.redirect('/mis-propiedades')

    }
    
    // Usamos un trycatch en caso de error
    try {
        
        console.log(req.file) // req.file lo registra multer

        // Almacenar la imagen y publicar la propiedad
        propiedad.imagen = req.file.filename

        // Cambiamos de 0 a 1 al ser guardada la imagen
        propiedad.publicado = 1;

        // Almacenamos en la BD
        await propiedad.save()

        next()

    } catch (error) {

        console.log(error)

    }

}

// Editar
const editar = async (req, res) => {

    const { id } = req.params

    // Validamos que la propiedad exista
    const propiedad = await Propiedad.findByPk( id )

    if ( !propiedad ) {
        
        return res.redirect('/mis-propiedades')

    }

    // Revisar que quien visito la URL, es quien creo la propiedad
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString() ) {
        
        return res.redirect('/mis-propiedades')

    }

    const [ categorias, precios ] = await Promise.all( [

        Categoria.findAll(),
        Precio.findAll()

    ] )

    res.render('propiedades/editar', {

        pagina: `Editar Propiedad: ${propiedad.titulo}`, // Le pasamos el título de la propiedad a editar
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad // Le pasamos el parámetro de 'propiedad' para que pueda jalar la información de BD

    })

}

const guardarCambios = async (req, res) => {

    // Verificar la validación 
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {

        // Consultar Modelo de Precio y Categoria
        const [ categorias, precios ] = await Promise.all([

            Categoria.findAll(),
            Precio.findAll()

        ])

        res.render('propiedades/editar', {

            pagina: 'Editar Propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
    
        })

    }

    const { id } = req.params

    // Validamos que la propiedad exista
    const propiedad = await Propiedad.findByPk( id )

    if ( !propiedad ) {
        
        return res.redirect('/mis-propiedades')

    }

    // Revisar que quien visito la URL, es quien creo la propiedad
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString() ) {
        
        return res.redirect('/mis-propiedades')

    }

    // Como reescribir el objeto
    try {

        const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body

        // Lo reescribimos con un método de sequelize
        propiedad.set( { 

            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId

        } )

        // Almacenamos en la base de datos
        await propiedad.save()

        // Redireccionamos
        res.redirect('/mis-propiedades')
        
    } catch (error) {

        console.log(error)

    }
    
}

 // Eliminar propiedad
 const eliminar = async (req, res) => {

    const { id } = req.params; 

    // Validamos que la propiedad exista
    const propiedad = await Propiedad.findByPk( id )

    if ( !propiedad ) {
        
        return res.redirect('/mis-propiedades')

    }

    // Revisar que quien visito la URL, es quien creo la propiedad
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString() ) {
        
        return res.redirect('/mis-propiedades')

    }
    
    // Eliminar la imagen
    await unlink(`public/uploads/${propiedad.imagen}`) // unlink() => Le pasamos la ruta de las imagenes a eliminar
    console.log(`Eliminando la imagen: ${propiedad.imagen}`);

    await propiedad.destroy()
    // Redireccionamos
    res.redirect('/mis-propiedades')

}

// Muestra la propiedad
const mostrarPropiedad = async (req, res) => {

    const { id } = req.params;

    // Comprobar que la propiedad exista
    const propiedad = await Propiedad.findByPk( id, { // Incluiremos Categoria, Precio, para mostrar sus datos de la propiedad

        include: [

            { model: Categoria, as: 'categoria' },

            { model: Precio, as: 'precio' }

        ]

    } )

    // SIno existe...
    if ( !propiedad ) {
        return res.redirect('/404')
    }

    res.render('propiedades/mostrar', {

        propiedad,
        pagina: propiedad.titulo, // Muestra en la página superior el nombre de la propiedad
        csrfToken: req.csrfToken()
    })
    
}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    mostrarPropiedad
}