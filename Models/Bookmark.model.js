module.exports = (sequelize, Sequelize) => {
    const Bookmark = sequelize.define("bookmark", {

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        user_id : {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        type: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isIn: [['text', 'image', 'video', 'audio', 'file']]
            },
        },
        
        stored_in: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isIn: [['private', 'group']]
            },
        },

        chat_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        message : {
            type: Sequelize.STRING,
            allowNull: false,
        },

    });
    return Bookmark;
};