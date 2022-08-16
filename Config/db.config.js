require('dotenv').config()

module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: process.env.MYSQL_PASSWORD,
    DB: "unichat",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };