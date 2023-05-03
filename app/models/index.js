const dbConfig = require("../configs/database.js");
let fs = require("fs");
let path = require("path");
let basename = path.basename(module.filename);

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
});


const db = {};

fs.readdirSync(__dirname).filter(function (file) {
  return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
}).forEach(function (file) {
  // let model = sequelize['import'](path.join(__dirname, file));
  let model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
  db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
      db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;