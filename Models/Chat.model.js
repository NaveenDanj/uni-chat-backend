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

        send_to : {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isIn: [['private', 'group']]
            },
            defaultValue: 'private'
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

    });

    return Chat;
};