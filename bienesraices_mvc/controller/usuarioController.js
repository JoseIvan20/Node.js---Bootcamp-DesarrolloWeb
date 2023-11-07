// Dependencias
import { check, validationResult } from "express-validator";
// bcrypt
import bcrypt from "bcrypt";
// Importamos el modelo de Usuario
import Usuario from "../models/ModelUsuarios.js";
// Generador de Id de Token
import { generarId, generarJWT } from "../helpers/tokens.js";
// Emails
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js"

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    });
}

const autenticarUsuario = async (req, res) => {
    // Validación 
    await check('email').isEmail().withMessage('El Email es obligatorio').run(req);
    await check('password').notEmpty().withMessage('El password es obligatorio').run(req);

    let resultado = validationResult(req);
    // Verificar que el resultado este vacío
    if (!resultado.isEmpty()) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    // Comprobar si el usuario existe
    const { email, password } = req.body;
    const usuario = await Usuario.findOne( { where: { email } } )

    if (!usuario) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario NO Existe'}]
        })
    }

    // Comprobar si esta confirmado el usuario
    if (!usuario.confirmado) {
        return res.render('auth/login', {
            pagina: '',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Tu Cuenta NO ha sido Confirmada.'}]
        })
    }

    // Revisar el Password
    if (!usuario.verificarPassword(password)) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores:[{msg: 'El Password es INCONRRECTO'}]
        })
    }

    // Autenticar Usuario con la importación y exportación de JWT proveniente de 'tokens.js'
    const token = generarJWT({ id: usuario.id, nombre: usuario.nombre });
    console.log(token);

    // Almacenar en un cookie la JWT
    return res.cookie('_token', token, {
        httpOnly: true,
        // secure: true
    }).redirect('/mis-propiedades');
}

// Formulario de Registro
const formularioRegistro = (req, res) => {
    // Le pasamos el csrf
    // console.log(req.csrfToken());
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    })
}
const registrarUsuario = async (req, res) => {

    // Validación de los campos
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacío.').run(req);
    await check('email').isEmail().withMessage('Eso no parece un Email.').run(req);
    await check('password').isLength({ min: 6 }).withMessage('El Password debe tener al menos 6 caracteres.').run(req);
    await check('repetir_password').equals('password').withMessage('Las Password no son iguales.').run(req);

    let resultado = validationResult(req); // Valida e lestado de los campos del formulario

    // Verificar que el resultado este vacío
    if (!resultado.isEmpty()) {
        // Errores
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })

    }

    // Verificar que el usuario no este duplicado -> Con 'where', estamos identificando
    // Extraer los datos
    const { nombre, email, password } = req.body; 
    const existeUsuario = await Usuario.findOne({ where: { email } });
    // Validación de la existencia de usuario
    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: `El Usuario: ${req.body.email}, ya esta registrado. Intenta con otro.`}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    // Almacenar un usuario 
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    //  Envía EMail de Confirmación
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    // Envíar mensaje de confirmación, se ejcuta después del await de create Usuario
    res.render('templates/mensaje', {
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos Envíado un Mensaje de Confirmación, presiona el enlace.'
    })

}

// Función que comprueba una cuenta
const confirmarEmail = async (req, res) => {
    const { token } = req.params;

    // Verificar si el 'token' es válido
    const usuario = await Usuario.findOne({ where: { token } })

    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al Confirmar Cuenta',
            mensaje: 'Hubo un error al Confirmar tú Cuenta, inténta de nuevo',
            error: true
        })        
    }

    // Confirmar Cuenta
    usuario.token = null; // Eliminamos el token
    usuario.confirmado = true;
    await usuario.save(); // Método ORM para guardar los cambios en la BD
    return res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta Confirmada',
        mensaje: 'La cuenta se confirmo correctamente',
    })   

}

// Olvide registro
const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Bienes Raíces',
        csrfToken: req.csrfToken(),
    })
}

const resetPassword = async (req, res) => {
    // Validaciones 
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)

    let resultado = validationResult(req);

    // Verificar que el resultado este vacío
    if (!resultado.isEmpty()) {
        // Errores
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raíces',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    // Buscar al usuario
    const { email } = req.body;
    const usuario = await Usuario.findOne({ where: { email } })
    
    // Validación
    if (!usuario) {
        return res.render( 'auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raíces',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El Email no pertence a ningún usuario.'}]
        })
    }

    // Generar un Token y envíar el Email
    usuario.token = generarId();
    await usuario.save()

    // Envíar un Email
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    // Renderizar un mensaje
    res.render('templates/mensaje', {
        pagina: 'Reestablece tú Password',
        mensaje: 'Hemos envíado tu Email con las instrucciones.'
    })
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const usuario = await Usuario.findOne( { where: {token} } )

    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Reestablece tú Password',
            mensaje: 'Hubo un error al validar tú información, intenta de nuevo.',
            error: true
        })
    }

    // Mostrar formulario para validar password
    res.render('auth/reset-password', {
        pagina: 'Reestablece tú Password',
        csrfToken: req.csrfToken()
    })

}

const nuevoPassword = async (req, res) => {
    // Validar Password
    await check('password').isLength({ min:6 }).withMessage('El Password debe ser de al menos 6 carácteres').run(req);
    
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        // Errores
        return res.render('auth/reset-password', {
            pagina: 'Reestablece tú Password',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    const { token } = req.params;
    const { password } = req.body;

    // Identificar quien hace el nuevo cambio
    const usuario = await Usuario.findOne({ where: {token} })

    // Hashear el Nuevo Password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash( password, salt);
    // Eliminamos el Token
    usuario.token = null;

    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Password Reestablecido',
        mensaje: 'El Password se guardó correctamente.'
    })

}

export {
    formularioLogin,
    autenticarUsuario,
    formularioRegistro,
    registrarUsuario,
    confirmarEmail,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}