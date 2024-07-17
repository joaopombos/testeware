const Sequelize = require("sequelize");
const sequelize = require("./database");
const Clientes = require("./clientes");
const TiposSoftwares = require("./tipossoftwares");

const Orcamentos = sequelize.define("orcamentos", {
  nif: {
    type: Sequelize.STRING(9),
    allowNull: false,
    references: {
      model: Clientes,
      key: "nif",
    },
  },
  idproduto: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: TiposSoftwares,
      key: "idproduto",
    },
  },
  idorc: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  estado: {
    type: Sequelize.STRING(30),
    allowNull: true,
  },
  quantidade: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  precoorcamento: {
    type: Sequelize.REAL,
    allowNull: true,
  },
}, {
  tableName: "orcamentos",
  schema: "public",
  timestamps: false,
  indexes: [
    {
      name: "orcamentos_pk",
      unique: true,
      fields: [{ name: "idorc" }],
    },
  ],
});

Orcamentos.belongsTo(Clientes, { foreignKey: "nif" });
Orcamentos.belongsTo(TiposSoftwares, { foreignKey: "idproduto" });

module.exports = Orcamentos;
