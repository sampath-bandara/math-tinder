const Sequelize = require('sequelize');
const config = require('./../config');

const Student = config.define('student',{
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
    grade: {
        type: Sequelize.INTEGER,
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
    address: {
        type: Sequelize.STRING,
        allowedNull: false
    },
    image: {
        type: Sequelize.STRING,
        allowedNull: true
    },
},{timestamps: false});

module.exports = Student;