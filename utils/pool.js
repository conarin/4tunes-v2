const mysql = require('mysql2');
require('dotenv').config();
const env = process.env;

module.exports = {
    create(database) {
        return mysql.createPool({
            host: env.DB_HOST,
            port: env.DB_PORT,
            user: env.DB_USER,
            password: env.DB_PASSWORD,
            database: database,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            stringifyObjects: false,
            decimalNumbers: true
        }).promise();
    }
};