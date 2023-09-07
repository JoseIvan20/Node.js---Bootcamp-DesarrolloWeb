import express from "express";
import { formularioLogin, autenticarUsuario, formularioRegistro, registrarUsuario, confirmarEmail, formularioOlvidePassword, resetPassword, comprobarToken, nuevoPassword } from "../controller/usuarioController.js";

const router = express.Router();

// Iniciar Sesión
router.get('/login', formularioLogin);
router.post('/login', autenticarUsuario);

// Registro
router.get('/registro', formularioRegistro);
router.post('/registro', registrarUsuario);

// Ruta de Confirmación de Email
router.get('/confirmar/:token', confirmarEmail);

// Olvide Contraseña
router.get('/olvide-password', formularioOlvidePassword);
router.post('/olvide-password', resetPassword);

// Almacenar nueva Password
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);

// Exportar el router
export default router;