/*
 Despliegue de la Aplicación
*/

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res)=> {
    res.json({
        ok: true,
        mensaje: 'API funcionando correctamente.'
    });
});


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

module.exports = app;

