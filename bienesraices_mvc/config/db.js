import { Sequelize } from "sequelize";
// dotenv
import dotenv from "dotenv";
// Ubicación de dotenv
dotenv.config({path: '.env'});

const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS ?? '', {
    host: process.env.BD_HOST, // localhost 
    port: 3306, // Puerto del local
    dialect: 'mysql', // Motor de BD a utilizar
    define: { // 
        timestamps: true // Agrega 2 columnas a la BD, que son: 'Cuándo fue creado', y 'Cuándo fue actualizado'
    },
    pool: { // Conexión pool de Sequelize.
        max: 5, // Máximo 5 conexiones a la vez
        min: 0, // Mínimo 0 conexiones a BD
        acquire: 30000, // Tiempo estimado para elaborar una conexión antes de un error
        idle: 10000 // Tiempo estimado para mantener la conexión cuando no hay mov
    },
    operatorsAliases: false
})

export default db;