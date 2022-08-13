module.exports = (sequelize, Sequelize) => {
    
    const Chat = sequelize.define("chat", {

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        from_user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        to_user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        message_type: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isIn: [['text', 'image', 'video', 'audio', 'file']]
            },
        },

        message: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        is_read: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
        }


    });

    return Chat;
};