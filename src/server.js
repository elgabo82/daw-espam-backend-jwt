/*
 Servidor de la aplicación
*/

require('dotenv').config();
const app = require('./app');
const db = require('./models');
const PORT = process.env.PORT || 3000;

const iniciarServidor = async ()=> {
    try {
        await db.sequelize.authenticate();
        console.log('Conexión a la base de datos exitosa.');

        await db.sequelize.sync({ alter: true});
        console.log('Modelos sincronizados correctamente.');

        app.listen(PORT, ()=> {
            console.log(`Servidor funcionando correctamente en el puerto: ${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar la aplicación: ', error.message);
    }
};

iniciarServidor();