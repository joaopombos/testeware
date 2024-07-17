const Sequelize = require("sequelize");
const sequelize = require("./database");
const TiposSoftwares = require("./tipossoftwares");

const Avaliacoes = sequelize.define("avaliacoes", {
  idproduto: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: TiposSoftwares,
      key: "idproduto",
    },
  },
  idavaliacao: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  comentario: {
    type: Sequelize.STRING(250),
    allowNull: true,
  },
  classificacao: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  dataavaliacao: {
    type: Sequelize.DATE,
    allowNull: true,
  },
}, {
  tableName: "avaliacoes",
  schema: "public",
  timestamps: false,
  indexes: [
    {
      name: "avaliacoes_pk",
      unique: true,
      fields: [{ name: "idavaliacao" }],
    },
    {
      name: "pk_avaliacoes",
      unique: true,
      fields: [{ name: "idavaliacao" }],
    },
  ],
});

Avaliacoes.belongsTo(TiposSoftwares, { foreignKey: "idproduto" });

module.exports = Avaliacoes;
