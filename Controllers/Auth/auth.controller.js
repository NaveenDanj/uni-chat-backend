const express = require('express');
const db = require("../../Database");
const router = express.Router();
const Joi = require('../../Config/validater.config');
const {generateToken , generateUserId} = require('../../Services/Jwt.service');
const {hashPasswod , comparePassword} = require('../../Services/hash.service');
const AuthRequired = require('../../Middlewares/AuthRequired.middleware');

router.post('/register' , async (req ,res) => {

    const validator = Joi.object({
        fullname: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        device_name: Joi.string().required(),
    });

    try{
        let data = await validator.validateAsync(req.body , {abortEarly: false});

        // check if user exists by email or phone
        let checkUser = await db.users.findOne({
            where: {
                [db.Sequelize.Op.or]: [
                    {email: data.email},
                    {phone: data.phone}
                ]
            }
        });

        if(checkUser){
            console.log(checkUser)
            return res.status(400).json({error: 'User already exists'});
        }

        // create user

        let hashed_password = await hashPasswod(data.password);

        let user = await db.users.create({
            userId : generateUserId(),
            fullname: data.fullname,
            phone: data.phone,
            email: data.email,
            password: hashed_password
        });

        // generate token
        const token = generateToken(data.email);

        // save token
        await db.access_tokens.create({
            token: token,
            user_id: user.id,
            device: data.device_name
        });

        // return user
        return res.status(200).json({
            user: user,
            token: token
        });


    }catch(err){
        return res.status(400).json({
            error: err.message
        });
    }


});


router.post('/login' , async (req , res) => {

    const validator = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        device_name: Joi.string().required()
    });

    try{

        let data = await validator.validateAsync(req.body , {abortEarly: false});

        // check if user exists by email
        let user = await db.users.findOne({
            where: {
                email: data.email
            }
        });

        if(!user){
            return res.status(400).json({error: 'User does not exist'});
        }

        // check password
        let validPassword = await comparePassword(data.password , user.password); 

        if(!validPassword){
            return res.status(400).json({error: 'Invalid password'});
        }

        // generate token
        const token = generateToken(data.email);

        // save token
        await db.access_tokens.create({
            token: token,
            user_id: user.id,
            device: data.device_name
        });

        // get user without password
        let ret_user = await db.users.findOne({
            where: {
                email: data.email
            },
            attributes: { exclude: ['password'] }
        });

        // return user
        return res.status(200).json({
            user: ret_user,
            token: token
        });

    }catch(err){

        return res.status(400).json({
            error: err.message
        });
    }

});


router.get('/current-user' , AuthRequired() , async (req , res) => {

    return res.status(200).json({
        user: req.user.user
    });

});

module.exports = router;