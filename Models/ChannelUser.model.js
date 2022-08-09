module.exports = (sequelize, Sequelize) => {
    const ChannelUser = sequelize.define("channel_user", {

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        channel_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        user_role: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isIn: [['admin', 'member']]
            },
            defaultValue: 'member'            
        },

        user_status: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isIn: [['active', 'inactive']]
            },
            defaultValue: 'active'
        },

        user_joined_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        }

    });
    return ChannelUser;
};