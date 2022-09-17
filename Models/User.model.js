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

        profile_image: {
            type: Sequelize.STRING,
            validate: {
                len: [0, 1024]
            },
            allowNull: true,
            defaultValue: '/propic/default.png'
        },

        is_online : {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        showOnline : {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },

        profile_image_public : {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },

        read_receipt : {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }

    });
    return User;
};