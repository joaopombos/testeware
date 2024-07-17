const Sequelize = require("sequelize");
const sequelize = require("../models/database");

const TipoUser = sequelize.define("tipouser", {
  designacao: {
    type: Sequelize.STRING(30),
    allowNull: true
  },
  iduser: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  }
}, {
  tableName: "tipouser",
  schema: "public",
  timestamps: false,
  indexes: [
    {
      name: "pk_tipouser",
      unique: true,
      fields: [{ name: "iduser" }]
    }
  ]
});

module.exports = TipoUser;
