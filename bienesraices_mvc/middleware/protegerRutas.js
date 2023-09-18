// Importamos JWT para la verificación y comprobación del usuario
import jwt, { decode } from "jsonwebtoken";
// Importamos el Modelo de Usuarios para buscar el usuario
import { Usuario } from "../models/asociaciones.js";

const protegerRuta = async (req, res, next) => {
    
    // Verificar si hay un token
    const { _token } = req.cookies;
    if (!_token) {
        return res.redirect('/auth/login');
    }

    // Comrprobar el Token
    try {
        
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        const usuario  = await Usuario.findByPk(decoded.id)
        console.log(usuario);

    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login'); // Con esto evitamos que el usuarios agregue un token anonimo y pueda acceder a mis propiedades.
    }

    
    next(); // next() -> Pasa al siguiente nivel
    
}

export default protegerRuta;