// db.js
const mongoose = require('mongoose');

let connection = null; // Connexion unique.

module.exports = {
    initDatabase: function() {
        if (!connection) {
            // Si la connexion n'existe pas...
            mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            connection = mongoose.connection;

            // Gestion des événements de connexion
            connection.on('error', (err) => {
                console.error('Erreur de connexion à la base de données :', err);
                throw err;
            });
            connection.once('open', () => {
                console.log('Connexion à la base de données établie avec succès !');
            });
        }

        return connection; // Renvoie la connexion existante ou nouvellement créée.
    },
};