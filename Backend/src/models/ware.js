const Sequelize = require("sequelize");
const sequelize = require("./database");

const Ware = sequelize.define("ware", {
  username: {
    type: Sequelize.STRING(20),
    allowNull: true
  },
  password: {
    type: Sequelize.STRING(20),
    allowNull: true
  },
  lucros: {
    type: Sequelize.REAL,
    allowNull: true
  },
  gastos: {
    type: Sequelize.REAL,
    allowNull: true
  },
  idware: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  }
}, {
  tableName: "ware",
  schema: "public",
  timestamps: false,
  indexes: [
    {
      name: "pk_ware",
      unique: true,
      fields: [{ name: "idware" }]
    },
    {
      name: "ware_pk",
      unique: true,
      fields: [{ name: "idware" }]
    }
  ]
});

module.exports = Ware;
