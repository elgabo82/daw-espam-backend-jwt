/*
Autenticación de rutas de usuario
*/

const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

router.get('/admin', verifyToken, isAdmin, (req, res)=> {
    res.json({
        ok: true,
        mensaje: 'Bienvenido al área de administración',
        usuario: req.usuario
    });
});

router.get('/private', verifyToken, (req, res)=>{
    res.json({
        ok: true,
        mensaje: 'Ruta privada accesible con token válido',
        usuario: req.usuario
    });
});

module.exports = router;