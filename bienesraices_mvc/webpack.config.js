// Importamos path para las rutas absolutas
import path from "path"

export default {
    mode: 'development', // 
    entry: {  // entry es un objeto
        mapa: './src/js/mapa.js', // Este js lo va a leer, lo va a guardar en el objeto de output
        agregarImagen: './src/js/agregarImagen.js'
     },
     output: { // Donde quieres que se almacene una vez compilado 
        filename: '[name].js', // Salida, entre corchetes para leer cualquier archivo con la extensión de .js
        path: path.resolve('public/js') // Donde lo va a guardar y debe ser en una ruta absoluta
     }
}