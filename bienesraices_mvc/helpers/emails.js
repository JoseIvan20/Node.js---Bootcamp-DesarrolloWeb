import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos

    // Envíar Email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tú Cuenta en BienesRaices.com',
        text: 'Confirma tú Cuenta en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, comprueba tú cuenta en BinenesRaices.com</p>

            <p>Tú Cuenta ya está lista, solo debes confirmarla en el siguiente enlace:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirma tú Cuenta</a>
            </p>

            <p>Si tú no Creaste está Cuenta puedes ignorar el mensaje.</p>
        `
    })
}

// Confirmar Email
const emailOlvidePassword = async (datos) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos

    // Envíar Email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Reestablece tu Password en BienesRaices.com',
        text: 'Reestablece tu Password en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, has solicitado cambiar tú Password en BinenesRaices.com</p>

            <p>Sigue el siguiente enlace para generar un Password Nuevo:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Reestablecer     Password</a>
            </p>

            <p>Si tú no Solicitaste el cambio de Password, puedes ignorar el mensaje.</p>
        `
    })
}

export{
    emailRegistro,
    emailOlvidePassword
}