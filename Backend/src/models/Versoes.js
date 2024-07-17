const Sequelize = require("sequelize");
const sequelize = require("./database");
const TiposSoftwares = require("./tipossoftwares");

const Versoes = sequelize.define(
  "versoes",
  {
    idversao: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    versao: {
      type: Sequelize.STRING(10),
      allowNull: true,
    },
    datamodifi: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    idproduto: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: TiposSoftwares,
        key: "idproduto",
      },
    },
  },
  {
    tableName: "versoes",
    schema: "public",
    timestamps: false,
    indexes: [
      {
        name: "pk_versoes",
        unique: true,
        fields: [{ name: "idversao" }],
      },
    ],
  }
);

Versoes.belongsTo(TiposSoftwares, { foreignKey: "idproduto" });

module.exports = Versoes;

