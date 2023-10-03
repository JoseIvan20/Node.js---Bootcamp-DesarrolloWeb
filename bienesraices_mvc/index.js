// Almacenamos en una variable la función.
import express from "express"; // ES Modules
// csurf
import csrf from "csurf";
// Cookie Parser
import cookieParser from "cookie-parser";
// Archivo de js, por tanto requiere la extensión.
import usuarioRouter from "./routes/usuarioRoutes.js";
// Mis propiedades
import propiedadesRoutes from "./routes/propiedadesRoutes.js";
// Importamos las otras vistas
import appRoutes from "./routes/appRoutes.js";
// Base de Datos
import db from "./config/db.js";

// Ejecutamos la función
const server = express();

// Habilitar lectura de datos de formulario
server.use( express.urlencoded( {extended: true} ) );

// Habilitar Cookie Parser
server.use( cookieParser() )
// Habilitar el CSRF
server.use( csrf( {cookie: true} ) )

// Conexión a la Base de Datos
try {
    await db.authenticate();
    db.sync(); // Genera o crea la tabla.
    console.log( 'Conexión correcta la BD.' );
} catch ( error ) {
    console.log( error )
}

// Habilitar Pug
server.set( 'view engine', 'pug' );
server.set( 'views', './views' );

// Carpeta publica -> static() en la carpeta public
server.use( express.static('public') )

// Routing -> Mandamos a llamar la ruta
server.use('/', appRoutes)
server.use( '/auth', usuarioRouter )
server.use( '/', propiedadesRoutes )

// Creamos el server o la app -> Levantamos el servidor
const port = process.env.PORT || 3000;

// Le decimos a la función que escuche al puerto
server.listen ( port, () => {
    console.log( `El Servidor está funcionando el puerto ${port}` );
})