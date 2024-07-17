const Sequelize = require("sequelize");
const sequelize = require("../models/database");
const SoftwaresAdquiridos = require("./softwaresadquiridos");

const LicencasAtribuidas = sequelize.define("licencasatribuidas", {
  chaveproduto: {
    type: Sequelize.STRING(12),
    allowNull: true,
    references: {
      model: SoftwaresAdquiridos,
      key: "chaveproduto",
    },
  },
  nomepc: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },
  dataatri: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  idatribuida: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
}, {
  tableName: "licencasatribuidas",
  schema: "public",
  timestamps: false,
  indexes: [
    {
      name: "licencasatribuidas_pk",
      unique: true,
      fields: [{ name: "idatribuida" }],
    },
  ],
});

LicencasAtribuidas.belongsTo(SoftwaresAdquiridos, { foreignKey: "chaveproduto" });

module.exports = LicencasAtribuidas;
