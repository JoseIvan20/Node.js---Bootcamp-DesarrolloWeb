// JWT JSON Web Tokens
import jwt from "jsonwebtoken";

// Generaremos un Jason Web Token
const generarJWT = (datos) => jwt.sign({ id : datos.id, nombre: datos.nombre }, process.env.JWT_SECRET, { expiresIn: '1d' });

// Generamos Id
const generarId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

export {
    generarId,
    generarJWT,
}