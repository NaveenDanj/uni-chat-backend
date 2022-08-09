module.exports = (sequelize, Sequelize) => {
    const Channel = sequelize.define("channel", {

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        channel_unique_id: { //could use this as room id in socket connection
            type: Sequelize.STRING,
            allowNull: false
        },

        channel_name: {
            type: Sequelize.STRING,
            allowNull: false
        },

        channel_type: {
            type: Sequelize.STRING,
            allowNull: false
        },

        channel_description: {
            type: Sequelize.STRING,
            allowNull: false
        },

        channel_avatar: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        },

        member_count: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        channel_created_by: {
            // user id
            type: Sequelize.INTEGER,
            allowNull: false
        },

        // channel settings
        is_private: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        is_locked: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },



    });
    return Channel;
};