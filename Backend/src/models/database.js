const Sequelize = require("sequelize");

const sequelize = new Sequelize({
  database: "warebd",
  username: "warebd_user",
  password: "MkoQDynXsw6PcSzyF1hHhi4aBPTZWUeh",
  host: "dpg-cpup1qqj1k6c738f3fbg-a",
  port: 5432,
  dialect: "postgres",
});

module.exports = sequelize;
