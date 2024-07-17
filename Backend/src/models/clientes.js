const Sequelize = require("sequelize");
const sequelize = require("../models/database");
const Empresas = require("./empresas");
const TipoUser = require("./tipouser");

const Clientes = sequelize.define("clientes", {
  emp_nif: {
    type: Sequelize.STRING(9),
    allowNull: false,
    references: {
      model: Empresas,
      key: "nif",
    },
  },
  iduser: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: TipoUser,
      key: "iduser",
    },
  },
  nome: {
    type: Sequelize.STRING(1024),
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING(1024),
    allowNull: true,
  },
  codigopessoal: {
    type: Sequelize.STRING(12),
    allowNull: true,
  },
  contacto: {
    type: Sequelize.STRING(30),
    allowNull: true,
  },
  nif: {
    type: Sequelize.STRING(9),
    allowNull: false,
    primaryKey: true,
  },
}, {
  tableName: "clientes",
  schema: "public",
  timestamps: false,
  indexes: [
    {
      name: "clientes_pk",
      unique: true,
      fields: [{ name: "nif" }],
    },
    {
      name: "pk_clientes",
      unique: true,
      fields: [{ name: "nif" }],
    },
  ],
});

Clientes.belongsTo(Empresas, { foreignKey: "emp_nif" });
Clientes.belongsTo(TipoUser, { foreignKey: "iduser" });

module.exports = Clientes;
