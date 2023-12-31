import express from "express"
// Importamos express-validator, usamos body, ya que lo hacemos desde el routing
import { body } from "express-validator"
import { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar, mostrarPropiedad } from "../controller/propiedadController.js";
import protegerRuta from "../middleware/protegerRutas.js";
// Importamos upload
import upload from "../middleware/subirImagen.js";
// Import de identificar usuario
import identificarUsuario from "../middleware/identificarUsuario.js";


const router = express.Router();


router.get('/mis-propiedades', protegerRuta, admin);
// Crear propiedad
router.get('/propiedades/crear', protegerRuta, crear)
// POST para extraer los valores
router.post('/propiedades/crear', 
    protegerRuta,
    // Creamos las validaciones
    body('titulo').notEmpty().withMessage('El Titulo del Anuncio es Obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La Descripción no puede ir vacía')
        .isLength( { max: 200 } ).withMessage('La Descripción es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una Categoria'),
    body('precio').isNumeric().withMessage('Selecciona un Precio'),
    body('habitaciones').isNumeric().withMessage('Selecciona la Cantidad de Habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la Cantidad de Estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona la Cantidad de Baños'),
    body('lat').notEmpty().withMessage('Ubica la Propiedad en el Mapa'),
    
    guardar

);

// Agregamos la URL de propiedades/agregar-imagen/
router.get('/propiedades/agregar-imagen/:id', 

    protegerRuta,

    agregarImagen
)

router.post('/propiedades/agregar-imagen/:id',

    protegerRuta, // Solo usuarios autenticados pueden enviar una petición hacía esta URL
    // Use array debido a que son múltiples imagenes, si fuese solo 1, sería single. upload.single()
    upload.single( 'imagen' ), // Dentro del parentésis, viene lo que lo conecta

    almacenarImagen

)

// Botón de Editar 
router.get('/propiedades/editar/:id',

    protegerRuta,

    editar
    
)

// Validaciones al momento de 'Editar' la Propiedad
router.post( '/propiedades/editar/:id', 

    protegerRuta,
    // Creamos las validaciones
    body('titulo').notEmpty().withMessage('El Titulo del Anuncio es Obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La Descripción no puede ir vacía')
        .isLength( { max: 200 } ).withMessage('La Descripción es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una Categoria'),
    body('precio').isNumeric().withMessage('Selecciona un Precio'),
    body('habitaciones').isNumeric().withMessage('Selecciona la Cantidad de Habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la Cantidad de Estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona la Cantidad de Baños'),
    body('lat').notEmpty().withMessage('Ubica la Propiedad en el Mapa'),

    guardarCambios

)

router.post('/propiedades/eliminar/:id', 

    protegerRuta,
    
    eliminar

)

// Área pública
router.get ('/propiedad/:id',

    identificarUsuario,
    mostrarPropiedad

)

export default router;