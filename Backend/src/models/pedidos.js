const Sequelize = require("sequelize");
const sequelize = require("../models/database");
const Clientes = require("./clientes");

const Pedidos = sequelize.define("pedidos", {
  nif: {
    type: Sequelize.STRING(9),
    allowNull: false,
    references: {
      model: Clientes,
      key: "nif",
    },
  },
  idvenda: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  datavenda: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  precofinal: {
    type: Sequelize.REAL,
    allowNull: true,
  },
  quantidade: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
}, {
  tableName: "pedidos",
  schema: "public",
  timestamps: false,
  indexes: [
    {
      name: "pedidos_pk",
      unique: true,
      fields: [{ name: "idvenda" }],
    },
  ],
});

Pedidos.belongsTo(Clientes, { foreignKey: "nif" });

module.exports = Pedidos;
