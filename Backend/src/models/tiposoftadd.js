const Sequelize = require("sequelize");
const sequelize = require("./database");
const Pedidos = require("./pedidos");

const Tiposoftadd = sequelize.define("TipoSoftAdd", {
 designcaosoftadd: {
    type: Sequelize.STRING(60),
    allowNull: true
  },
  idtipo: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  }
}, {
  tableName: "TipoSoftAdd",
  schema: "public",
  timestamps: false,
  indexes: [
    {
      name: "pk_tiposoftadd",
      unique: true,
      fields: [{ name: "idtipo" }]
    },
    {
      name: "tiposoftadd_pk",
      unique: true,
      fields: [{ name: "idtipo" }]
    },
  ]
});



module.exports = Tiposoftadd;
