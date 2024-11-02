const Sequelize = require("sequelize");

const db = require('../helpers/db');

const Users =  db.define("users", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type:Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Users;