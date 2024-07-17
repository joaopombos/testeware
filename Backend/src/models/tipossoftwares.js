const Sequelize = require("sequelize");
const sequelize = require("../models/database");
const TipoSoftAdd = require("./tiposoftadd");

const TipoSoftwares = sequelize.define("tipossoftwares", {
  categoria: {
    type: Sequelize.STRING(30),
    allowNull: true
  },
  idproduto: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  idtipo: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: TipoSoftAdd,
      key: "idtipo"
    }
  },
  logotipo: {
    type: Sequelize.BLOB,
    allowNull: true
  },
  nome: {
    type: Sequelize.STRING(30),
    allowNull: true
  },
  versao: {
    type: Sequelize.STRING(10),
    allowNull: true
  },
  descricao: {
    type: Sequelize.STRING(250),
    allowNull: true
  },
  imagenssoftware: {
    type: Sequelize.BLOB,
    allowNull: true
  },
  precoproduto: {
    type: Sequelize.REAL,
    allowNull: true
  }
}, {
  tableName: "tipossoftwares",
  schema: "public",
  timestamps: false,
  indexes: [
    {
      name: "pk_tipossoftwares",
      unique: true,
      fields: [{ name: "idproduto" }]
    },
    {
      name: "relationship_14_fk",
      fields: [{ name: "idtipo" }]
    },
    {
      name: "tipossoftwares_pk",
      unique: true,
      fields: [{ name: "idproduto" }]
    }
  ]
});

TipoSoftwares.belongsTo(TipoSoftAdd, { foreignKey: "idtipo" });

module.exports = TipoSoftwares;
