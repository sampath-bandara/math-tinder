const Sequelize = require('sequelize');
const config = require('../config');

const Request = config.define('request',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowedNull: false,
        primaryKey: true
    },
    tutor_id: {
        type: Sequelize.INTEGER,
        allowedNull: false
    },
    student_id: {
        type: Sequelize.INTEGER,
        allowedNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowedNull: false
    },
},{timestamps: false});

module.exports = Request;