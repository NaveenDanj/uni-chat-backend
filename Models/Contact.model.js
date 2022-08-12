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

        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        },

        updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        }

    });
    return Contact;
};