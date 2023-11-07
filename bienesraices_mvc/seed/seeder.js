// Importamos el process de node
import { exit } from "node:process";
// Importamos la Base de Datos
import db from "../config/db.js";

        // Categorias
// Importamos el Seeder de Categorias
import seedCategorias from "./seedCategorias.js";

        // Precios
// Importamos el Seeder de Precios
import seedPrecios from "./seedPrecios.js";

        // Usuarios
import seedUsuarios from "./seedUsuarios.js";

// Importamos las Asociaciones
import { Categoria, Precio, Usuario } from "../models/asociaciones.js";

const importarDatos = async () => {

    try {
        
        // Autenticar la Base de Datos
        await db.authenticate()

        // Generar las Columnas
        await db.sync() // sync() -> Crea las columnas/bd

        // Insertamos los datos dentro de un promise.all
        await Promise.all([

            Categoria.bulkCreate(seedCategorias), // bulkCreate() -> Inserta todos los datos que le pasamos a las categorias
            Precio.bulkCreate(seedPrecios),
            Usuario.bulkCreate(seedUsuarios)
        ])

        // Mensaje de Confiemación con SweetAlert2
        console.log('!Datos Importados Correctamente¡')
        exit() // Aquí colocamos exit() con el valor de supuesto 0, significa que fue correcto, y si fuese exit(1) es porque hay error

    } catch (error) {
        console.log(error);

        exit(1) // Al trabajar con Seeder, este trabaja directamente con la base de datos, y esto es equivalente al término o cierre de procesos.
    }

}

// Eliminar datos con el Seeder
const eliminarDatosSeeder = async () => {

    try {
        
        await Promise.all([

            // Categoria.destroy( { where: {}, truncate: true } ), // destroy() -> Se encargar de eliminar todos los registros
            //Precio.destroy( { where: {}, truncate: true } )
            await db.sync( { force: true } )

        ])
        console.log('!Datos Eliminados Correctamente¡');
        exit();

    } catch (error) {
        console.log(error)
        exit(1);
    }

}

// Agregamos una validación
// El: process.argv[2] significa en si: "db:importar": "node ./seed/seeder.js -i" que viene desde el package.json
// Lo que significa que: node es la posición [0], ./seed/seeder.js es la posición [1] y como último, -i es la posicion [2]
if (process.argv[2] === "-i") { // argv -> Elemento interno de Node, es una forma en la que le pasas arguementos a un comando desde la terminal, -i es insertar
    importarDatos(); // Jalamos la constante
    
}

if (process.argv[2] === "-e") { // -e -> es Eliminar
    
    eliminarDatosSeeder();

}