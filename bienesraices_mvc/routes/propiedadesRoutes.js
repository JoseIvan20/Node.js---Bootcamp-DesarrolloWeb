import express from "express"
// Importamos express-validator, usamos body, ya que lo hacemos desde el routing
import { body } from "express-validator"
import { admin, crear, guardar, agregarImagen } from "../controller/propiedadController.js";
import protegerRuta from "../middleware/protegerRutas.js";

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

export default router;