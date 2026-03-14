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
            expiresIn: process.env.JWT_EXPIRES_IN || '2h'
        }
    );
};

// Registro de usuario
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
        
        const nuevoUsuario = await User.create({
            nombres,
            email,
            password: passwordHash,
            rol: rol || 'usuario'
        });

        // Se genera el token conforme la estructura del nuevo usuario
        const token = generarToken(nuevoUsuario);

        return res.status(201).json({
            ok: true,
            mensaje: 'Usuario registrado exitosamente.',
            data: {
                id: nuevoUsuario.id,
                nombres: nuevoUsuario.nombres,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol,
                token
            }
        });
    } catch (error) { // Fin del try
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al registrar o crear el usuario',
            error: error.message
        });
    }
};

// Inicio de sesión
const login = async (req, res) =>{
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Correo y clave son obligatorios.'
            });
        }

        // Se busca el usuario por correo
        const usuario = await User.findOne({where: {email}});

        // Validación del usuario
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales inválidas.'
            });
        }

        // Validación del estado

        if (!usuario.estado) {
            return res.status(403).json({
                ok: false,
                mensaje: 'Usuario inactivo.'
            });
        }

        const passwordValido = await bcrypt.compare(password, usuario.password);

        if (!passwordValido) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Credenciales incorrectas.'
            });
        }

        // Se genera el token de sesión
        const token = generarToken(usuario);

        return res.status(200).json({
            ok: true,
            mensaje: 'Inicio de sesión correcto.',
            data: {
                id: nuevoUsuario.id,
                nombres: nuevoUsuario.nombres,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol,
                token
            }
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al iniciar sesión.',
            error: error.message
        });
    }
};

// Perfil del usuario
const profile = async (req, res)=> {
    try {
        const usuario = await User.findByPk(req.usuario.id, {
            attributes: { exclude: ['password']}
        });

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Usuario no encontrado.'
            });
        }

        return res.status(200).json({
            ok: true,
            data: usuario
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener el perfil del usuario.',
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    profile
};