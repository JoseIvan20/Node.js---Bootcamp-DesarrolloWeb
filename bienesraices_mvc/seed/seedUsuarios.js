import bcrypt from "bcrypt";

const usuarios = [

    {
        nombre: 'Ivan',
        email: 'ivanjg1029@gmail.com',
        confirmado: 1,
        password: bcrypt.hashSync('password', 10)
    }

]

export default usuarios;