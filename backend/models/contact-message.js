const Sequelize = require('sequelize');
const config = require('./../config');

const ContactMessage = config.define('contact-message',{
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
    email: {
        type: Sequelize.STRING,
        allowedNull: false
    },
    message: {
        type: Sequelize.STRING,
        allowedNull: false
    },
},{timestamps: false});

module.exports = ContactMessage;