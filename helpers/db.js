const Sequelize = require("sequelize");

const db = new Sequelize("photo_studio_db", "root", "", {
    dialect: "mysql",
    host: "localhost"
});

module.exports = db;