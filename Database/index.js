const dbConfig = require("../Config/db.config");
const Sequelize = require("sequelize");


const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("../Models/User.model")(sequelize, Sequelize);
db.access_tokens = require("../Models/AccessToken.model")(sequelize, Sequelize);
db.channels = require("../Models/Channel.model")(sequelize, Sequelize);
db.channel_users = require("../Models/ChannelUser.model")(sequelize, Sequelize);
db.contacts = require("../Models/Contact.model")(sequelize, Sequelize);
db.chat = require("../Models/Chat.model")(sequelize, Sequelize);
db.uploaded_files = require("../Models/UploadedFiles.model")(sequelize, Sequelize);

db.users.hasMany(db.contacts, {
    foreignKey: 'contact_id'
});

db.contacts.belongsTo(db.users, {
    foreignKey: 'contact_id',
    targetKey: 'id'
});

module.exports = db;