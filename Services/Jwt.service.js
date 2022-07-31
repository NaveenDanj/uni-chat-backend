const jwt = require('jsonwebtoken');
const Uuid = require('uuid');

module.exports = {

    generateToken(email){
        return jwt.sign( {email : email} , process.env.JWT_SECRET , {expiresIn: '30d'});
    },

    generateUserId(){
        return Uuid.v4();
    }

};