module.exports = (sequelize, Sequelize) => {
    const UploadedFiles = sequelize.define("uploaded_files", {

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        user_id : {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        file_name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },

        file_original_name: {
            type: Sequelize.STRING,
            allowNull: false
        },

        file_path: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },

        file_type: {
            type: Sequelize.STRING,
            allowNull: false
        },

        file_size: {
            type: Sequelize.STRING,
            allowNull: false
        },

        file_extension: {
            type: Sequelize.STRING,
            allowNull: false
        },

    });
    return UploadedFiles;
};