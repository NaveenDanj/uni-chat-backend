module.exports = (sequelize, Sequelize) => {
    const AccessToken = sequelize.define("access_tokens", {

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        token: {
            type: Sequelize.STRING,
            allowNull: false
        },

        blocked: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        device: {
            type: Sequelize.STRING,
            allowNull: false
        },

    });
    return AccessToken;
};