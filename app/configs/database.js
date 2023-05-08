module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "root",
  PASSWORD: process.env.DB_PASSWORD || "root",
  DB: process.env.DB_NAME || "db_sequelize",
  dialect: "mysql"
};