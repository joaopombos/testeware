const Sequelize = require('sequelize');
const sequelize = require('../models/database');
const Empresas = require('./empresas');

const SoftwaresAdquiridos = sequelize.define('softwaresadquiridos', {
    nome: {
        type: Sequelize.STRING(60),
        allowNull: true
    },
    chaveproduto: {
        type: Sequelize.STRING(12),
        allowNull: false,
        primaryKey: true
    },
    nif: {
        type: Sequelize.STRING(9),
        allowNull: true,
        references: {
            model: Empresas,
            key: 'nif'
        }
    },
    versaoadquirida: {
        type: Sequelize.STRING(30),
        allowNull: true
    }
}, {
    tableName: 'softwaresadquiridos',
    schema: 'public',
    timestamps: false,
    indexes: [
        {
            name: 'pk_softwaresadquiridos',
            unique: true,
            fields: [{ name: 'chaveproduto' }]
        },
        {
            name: 'relationship_17_fk',
            fields: [{ name: 'nif' }]
        },
        {
            name: 'softwaresadquiridos_pk',
            unique: true,
            fields: [{ name: 'chaveproduto' }]
        }
    ]
});

SoftwaresAdquiridos.belongsTo(Empresas, { foreignKey: 'nif' });

module.exports = SoftwaresAdquiridos;

