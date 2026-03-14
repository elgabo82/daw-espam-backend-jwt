/*
Autenticación de rutas
*/

const express = require('express');
const router = express.Router();

const {
    register,
    login,
    profile
} = require('../controllers/auth.controller');

const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, profile);

module.exports = router;