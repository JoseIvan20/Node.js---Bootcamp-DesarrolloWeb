// Sirve para subir/almacenar archivos
import multer from "multer";
// Path -> Interno de JS
import path from "path";
// Token
import { generarId } from "../helpers/tokens.js";


// Usaremos el Servidor
const storage = multer.diskStorage( { 

    // Sino hay ningún error, entonces null
                    // Donde se van a guardar las imagenes
    destination: function (req, file, cb) {

        cb( null, './public/uploads/' )

    },
    filename: function (req, file, cb ) {

        cb( null, generarId() + path.extname(file.originalname) ) // extname => Te va a traer la extensión de un archivo 

    }

 } )

 const upload = multer( {

    storage // Jalamos la const de storage con la finalidad de cargar

 } )  

 export default upload;