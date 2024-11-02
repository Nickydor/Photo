const Sequelize = require("sequelize");

const db = require('../helpers/db');

const Photos = db.define("photos", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    title: Sequelize.STRING, 
    description: Sequelize.TEXT, 
    image_url: Sequelize.STRING, 
});

module.exports = Photos;