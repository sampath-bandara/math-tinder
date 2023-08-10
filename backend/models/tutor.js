const Sequelize = require('sequelize');
const config = require('./../config');

const Tutor = config.define('tutor',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowedNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowedNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowedNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowedNull: false
    },
    phone: {
        type: Sequelize.INTEGER,
        allowedNull: false
    },
    qualification_id: {
        type: Sequelize.INTEGER,
        allowedNull: false
    },
    experience_id: {
        type: Sequelize.INTEGER,
        allowedNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowedNull: false
    },
    image: {
        type: Sequelize.STRING,
        allowedNull: true
    },
},{timestamps: false});

module.exports = Tutor;