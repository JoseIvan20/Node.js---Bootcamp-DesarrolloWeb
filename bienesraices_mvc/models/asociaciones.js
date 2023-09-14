// Archivo de Asociaciones - Relaciones de Tablas

import Propiedad from "./ModelPropiedades.js";
import Precio from "./ModelPrecio.js";
import Categoria from "./ModelCategoria.js";
import Usuario from "./ModelUsuarios.js";

// Definimos la primer relación
// Precio.hasOne(Propiedad) // hasOnde -> Suena ser de Derecha a Izquierda

Propiedad.belongsTo( Precio, { foreignKey: 'precioId' } ) // Es algo cruzado, y ambas son una relación 1 a 1. foreignKey
Propiedad.belongsTo( Categoria, { foreignKey: 'categoriaId' } )
Propiedad.belongsTo( Usuario, { foreignKey: 'usuarioId' } )

export {
    Propiedad,
    Precio,
    Categoria,
    Usuario
}