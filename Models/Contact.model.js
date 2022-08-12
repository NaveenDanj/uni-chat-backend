module.exports = (sequelize, Sequelize) => {
    const Contact = sequelize.define("contacts", {

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        contact_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        contact_name : {
            type: Sequelize.STRING,
            allowNull: false
        },

        blocked: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

    });
    return Contact;
};