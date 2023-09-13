import express from "express"
import { admin, crear } from "../controller/propiedadController.js";

const router = express.Router();


router.get('/mis-propiedades', admin);
// Crear propiedad
router.get('/propiedades/crear', crear)

export default router;