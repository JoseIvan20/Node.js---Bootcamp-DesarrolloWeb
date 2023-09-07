import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import db from "../config/db.js"

const Usuario = db.define('usuarios', { // Definir un nuevo modelo
    nombre: {
        type: DataTypes.STRING, // Será de tipo texto -> nombre varchar(30)
        allowNull: false // No puede ir vacío.
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
}, {
    hooks: {
        beforeCreate: async function(usuario) {
            const salt = await bcrypt.genSalt(10)
            usuario.password = await bcrypt.hash( usuario.password, salt);
        }
    }
});

// Método Personalizado para comparar las password.
Usuario.prototype.verificarPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

// Importamos el Modelo
export default Usuario;