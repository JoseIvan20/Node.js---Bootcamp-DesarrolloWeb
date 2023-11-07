import { Sequelize } from 'sequelize'
import { Precio, Categoria, Propiedad } from '../models/asociaciones.js'

const inicio = async (req, res) => {

    const [ categorias, precios, casas, departamentos ] = await Promise.all([

        Categoria.findAll( { raw: true } ),
        Precio.findAll( { raw: true } ),
        Propiedad.findAll( { 

            limit: 3,// -> Las 3 nuevas
            where: {
                
                categoriaId: 1

            },
            include: [

                {
                    model: Precio,
                    as: 'precio'
                }

            ], // Módelo

            order: [

                [ 'createdAt', 'DESC' ]
             
            ] // -> De forma descendente

         } ),

         Propiedad.findAll( { 

            limit: 3,// -> Las 3 nuevas
            where: {
                
                categoriaId: 2

            },
            include: [

                {
                    model: Precio,
                    as: 'precio'
                }

            ], // Módelo

            order: [ 
                
                [ 'createdAt', 'DESC' ] 
            
            ] // -> De forma descendente

         } )

    ])

    res.render('inicio', {

        pagina: 'Inicio',
        categorias,
        precios,
        casas,
        departamentos,
        csrfToken: req.csrfToken()

    } )

}

const categorias = async (req, res) => {

    const { id } = req.params

    // Comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id)
    if (!categoria) {

        return res.redirect('/404')

    }

    // Obtener las propiedades
    const propiedades = await Propiedad.findAll({

        where: {

            categoriaId: id

        },
        include: [

            {

                model: Precio, as: 'precio'

            }

        ]

    })

    res.render('categoria', {
        
        pagina: `${categoria.nombre}s En Venta`,
        propiedades,
        csrfToken: req.csrfToken()

    })

}

const noEncontrado = (req, res) => {

    res.render('404', {

        pagina: 'Error 404',
        csrfToken: req.csrfToken()

    })

}

const buscador = async (req, res) => {

    const { termino } = req.body

    // Validar que termino no este vacío
    if (!termino.trim()) {
        
        return res.redirect('back')

    } else {
        
        // Consultar las propiedades
        const propiedades = await Propiedad.findAll({

            where: {

                // Columna para habilitar la búsqueda
                titulo: {

                    [ Sequelize.Op.like ] : '%' + termino + '%' // % termino % -> Buscar en cualquier el termino el cualquier lugar del titulo

                }

            },
            include: [

                {

                    model: Precio, as: 'precio'

                }

            ]

        })

        res.render('busqueda', {

            pagina: 'Resultados de la búsqueda',
            propiedades,
            csrfToken: req.csrfToken() 

        })

    }

}

export {

    inicio,
    categorias,
    noEncontrado,
    buscador

}