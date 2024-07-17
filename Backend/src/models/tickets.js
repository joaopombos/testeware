const Sequelize = require("sequelize");
const sequelize = require("../models/database");
const Clientes = require("./clientes");

const Tickets = sequelize.define("tickets", {
  nif: {
    type: Sequelize.STRING(9),
    allowNull: false,
    references: {
      model: Clientes,
      key: "nif"
    }
  },
  idticket: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  assunto: {
    type: Sequelize.STRING(60),
    allowNull: true
  },
  dataabert: {
    type: Sequelize.DATE,
    allowNull: true
  },
  datafecho: {
    type: Sequelize.DATE,
    allowNull: true
  },
  estado: {
    type: Sequelize.STRING(30),
    allowNull: true
  }
}, {
  tableName: "tickets",
  schema: "public",
  timestamps: false,
  indexes: [
    {
      name: "pk_tickets",
      unique: true,
      fields: [{ name: "idticket" }]
    },
    {
      name: "relationship_10_fk",
      fields: [{ name: "nif" }]
    },
    {
      name: "tickets_pk",
      unique: true,
      fields: [{ name: "idticket" }]
    }
  ]
});

Tickets.belongsTo(Clientes, { foreignKey: "nif" });

module.exports = Tickets;
