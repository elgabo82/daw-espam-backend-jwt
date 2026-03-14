/*
 Controlador de Autenticación
*/

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generarToken = (usuario) => {
    return jwt.sign(
        {
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '4h'
        }
    );
};


const register = async(req, res)=> {
    try {
        const { nombres, email, password, rol } = req.body;
        if (nombres || email || !password) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Nombres, correo y clave son obligatorios'
            });
        }

        const usuarioExistente = await User.findOne({ where: {email}});

        if (usuarioExistente) {
            return res.status(409).json({
                ok: false,
                mensaje: 'El correo ya está registrado'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        

    }
}

