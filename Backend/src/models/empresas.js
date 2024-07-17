const Sequelize = require("sequelize");
const sequelize = require("../models/database");

const Empresas = sequelize.define("Empresas", {
  nomeempresa: {
    type: Sequelize.STRING(60),
    allowNull: true,
  },
  nif: {
    type: Sequelize.STRING(9),
    allowNull: false,
    primaryKey: true,
  },
  localizacao: {
    type: Sequelize.STRING(24),
    allowNull: true,
  },
  contacto: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },
}, {
  tableName: "empresas",
  schema: "public",
  timestamps: false,
  indexes: [
    {
      name: "empresas_pk",
      unique: true,
      fields: [{ name: "nif" }],
    },
  ],
});

module.exports = Empresas;
