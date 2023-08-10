const Sequelize = require('sequelize');
const config = require('./../config');

const Qualification = config.define('qualification',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowedNull: false,
        primaryKey: true
    },
    level: {
        type: Sequelize.STRING,
        allowedNull: false
    },
},{timestamps: false});

module.exports = Qualification;