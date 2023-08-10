const Sequelize = require('sequelize');

let database = 'math-tinder-app-db';
let username = 'root';
let password = 'password';

const config = new Sequelize(database, username, password, {dialect: 'mariadb'});

module.exports = config;