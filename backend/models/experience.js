const Sequelize = require('sequelize');
const config = require('./../config');

const Experience = config.define('experience',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowedNull: false,
        primaryKey: true
    },
    category: {
        type: Sequelize.STRING,
        allowedNull: false
    },
},{timestamps: false});

module.exports = Experience;