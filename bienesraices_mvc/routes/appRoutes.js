import express from "express"
import { inicio, categorias, noEncontrado, buscador } from "../controller/appController.js"

const router = express.Router()

// Página Inicio
router.get('/', inicio)


// Categorias
router.get('/categorias/:id', categorias)


// Página 404 
router.get('/404',noEncontrado)


// Buscador 
router.post('/buscador/:id', buscador)


export default router