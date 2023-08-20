const Sequelize = require('sequelize');
const config = require('./../config');

const Message = config.define('message',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowedNull: false,
        primaryKey: true
    },
    sender_role: {
        type: Sequelize.STRING,
        allowedNull: false
    },
    tutor_id: {
        type: Sequelize.INTEGER,
        allowedNull: false
    },
    student_id: {
        type: Sequelize.INTEGER,
        allowedNull: false
    },
    new_message: {
        type: Sequelize.STRING,
        allowedNull: false
    },
    message_date: {
        type: Sequelize.DATE,
        allowedNull: false
    }
},{timestamps: false});

module.exports = Message;