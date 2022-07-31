module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        userId : {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },

        fullname: {
            type: Sequelize.STRING,
            allowNull: false
        },

        designation: {
            type: Sequelize.STRING,
            validate: {
                len: [0, 50]
            },
            allowNull: true
        },

        about : {
            type: Sequelize.STRING,
            validate: {
                len: [0, 255]
            },
            allowNull: true
        },

        location : {
            type: Sequelize.STRING,
            validate: {
                len: [0, 100]
            },
            allowNull: true
        },

        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },

        phone: {
            type: Sequelize.STRING,
            unique : true,
            validate: {
                len: [0, 10]
            }
        },

        password: {
            type: Sequelize.STRING,
            allowNull : false
        },

    });
    return User;
};