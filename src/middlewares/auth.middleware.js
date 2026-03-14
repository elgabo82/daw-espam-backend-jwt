/*
 Middleware de autenticación
 JWT
*/

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Falta el token de sesión.'
            });
        }

        const partes = authHeader.split(' ');

        if (partes.length !== 2 || partes[0] !== 'Bearer') {
            return res.status(401).json({
                ok: false,
                mensaje: 'Estructura inválida del token.'
            });
        }

        const token = partes[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener el perfil del usuario.',
            error: error.message
        });
    }
};

const isAdmin = (req, res, next)=> {
    if (req.usario.rol !== 'admin') {
        return res.status(403).json({
            ok: false,
            mensaje: 'Acceso denegado. Se requiere el rol de administrador.'
        });
    }
    next();
}

module.exports = {
    verifyToken,
    isAdmin
};