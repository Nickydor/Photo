const Sequelize = require("sequelize");

const db = require('../helpers/db');

const Bookings = db.define("bookings", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    }, 
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    }, 
    phone: {
        type: Sequelize.STRING,
        allowNull: false,
    }, 
    date: {
        type: Sequelize.STRING,
        allowNull: false,
    }, 
    service:{
        type: Sequelize.STRING,
        allowNull: false,
    }, 
    comments: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

module.exports = Bookings;
